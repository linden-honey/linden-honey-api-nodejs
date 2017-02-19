const Song = require('../models/song')

const MSG_ERROR_NOT_FOUND = 'Quote not found'

exports.getQuoteById = function * () {
    const isValidId = Song.base.Types.ObjectId.isValid(this.params.quoteId)
    const criteria = {
        'text.verses.quotes._id': this.params.quoteId
    }
    const song = isValidId ? yield Song.findOne(criteria, 'text') : null
    const quote = song && song.text.verses[0].quotes[0]
    if (quote) {
        this.body = quote
    } else {
        this.throw(MSG_ERROR_NOT_FOUND, 404)
    }
}

exports.getRandomQuote = function * () {
    const song = yield Song.findRandomSong()
    this.body = song.text.getRandomVerse().getRandomQuote()
}
