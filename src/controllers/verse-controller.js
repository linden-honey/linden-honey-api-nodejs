const Song = require('../models/song')

const MSG_ERROR_NOT_FOUND = 'Verse not found'

const findVerseById = function * (id, fields) {
    const isValidId = Song.base.Types.ObjectId.isValid(id)
    const criteria = {
        'text.verses._id': id
    }
    const song = isValidId ? yield Song.findOne(criteria, fields) : null
    return song && song.text.verses[0]
}

exports.getVerseById = function * () {
    const verse = yield findVerseById(this.params.verseId, 'text')
    if (verse) {
        this.body = verse
    } else {
        this.throw(MSG_ERROR_NOT_FOUND, 404)
    }
}

exports.getRandomVerse = function * () {
    const song = yield Song.findRandomSong()
    this.body = song.text.getRandomVerse()
}

exports.getRandomQuoteFromVerse = function * () {
    const verse = yield findVerseById(this.params.verseId, '-__v')
    if (verse) {
        this.body = verse.getRandomQuote()
    } else {
        this.throw(MSG_ERROR_NOT_FOUND, 404)
    }
}
