const mongoose = require('mongoose')
const random = require('random-js')()
const VerseSchema = require('./verse').schema
const Schema = mongoose.Schema

const SongSchema = new Schema({
    title: String,
    author: String,
    album: String,
    verses: [VerseSchema]
})

SongSchema.statics.findRandomSong = async function () {
    const songsCount = await this.count()
    const randomSongNumber = random.integer(0, songsCount)
    return this.findOne().skip(randomSongNumber)
}

SongSchema.methods.getRandomVerse = function () {
    return random.pick(this.verses)
}

SongSchema.index({ title: 'text' })

module.exports = mongoose.model('Song', SongSchema)
