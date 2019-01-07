import { PostDaoInterface } from "../../dao/interface/post-dao";
import { Request, Response } from "express";
/**
 * @export
 * @interface PostControllerInterface
 */
export interface PostControllerInterface {
    postDao : PostDaoInterface;
    createNewPost( request: Request, response: Response) : Q.Promise<any>;
    getReleventPost( request: Request, response: Response) : Q.Promise<any>;
}