const Song = require('../models/song')

const MSG_ERROR_NOT_FOUND = 'Quote not found'

exports.getQuoteById = async (ctx, next) => {
    const song = await Song.findOne().where('verses.quotes._id').eq(ctx.params.quoteId)
    const verse = song && song.verses.find(verse => verse.quotes.id(ctx.params.quoteId))
    const quote = verse && verse.quotes.id(ctx.params.quoteId)
    if (quote) {
        ctx.body = quote
    } else {
        ctx.throw(MSG_ERROR_NOT_FOUND, 404)
    }
    return next()
}

exports.getRandomQuote = async ctx => {
    const song = await Song.findRandomSong()
    ctx.body = song.getRandomVerse().getRandomQuote()
}
