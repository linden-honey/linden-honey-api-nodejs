const Song = require('../models/song')

const MSG_ERROR_NOT_FOUND = 'Quote not found'

exports.getQuoteById = async (ctx, next) => {
    const isValidId = Song.base.Types.ObjectId.isValid(ctx.params.quoteId)
    const criteria = {
        'text.verses.quotes._id': ctx.params.quoteId
    }
    const song = isValidId && await Song.findOne(criteria, 'text')
    const quote = song && song.text.verses[0].quotes[0]
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
