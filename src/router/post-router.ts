import * as Q from "q";
import { PostRouterInterface } from "./interfaces/post-router";
import { Router, Request, Response } from "express";
import { PostControllerInterface } from "../controller/interfaces/post-controller";

//logger configuration
import { LogConfig } from "../util/log4js-config";
const log = new LogConfig().getLogger("PostRouter");

/**
 * @exports
 * @class PostRouter
 * @implements { RouterInterface}
 */
export class PostRouter implements PostRouterInterface {
    private router: Router;
    postController : PostControllerInterface;

    /**
     * @constructor
     * @param { PostControllerInterface } postController 
     * 
     * @memberOf PostRouter
     */
    constructor(postController: PostControllerInterface){
        this.postController = postController;
        this.router = Router();
        this.init()
    }

    /**
     * @returns { Router }
     * 
     * @memberOf PostRouter
     */
    getRouter(): Router {
        return this.router;
    }

    /**
     * @return void
     * 
     * @memberOf PostRouter 
     */
    private init(): void {
        this.router.post("/", this.createNewPost.bind(this));
        this.router.get("/", this.getReleventPost.bind(this));
    }

        
    /**
     * 
     * @param { Request } request 
     * @param { Response } response
     * @returns {*} 
     * 
     * @memberOf UserRouter
     */
    createNewPost(request: Request, response: Response): any {
        log.debug("create new User: ", request.body);
        let createNewUserPromise : Q.Promise<any> = this.postController.createNewPost(request, response);

        createNewUserPromise.then((user: any)=>{
            log.debug("createNewUserPromise: ", user);
            return response.status(200).send(user);
        });
        createNewUserPromise.catch((error: Error)=>{
            log.warn("createNewUserPromise: ", error);
            return response.status(500).send(error);
        });
    }

    /**
     * 
     * @param { Request } request 
     * @param { Response } response
     * @returns {*} 
     * 
     * @memberOf UserRouter
     */
    getReleventPost(request: Request, response: Response): any {
        let createNewUserPromise : Q.Promise<any> = this.postController.getReleventPost(request, response);

        createNewUserPromise.then((user: any)=>{
            log.debug("createNewUserPromise: ", user);
            return response.status(200).send(user);
        });
        createNewUserPromise.catch((error: Error)=>{
            log.warn("createNewUserPromise: ", error);
            return response.status(500).send(error);
        });
    }
}