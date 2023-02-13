const Logging = require("../utils/logging")

module.exports={
    async logMiddleware(req, res, next) {
        //Log the Request
        Logging.info(`Incomming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}]`);
    
        res.on('finish', () => {
            //Log the Response
            Logging.info(`Incomming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${req.res.statusCode}]`);
        });
    
        next();
    }
}
