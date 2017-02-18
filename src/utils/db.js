const mongoose = require('mongoose')

exports.init = (options = {}) => {
    mongoose.Promise = Promise
    mongoose.connection.on('connected', () => {
        console.log(`Mongoose connected to ${mongoose.connection.host}:${mongoose.connection.port}`)
    })

    mongoose.connection.on('error', err => {
        console.log('Mongoose connection error:', err.message)
    })

    mongoose.connection.on('disconnected', () => {
        console.log('Mongoose disconnected')
    })

    process.on('SIGINT', () => {
        mongoose.connection.close(() => {
            console.log('Mongoose connection closed through app termination')
            process.exit(0)
        })
    })

    const connectionURL = `mongodb://${options.host}:${options.port}/${options.dbName}`
    return mongoose.connect(connectionURL, {
        user: options.user,
        pass: options.password
    })
}
