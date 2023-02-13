const chalk = require("chalk")

module.exports = {
    async log(args) {
        this.info(args);
    },
    async info(args) {
        console.log(chalk.blue(`[${new Date().toLocaleString()}][INFO]`), typeof args === 'string' ? chalk.blueBright(args) : args);
    },
    async warn(args) {
        console.log(chalk.yellow(`[${new Date().toLocaleString()}][WARN]`), typeof args === 'string' ? chalk.yellowBright(args) : args);
    },
    async error(args) {
        console.log(chalk.red(`[${new Date().toLocaleString()}][ERROR]`), typeof args === 'string' ? chalk.redBright(args) : args);
    }
}