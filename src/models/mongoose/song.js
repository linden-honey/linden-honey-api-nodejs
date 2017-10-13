const mongoose = require('mongoose')
const VerseSchema = require('./verse').schema
const Schema = mongoose.Schema

const SongSchema = new Schema({
    title: String,
    author: String,
    album: String,
    verses: [VerseSchema]
})

SongSchema.index({ title: 'text' }, {
    default_language: 'russian',
    weights: {
        title: 1
    }
})

module.exports = mongoose.model('Song', SongSchema)
