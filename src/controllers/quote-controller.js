const { Song } = require('../models/mongoose')

const MSG_ERROR_QUOTE_NOT_FOUND = 'Quote not found'

exports.getRandomQuote = async ctx => {
    const quotes = await Song.aggregate([
        { $unwind: '$verses' },
        { $unwind: '$verses.quotes' },
        { $sample: { size: 1 } },
        {
            $project: {
                _id: false,
                phrase: '$verses.quotes.phrase'
            }
        }
    ])
    const quote = quotes && quotes[0]
    if (quote) {
        ctx.body = quote
    } else {
        ctx.throw(404, MSG_ERROR_QUOTE_NOT_FOUND)
    }
}

exports.findQuotesByPhrase = async (ctx, next) => {
    if (!ctx.query.phrase) return next()
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
                        $regex: ctx.query.phrase,
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
