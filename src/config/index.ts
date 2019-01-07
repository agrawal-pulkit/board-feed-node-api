let appenv: string = process.env.NODE_ENV || 'dev', appConfig = require('../config/config.'+appenv);

console.log("--------appConfig-----"+JSON.stringify(appConfig));
module.exports = appConfig;