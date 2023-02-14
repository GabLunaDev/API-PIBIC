const Logging = require("./logging")


function logQuery(sql, queryObject){
    Logging.query(sql)
}



module.exports = {
    logQuery
}