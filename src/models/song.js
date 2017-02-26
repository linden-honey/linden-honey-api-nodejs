const mongoose = require('mongoose')
const random = require('random-js')()
const TextSchema = require('./text').schema
const Schema = mongoose.Schema

const SongSchema = new Schema({
    title: String,
    author: String,
    album: String,
    text: TextSchema
})

SongSchema.statics.findRandomSong = async function (cretirea, fields, callback) {
    const songsCount = await this.count()
    const randomSongNumber = random.integer(0, songsCount)
    return await this.findOne(cretirea, fields, callback).skip(randomSongNumber)
}

module.exports = mongoose.model('Song', SongSchema)
