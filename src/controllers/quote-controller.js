const Song = require('../models/song')

const MSG_ERROR_NOT_FOUND = 'Quote not found'

exports.getQuoteById = async (ctx, next) => {
    const quoteId = ctx.params.quoteId
    const isValidId = Song.base.Types.ObjectId.isValid(quoteId)
    const song = isValidId && await Song.findOne().where('text.verses.quotes._id').eq(quoteId)
    const verse = song && song.text.verses.find(verse => verse.quotes.id(quoteId))
    const quote = verse && verse.quotes.id(quoteId)
    if (quote) {
        ctx.body = quote
    } else {
        ctx.throw(MSG_ERROR_NOT_FOUND, 404)
    }
    return next()
}

exports.getRandomQuote = async ctx => {
    const song = await Song.findRandomSong()
    ctx.body = song.text.getRandomVerse().getRandomQuote()
}
