import * as mongoose from "mongoose";

/**
 * @export
 * @interface MongoDbConnectionInterface
 */
export interface MongoDbConnectionInterface{
    connection : mongoose.Connection;
    getConnection(): any;
    createDBConnection(): any;
    openConnection(): any;
    closeConnection(): any;
    checkConnectionstatus(connection: mongoose.Connection): Q.Promise<any>;
}