const { getEnv } = require('./env')

const config = {
    application: {
        rest: {
            basePath: getEnv('APPLICATION_REST_BASE_PATH', '/api'),
        },
        db: {
            uri: getEnv(
                'APPLICATION_DB_URI',
                'mongodb://linden-honey:linden-honey@localhost:27017/linden-honey',
            ),
        },
    },
    server: {
        port: getEnv('SERVER_PORT', 8080),
    },
}

module.exports = Object.freeze(config)
