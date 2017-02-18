const Song = require('../models/song')

const MSG_ERROR_SONG_NOT_FOUND = 'Song not found'

const getRandomElementNumber = elementsCount => Math.floor(Math.random() * elementsCount)
const getRandomArrayElement = array =>  {
    return array[getRandomElementNumber(array.length)]
}

exports.getAllSongs = function * () {
    this.body = yield Song.find({}, '_id title')
}

exports.getRandomSong = function * () {
    const elementsCount = yield Song.count()
    const randomSongNumber = getRandomElementNumber(elementsCount)
    this.body = yield Song.findOne().skip(randomSongNumber)
}

exports.getSongById = function * (id) {
    const isValidId = Song.base.Types.ObjectId.isValid(id)
    const song = isValidId ? yield Song.findById(id) : null
    if (song) {
        this.body = song
    } else {
        this.throw(MSG_ERROR_SONG_NOT_FOUND, 404)
    }
}

exports.getRandomQuoteFromSong = function * (songId) {
    const isValidId = Song.base.Types.ObjectId.isValid(songId)
    const song = isValidId ? yield Song.findById(songId, 'text') : null
    if (song) {
        const verse = getRandomArrayElement(song.text.verses)
        const quote = getRandomArrayElement(verse.quotes)
        this.body = quote
    } else {
        this.throw(MSG_ERROR_SONG_NOT_FOUND, 404)
    }
}

exports.getRandomQuote = function * () {
    const elementsCount = yield Song.count()
    const randomSongNumber = getRandomElementNumber(elementsCount)
    const song = yield Song.findOne().skip(randomSongNumber)
    if (song) {
        const verse = getRandomArrayElement(song.text.verses)
        const quote = getRandomArrayElement(verse.quotes)
        this.body = quote
    } else {
        this.throw(MSG_ERROR_SONG_NOT_FOUND, 404)
    }
}
