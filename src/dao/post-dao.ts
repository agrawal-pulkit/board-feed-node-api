import * as mongoose from "mongoose";
import * as Q from "q";
import { PostDaoInterface } from "./interface/post-dao";
import { PostSchema } from "../model/dao-schema/post-dao-schema";

//logger configuration
import { LogConfig } from "../util/log4js-config";
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
     * return relevance posts
     * @public 
     * @param { user } userObject 
     * @returns { Q.Promise<any> }
     * 
     * @memberOf PostDao
     */
    public getReleventPost(user: any): Q.Promise<any> {
        let deferred: Q.Deferred<any> = Q.defer();

        this.PostDaoModel.find({}, null, {sort: {popularityCount: -1, createdAt:-1}}, (error: Error, posts: any) => {
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