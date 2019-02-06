import * as express from "express";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import CONFIG = require("./../config/config");
const sls = require("serverless-http")

//db-connection
import * as mongoose from "mongoose";
// import ConnectMongo = require("connect-mongo");
import { MongoDbConnection } from "../util/database/mongo-db-connection";
import { MongoDbConnectionInterface } from "../util/database/interface/mongo-db-connection";
let connection: mongoose.Connection;
let isMongoConnectionSuccess : boolean = false;

//initialize dependencies
import { DaoFactoryInterface } from "../dao/interface/dao-factory";
import { MongoDaoFactory } from "../dao/dao-factory";
import { PostControllerInterface } from "../controller/interfaces/post-controller";
import { PostController } from "../controller/post-controller";
import { PostRouterInterface } from "../router/interfaces/post-router";
import { PostRouter } from "../router/post-router";
//util 
import { Helper } from "../util/helper"
import { LogConfig } from "../util/log4js-config";

//app start
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());


//logger configuration
const log = new LogConfig().getLogger("App");

let postRouter : PostRouterInterface;



/**
 * global Promise rejection handler
 */
process.on("unhandledRejection", (error:Error) => {
  log.warn("Handling unhandledRejection: ", error);
});

process.on("uncaughtException", (error: Error) => {
  log.warn("Handling Exception: ", error);
})


//db connection
createDBConnection();

/**
 * initialize mongo db connection
 * @function
 * @returns { Promise<any> }
 */
async function createDBConnection() : Promise<any> {
  let mongoDbConnection : MongoDbConnectionInterface= new MongoDbConnection(CONFIG.MONGO_DB_URL);
  connection = mongoDbConnection.getConnection();
  isMongoConnectionSuccess  = await mongoDbConnection.checkConnectionstatus(connection);
  log.debug("isMongoConnectionSuccess: ", isMongoConnectionSuccess);
  isMongoConnectionSuccess ? initializeDependecies() : log.debug("mongo is diconnected");
}

/**
 * for initialize all dependencies
 * @returns { void }
 */
function initializeDependecies() : void {
  	let daoFactory : DaoFactoryInterface = new MongoDaoFactory(connection);
	let postController : PostControllerInterface = new PostController(daoFactory);
	postRouter = new PostRouter(postController);
	getRoutes();
}

/**
 * get routers
 * @returns { void }
 */
function getRoutes() : void {
	app.use("/post", postRouter.getRouter());
}


app.listen(CONFIG.PORT, () => {
  log.info("Dashboard API server listening on port %d ", CONFIG.PORT);
});
// module.exports.connection = connection;
module.exports.server = sls(app)
