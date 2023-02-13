require('dotenv/config')
const { DateTime } = require('luxon');
const pg = require('pg')
const Sequelize = require('sequelize')

const TYPE_TIMESTAMPTZ = 1184

pg.types.setTypeParser(TYPE_TIMESTAMPTZ, 'text', function(text) {
    return DateTime.fromSQL(text).setZone("America/Sao_Paulo").toISO()
});

const sequelize = new Sequelize(
    process.env.POSTGRES_DATABASE,
    process.env.POSTGRES_USER,
    process.env.POSTGRES_PASSWORD, {
    host: process.env.POSTGRES_HOST,
    dialect: 'postgres',
    dialectOptions: {
        useUTC: false,
    },
    logging: true,
    timezone: 'America/Sao_Paulo'
})

sequelize.query("CREATE EXTENSION IF NOT EXISTS unaccent")

module.exports = sequelize
