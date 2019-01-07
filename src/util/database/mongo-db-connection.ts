import { MongoDbConnectionInterface } from "./interface/mongo-db-connection";
import * as mongoose from "mongoose";
import * as Q from 'q';

//logger configuration
import { LogConfig } from "../log4js-config";
const log = new LogConfig().getLogger("MongoDbConnection");

/**
 * @export
 * @class MongoDbConnection
 * @implements { MongoDbConnectionInterface }
 */
export class MongoDbConnection implements MongoDbConnectionInterface {

    connection: mongoose.Connection;
    dbConfig: any;

    /**
     * @constructor 
     * @param {*} dbConfig 
     * 
     * @memberOf MongoDbConnection
     */
    constructor(dbConfig : any){
        this.dbConfig = dbConfig;
        this.createDBConnection();
     }
    
    /**
     * get db coonnection 
     * @public
     * @returns { object } mongoose.Connection
     * 
     * @memberOf MongoDbConnection
     */
    public getConnection(): mongoose.Connection {
        return this.connection;
    }

    /**
     * create mongo db connection
     * @public
     * @returns void
     * 
     * @memberOf MongoDbConnection
     */
    public createDBConnection() : void{
        let connectionUrl : string = this.dbConfig;
        this.connection = mongoose.createConnection(connectionUrl);
        log.info("db connection created with url: ", connectionUrl);
        this.openConnection();
    }

    /**
     * open db connection
     * @public
     * @returns { void }
     * 
     * @memberOf MongoDbConnection
     */
    public openConnection() : void{
        this.connection.once('open', () => {
            log.info("open db connection.")
        })
    }

    /**
     * close db connection
     * @public
     * @returns { void }
     * 
     * @memberOf MongoDbConnection
     */
    public closeConnection() : void{
        this.connection.close();
        log.info("close db connection.");
    }

    /**
     * check status of mongo db connection
     * @param { mongoose.Connection } connection 
     * @returns { boolean }
     * 
     * @memberOf MongoDbConnection
     */
    public checkConnectionstatus(connection: mongoose.Connection) : Q.Promise<any> {
        console.log("inside checkConnectionstatus!!");
        let deferred  : Q.Deferred<any> = Q.defer();
        connection.on("error", ()=>{
            log.error("Mongo DB Connection Error");
            deferred.resolve(false)
        });
        connection.on("disconnected", ()=>{
            log.error("Mongo DB Connection Error");
            deferred.resolve(false)
        });
        connection.on("connected", ()=>{
            log.debug("Mongo DB Connection success");
            log.info("Mongo DB Connection success");
            deferred.resolve(true)
        })
        return deferred.promise;
    }
    
}