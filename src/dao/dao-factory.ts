import * as mongoose from "mongoose";
import { PostDaoInterface } from "./interface/post-dao";
import { PostDao } from "./post-dao";
import { DaoFactoryInterface } from "./interface/dao-factory";

/**
 * @exports
 * @class MongoDaoFactory
 * @implements { DaoFactoryInterface }
 * 
 */
export class MongoDaoFactory implements DaoFactoryInterface{
    private postDao : PostDaoInterface;

    /**
     * @constructor
     * @param { mongoose.Connection } connection 
     * 
     * @memberOf MongoDaoFactory
     */
    constructor(connection : mongoose.Connection) {
        this.postDao = new PostDao(connection);
    }

    /**
     * 
     * @returns { PostDaoInterface }
     * 
     * @memberOf MongoDaoFactory
     */
    getPostDao(): PostDaoInterface {
        return this.postDao;
    }

}