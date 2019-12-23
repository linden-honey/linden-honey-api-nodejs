const getEnv = (key, defaultValue) => {
    if (key === undefined) {
        throw new Error("Missing 'key' argument!")
    }
    const hasValue = process.env[key] !== undefined
    if (!hasValue && defaultValue === undefined) {
        throw new Error(`"${key}" is required!`)
    }
    return hasValue ? process.env[key] : defaultValue
}

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

module.exports = {
    getEnv,
    config: Object.freeze(config),
}
