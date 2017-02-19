const random = require('random-js')()
const mongoose = require('mongoose')
const VerseSchema = require('./verse').schema
const Schema = mongoose.Schema

const TextSchema = new Schema({
    _id: false,
    verses: [VerseSchema]
})

TextSchema.methods.getRandomVerse = function() {
    return random.pick(this.verses)
}

module.exports = mongoose.model('Text', TextSchema)
