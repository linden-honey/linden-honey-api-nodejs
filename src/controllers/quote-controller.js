const { Song } = require('../models/mongoose')

const MSG_ERROR_QUOTE_NOT_FOUND = 'Quote not found'

exports.getRandomQuote = async ctx => {
    const song = await Song.findRandomSong()
    const verse = song && song.getRandomVerse()
    const quote = verse && verse.getRandomQuote()
    if (quote) {
        ctx.body = quote
    } else {
        ctx.throw(404, MSG_ERROR_QUOTE_NOT_FOUND)
    }
}

exports.findQuotes = async (ctx, next) => {
    if (!ctx.query.search) return next()
    const songs = await Song
        .find({
            'verses.quotes.phrase': {
                $regex: ctx.query.search,
                $options: 'i'
            }
        })
        .select('verses.quotes')
    ctx.body = [].concat(...songs.map(song => [].concat(...song.verses.map(verse => verse.quotes))))
}
