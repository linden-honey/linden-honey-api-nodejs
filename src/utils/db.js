const mongoose = require('mongoose')

mongoose.Promise = Promise
mongoose.connection.on('connected', () => {
    console.log(`Mongoose connected to ${mongoose.connection.host}:${mongoose.connection.port}`)
})

mongoose.connection.on('error', error => {
    console.log('Mongoose unhandled connection error:', error.message)
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

exports.isValidId = mongoose.Types.ObjectId.isValid

exports.ObjectId = mongoose.Types.ObjectId

exports.connect = ({ url }) => {
    return mongoose.connect(url, {
        useMongoClient: true
    })
}
