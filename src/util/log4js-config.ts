const log4js = require("log4js");
const CONFIG = require("../config/config");
/**
 * @export
 * @class LogConfig
 */
export class LogConfig{

    /**
     * getLogger for particular classes
     * @param {string} className
     * @returns { log4js.Logger }
     * 
     * @memberOf LogConfig
     */
    getLogger(className: string)  {
        let appendersFormat: Array<any> = this.getAppenders();
        if (CONFIG.LOG_ENABLE_CONSOLE_LOG == true) {
            appendersFormat.push({type: 'console'});
            log4js.configure({
                appenders : appendersFormat
            });
        }
        else {
            log4js.configure({
                appenders : appendersFormat
            });
        }
        return log4js.getLogger(className);
    }
    

    /**
     * @returns { Array<any> }
     * 
     * @memberOf LogConfig
     */
    private getAppenders() : Array<any>{
        return [
            {
                type: 'dateFile',
                pattern: "-yyyy-MM-dd",
                alwaysIncludePattern: false,
                filename: CONFIG.LOG_DIR + CONFIG.LOG_FILE_NAME,
                maxLogSize: CONFIG.LOG_MAX_FILE_SIZE, /*In bytes 100000=>100kb */
                backups: CONFIG.LOG_NO_OF_BACKUPS,
                layout : {
                    type : "pattern",
                    pattern : "[%d] [%p] [%c] %m"
                }
            },
            {
                type: "logLevelFilter",
                level: "ERROR",
                appender: {
                    type: "file",
                    filename: CONFIG.LOG_DIR + CONFIG.LOG_ERROR_FILE_NAME,
                    maxLogSize: CONFIG.LOG_MAX_FILE_SIZE, /*In bytes 100000=>100kb */
                    backups: CONFIG.LOG_NO_OF_BACKUPS,
                },
                layout : {
                    type : "pattern",
                    pattern : "[%d] [%p] [%c] %m"
                }
            }
        ]
    }
}