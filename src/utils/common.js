const Logging = require("./logging")
const user = require("../models/user")
const slackClient = require("../config/slack")
const logging = require("./logging")


function logQuery(sql, queryObject){
    Logging.query(sql)
}

async function sendMessageToReviewer(reviewerId, articleName, sequecialNumberArticle){
    try {
        const reviewerData = await user.findOne({
            logging: (log, queryObject) => {
                logQuery(log, queryObject);
            },
            where:{
                id: reviewerId
            }
        })

        const chatId = reviewerData.slack_chat_id

        const result = await slackClient.chat.postMessage({
            channel: chatId,
            text: `Olá, ${reviewerData.name}! Há uma nova solicitação de analise para você. \nNome: ${articleName}\nNúmero Sequencial: ${sequecialNumberArticle}`,
        })

        logging.info(result)
    } catch (error) {
        logging.error(error)
    }
}

module.exports = {
    logQuery,
    sendMessageToReviewer
}