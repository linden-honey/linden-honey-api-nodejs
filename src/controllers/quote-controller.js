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
    const page = ctx.query.page && parseInt(ctx.query.page) || 0
    const size = ctx.query.size && parseInt(ctx.query.size) || 20
    const skip = page * size
    const order = ctx.query.order === 'asc' ? 1 : ctx.query.order === 'desc' ? -1 : 1

    const quotes = await Song
        .aggregate([
            { $unwind: '$verses' },
            { $unwind: '$verses.quotes' },
            {
                $match: {
                    'verses.quotes.phrase': {
                        $regex: ctx.query.search,
                        $options: 'i'
                    }
                }
            },
            { $group: { _id: '$verses.quotes.phrase' } },
            {
                $project: {
                    _id: false,
                    phrase: '$_id'
                }
            },
            { $skip: skip },
            { $limit: size },
            { $sort: { phrase: order } }
        ])

    ctx.body = quotes
}
