import { PostDaoInterface } from './post-dao';

/**
 * 
 * @export
 * @interface DaoFactoryInterface
 */
export interface DaoFactoryInterface {
    getPostDao() : PostDaoInterface;
}