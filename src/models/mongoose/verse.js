const random = require('random-js')()
const mongoose = require('mongoose')
const QuoteSchema = require('./quote').schema
const Schema = mongoose.Schema

const VerseSchema = new Schema({
    quotes: [QuoteSchema]
})

VerseSchema.methods.getRandomQuote = function() {
    return random.pick(this.quotes)
}

module.exports = mongoose.model('Verse', VerseSchema)
