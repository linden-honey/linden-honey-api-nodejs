const Song = require('../models/song')

const MSG_ERROR_NOT_FOUND = 'Song not found'

const findSongById = function * (id, fields) {
    const isValidId = Song.base.Types.ObjectId.isValid(id)
    return isValidId ? yield Song.findById(id, fields) : null
}

exports.getAllSongs = function * () {
    this.body = yield Song.find({}, '_id title')
}

exports.getSongById = function * (id) {
    const song = yield findSongById(id, '-__v')
    if (song) {
        this.body = song
    } else {
        this.throw(MSG_ERROR_NOT_FOUND, 404)
    }
}

exports.getRandomSong = function * () {
    this.body = yield Song.findRandomSong({}, '-__v')
}

exports.getRandomQuoteFromSong = function * (id) {
    const song = yield findSongById(id, '-__v')
    if (song) {
        this.body = song.text.getRandomVerse().getRandomQuote()
    } else {
        this.throw(MSG_ERROR_NOT_FOUND, 404)
    }
}

exports.getRandomQuoteFromSongByVerseId = function * (songId, verseId) {
    const song = yield findSongById(songId, '-__v')
    const verse = song && song.text.verses.find(verse => verse.id === verseId)
    if (song && verse) {
        this.body = verse.getRandomQuote()
    } else {
        this.throw(404)
    }
}

exports.getRandomVerseFromSong = function * (id) {
    const song = yield findSongById(id, '-__v')
    if (song) {
        this.body = song.text.getRandomVerse()
    } else {
        this.throw(MSG_ERROR_NOT_FOUND, 404)
    }
}
