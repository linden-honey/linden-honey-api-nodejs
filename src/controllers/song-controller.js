const { Song } = require('../models/mongoose')
const { ObjectId } = require('../utils/db')

const MSG_ERROR_SONG_NOT_FOUND = 'Song not found'
const MSG_ERROR_VERSE_NOT_FOUND = 'Verse not found'
const MSG_ERROR_QUOTE_NOT_FOUND = 'Quote not found'

const findSongById = function (id) {
    return Song.findById(id)
}

const makeFindSongs = (field, selector = field) => async (ctx, next) => {
    if (!ctx.query[field]) return next()
    const page = ctx.query.page && parseInt(ctx.query.page) || 0
    const size = ctx.query.size && parseInt(ctx.query.size) || 20
    const skip = page * size
    const order = ctx.query.order === 'asc' ? 1 : ctx.query.order === 'desc' ? -1 : 1

    const songs = await Song
        .find({
            [selector]: {
                $regex: ctx.query[field],
                $options: 'i'
            }
        })
        .skip(skip)
        .limit(size)
        .sort({ 'title': order })
        .select('_id title')

    ctx.body = songs
    return next()
}

exports.findSongsByTitle = makeFindSongs('title')

exports.findSongsByPhrase = makeFindSongs('phrase', 'verses.quotes.phrase')

exports.getAllSongs = async (ctx, next) => {
    const page = ctx.query.page && parseInt(ctx.query.page) || 0
    const size = ctx.query.size && parseInt(ctx.query.size) || 20
    const skip = page * size
    const order = ctx.query.order === 'asc' ? 1 : ctx.query.order === 'desc' ? -1 : 1

    ctx.body = await Song
        .find()
        .skip(skip)
        .limit(size)
        .sort({ title: order })
        .select('_id title')

    return next()
}

exports.getSongById = async (ctx, next) => {
    const song = await findSongById(ctx.params.songId)
    if (song) {
        ctx.body = song
    } else {
        ctx.throw(404, MSG_ERROR_SONG_NOT_FOUND)
    }
    return next()
}

exports.getRandomSong = async ctx => {
    const songs = await Song.aggregate([
        { $sample: { size: 1 } }
    ])
    const song = songs && songs[0]
    if (song) {
        ctx.body = song
    } else {
        ctx.throw(404, MSG_ERROR_SONG_NOT_FOUND)
    }
}

exports.findQuotesFromSong = async (ctx, next) => {
    if (!ctx.query.search) return next()

    const quotes = await Song
        .aggregate([
            { $unwind: '$verses' },
            { $unwind: '$verses.quotes' },
            {
                $match: {
                    _id: new ObjectId(ctx.params.songId),
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
            }
        ])

    ctx.body = quotes
}

exports.getQuotesFromSong = async (ctx, next) => {
    const song = await findSongById(ctx.params.songId)
    if (song) {
        ctx.body = [].concat(...song.verses.map(verse => verse.quotes))
    } else {
        ctx.throw(404, MSG_ERROR_SONG_NOT_FOUND)
    }
    return next()
}

exports.getRandomQuoteFromSong = async (ctx, next) => {
    const quotes = await Song.aggregate([
        {
            $match: {
                _id: new ObjectId(ctx.params.songId)
            }
        },
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
    return next()
}

exports.getVersesFromSong = async (ctx, next) => {
    const song = await findSongById(ctx.params.songId)
    if (song) {
        ctx.body = song.verses
    } else {
        ctx.throw(404, MSG_ERROR_SONG_NOT_FOUND)
    }
    return next()
}

exports.getRandomVerseFromSong = async (ctx, next) => {
    const verses = await Song.aggregate([
        {
            $match: {
                _id: new ObjectId(ctx.params.songId)
            }
        },
        { $unwind: '$verses' },
        { $sample: { size: 1 } },
        {
            $project: {
                _id: false,
                quotes: '$verses.quotes'
            }
        }
    ])
    const verse = verses && verses[0]
    if (verse) {
        ctx.body = verse
    } else {
        ctx.throw(404, MSG_ERROR_VERSE_NOT_FOUND)
    }
    return next()
}
