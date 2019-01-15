/**
 * @export
 * @interface PostDaoInterface
 */
export interface PostDaoInterface {
     createNewPost(post: any): Q.Promise<any>;
     getReleventPost(user: any): Q.Promise<any>;
     updatePost(user: any): Q.Promise<any>;
}