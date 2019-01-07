import * as Q from "q";
import { Request, Response } from "express";
import { MongoDaoFactory } from "../dao/dao-factory";
import { PostControllerInterface } from "./interfaces/post-controller";
import { PostDaoInterface } from "../dao/interface/post-dao";


//logger configuration
import { LogConfig } from "../util/log4js-config";
import { DaoFactoryInterface } from "../dao/interface/dao-factory";
const log = new LogConfig().getLogger("PostController");

/**
 * @exports
 * @class PostController
 * @implements { PostControllerInterface }
 */
export class PostController implements PostControllerInterface {
    postDao : PostDaoInterface

    /**
     * @constructor 
     * @param { DaoFactoryInterface } daofactory 
     * 
     * @memberOf PostController
     */
    constructor(daofactory : DaoFactoryInterface){
        this.postDao = daofactory.getPostDao();
    }

    /**
     * create new post
     * @param { Request } request
     * @param { Response } response
     * @returns  { Q.Promise<any> }
     * 
     * @memberOf PostController
     */
    createNewPost(request: Request, response: Response ) : Q.Promise<any> {

        let deferred : Q.Deferred<any> = Q.defer();
        let postData : any = request.body
        let createNewPostPromise = this.postDao.createNewPost(postData);

        createNewPostPromise.then((createdPost: any)=>{
            log.debug("created post :", createdPost);
            deferred.resolve({ status : "success", userObject : createdPost });
        })
        createNewPostPromise.catch((error: Error)=>{
            log.warn("error in creating user :", error);
            deferred.reject(error)
        })  

        return deferred.promise;
    }

    /**
     * return relevance post
     * @param { Request } request
     * @param { Response } response
     * @returns  { Q.Promise<any> }
     * 
     * @memberOf PostController
     */
    getReleventPost(request: Request, response: Response ) : Q.Promise<any> {

        let deferred : Q.Deferred<any> = Q.defer();
        let postData : any = request.body
        let getPostsPromise: any = this.postDao.getReleventPost(postData);

        getPostsPromise.then((allPosts: any)=>{
            log.debug("all post :", allPosts);
            deferred.resolve({ status : "success", posts : allPosts });
        })
        getPostsPromise.catch((error: Error)=>{
            log.warn("error in creating user :", error);
            deferred.reject(error)
        })  

        return deferred.promise;
    }

}