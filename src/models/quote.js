const mongoose = require('mongoose')
const Schema = mongoose.Schema

const QuoteSchema = new Schema({
    phrase: String
})

module.exports = mongoose.model('Quote', QuoteSchema)
