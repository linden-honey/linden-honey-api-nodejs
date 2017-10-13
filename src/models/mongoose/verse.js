const mongoose = require('mongoose')
const QuoteSchema = require('./quote').schema
const Schema = mongoose.Schema

const VerseSchema = new Schema({
    quotes: [QuoteSchema]
})

module.exports = mongoose.model('Verse', VerseSchema)
