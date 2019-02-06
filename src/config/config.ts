let config = require("../config");

/**
 * @export
 * @class ApplicationConfig
 */
class ApplicationConfig {
    public static MONGO_DB_URL : string = config.MONGO_DB_URL
    public static PORT : number = 4001;
    public static LOG_DIR = config.LOG_DIR ? config.LOG_DIR : "./logs/";
    public static LOG_FILE_NAME = config.LOG_FILE_NAME ? config.LOG_FILE_NAME : "app.log";
    public static LOG_ERROR_FILE_NAME = config.LOG_ERROR_FILE_NAME ? config.LOG_ERROR_FILE_NAME : "error.log";
    public static LOG_MAX_FILE_SIZE = config.LOG_MAX_FILE_SIZE ? config.LOG_MAX_FILE_SIZE : "100000";
    public static LOG_NO_OF_BACKUPS = config.LOG_NO_OF_BACKUPS ? config.LOG_NO_OF_BACKUPS : "10";
    public static LOG_ENABLE_CONSOLE_LOG = config.LOG_ENABLE_CONSOLE_LOG ? config.LOG_ENABLE_CONSOLE_LOG : true;

}

export = ApplicationConfig;