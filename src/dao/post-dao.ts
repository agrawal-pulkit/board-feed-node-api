import * as mongoose from "mongoose";
import * as Q from "q";
import { PostDaoInterface } from "./interface/post-dao";
import { PostSchema } from "../model/dao-schema/post-dao-schema";
let moment = require('moment')

//logger configuration
import { LogConfig } from "../util/log4js-config";
import { userInfo } from "os";
const log = new LogConfig().getLogger("PostDao");

type postType = mongoose.Document;

/**
 * @export
 * @implements { PostDaoInterface }
 * @class PostDao
 */
export class PostDao implements PostDaoInterface {
    PostDaoModel: mongoose.Model<postType>;

    /**
     * @constructor
     * @param { mongoose.Connection } connection 
     * 
     * @memberOf PostDao
     */
    constructor(connection: mongoose.Connection) {
        this.PostDaoModel = connection.model<any>('post', PostSchema)
    }

    /**
     * create new Post
     * @public 
     * @param { User } userObject 
     * @returns { Q.Promise<any> }
     * 
     * @memberOf PostDao
     */
    public createNewPost(userObject: any): Q.Promise<any> {
        let deferred: Q.Deferred<any> = Q.defer();
        userObject.popularityCount = userObject.likes.count + userObject.share.count + userObject.comments.count;
        log.debug("create new user with user details: ", userObject);

        this.PostDaoModel.create(userObject, (error: Error, user: any) => {
            try {
                if (error) {
                    log.warn(" createNewUser err: ", error);
                    deferred.reject(error);
                }
                else {
                    log.debug("createNewUseruserdata: ", user);
                    deferred.resolve(user);
                }
            }
            catch (exception) {
                log.debug("Unwanted error");
                throw new exception("Unwanted db error in create user")
            }
        });

        return deferred.promise;
    }

    

    /**
     * 
     * @param updatedPostObject 
     * logic for ranking feeds
     * popularity increase when vote(like, share, comment) increase and popularity decrease when time increse. Using concept of exponenial decay with time.
     * [Nt = N*exp(-lambda*timediff)]
     * by using half life decay formula we are finding popularity score of post based on time.
     * doing all calculation at time of when post is updating(write operation is very less in compare to read operation than response time for post feed will be decrease.)
     * 
     */
    getPopularityCount(lastupdatedTime: any, popularityCount: number, newVote: number){
        let seconds = (moment().diff(moment(lastupdatedTime), 'second')) / (24 * 60 * 60)
        log.debug("seconds", seconds);
        let newPopularityCount = newVote + (popularityCount) * Math.exp(-0.0990 * seconds)
        log.debug(newPopularityCount);
        return newPopularityCount
    }
    /**
     * 
     * @param updatedPostObject 
     */
    updatePost(updatedPostObject: any): Q.Promise<any> {
        let deferred: Q.Deferred<any> = Q.defer();
        log.debug("update post with post details: ", updatedPostObject);
        let postTitle = updatedPostObject.postTitle
        let that = this;
        this.PostDaoModel.findOne({ postTitle: postTitle }, (error: Error, post: any) => {
            try {
                if (error) {
                    log.warn(" findByUserNameAndUpdate err: ", error);
                    deferred.reject(error);
                }
                else {
                    if (updatedPostObject.likes || updatedPostObject.share || updatedPostObject.comments) {
                        updatedPostObject.popularityCount = this.getPopularityCount(post.updatedAt, post.popularityCount, 1)
                    }
                    updatedPostObject.updatedAt = moment()
                    log.debug("updatedPopularityCount: ", updatedPostObject);
                    that.PostDaoModel.findOneAndUpdate({ postTitle: postTitle }, {$set:updatedPostObject}, (error: Error, post: any) => {
                        try {
                            if (error) {
                                log.warn("createNewUser err: ", error);
                                deferred.reject(error);
                            }
                            else {
                                log.debug("getPostdata: ", post);
                                deferred.resolve(post);
                            }
                        }
                        catch (exception) {
                            log.debug("Unwanted error");
                            throw new exception("Unwanted db error in create user")
                        }
                     })
                }
            }
            catch (exception) {
                log.debug("Unwanted error");
                throw new exception("Unwanted db error in update post")
            }
        });

        return deferred.promise;
    }

    /**
     * return relevance posts
     * @public 
     * @param { user } userObject 
     * @returns { Q.Promise<any> }
     * 
     * @memberOf PostDao
     */
    public getReleventPost(user: any): Q.Promise<any> {
        let deferred: Q.Deferred<any> = Q.defer();
        //TODO: finding new popularity score at time of read 
        this.PostDaoModel.find({}, null, { sort: { popularityCount: -1} }, (error: Error, posts: any) => {
            try {
                if (error) {
                    log.warn("createNewUser err: ", error);
                    deferred.reject(error);
                }
                else {
                    log.debug("getPostdata: ", posts);
                    deferred.resolve(posts);
                }
            }
            catch (exception) {
                log.debug("Unwanted error");
                throw new exception("Unwanted db error in create user")
            }
        });

        return deferred.promise;
    }
}