const path = require('path')
const dotenv = require('dotenv').config({ path: path.resolve(__dirname, '../../.env')})

module.exports = {
    "development": {
        "username": process.env.POSTGRES_USER,
        "password": process.env.POSTGRES_PASSWORD,
        "database": process.env.POSTGRES_DATABASE,
        "host": process.env.POSTGRES_HOST,
        "dialect": "postgres",
        "dialectOptions": {
            "useUTC": false
        }
    },
}
