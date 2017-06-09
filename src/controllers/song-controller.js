const Song = require('../models/song')

const MSG_ERROR_SONG_NOT_FOUND = 'Song not found'
const MSG_ERROR_NOT_FOUND = 'Not found'

const findSongById = function (id) {
    return Song.findById(id)
}

exports.getAllSongs = async (ctx, next) => {
    const page = ctx.query.page && parseInt(ctx.query.page) || 0
    const size = ctx.query.size && parseInt(ctx.query.size) || 20
    const skip = page * size
    ctx.body = await Song.find().skip(skip).limit(size).select('_id title')
    return next()
}

exports.findSongs = async (ctx, next) => {
    if (!ctx.query.search) return next()
    const songs = await Song.find({
        title: {
            $regex: ctx.query.search,
            $options: 'i'
        }
    }).select('_id title')
    ctx.body = songs
}

exports.getSongById = async (ctx, next) => {
    const song = await findSongById(ctx.params.songId)
    if (song) {
        ctx.body = song
    } else {
        ctx.throw(MSG_ERROR_SONG_NOT_FOUND, 404)
    }
    return next()
}

exports.getRandomSong = async ctx => {
    ctx.body = await Song.findRandomSong()
}

exports.getQuotesFromSong = async (ctx, next) => {
    const song = await findSongById(ctx.params.songId)
    if (song) {
        ctx.body = [].concat(...song.verses.map(verse => verse.quotes))
    } else {
        ctx.throw(MSG_ERROR_SONG_NOT_FOUND, 404)
    }
    return next()
}

exports.getQuotesFromVerse = async (ctx, next) => {
    const song = await findSongById(ctx.params.songId)
    const verse = song && song.verses.id(ctx.params.verseId)
    if (verse) {
        ctx.body = verse.quotes
    } else {
        ctx.throw(MSG_ERROR_SONG_NOT_FOUND, 404)
    }
    return next()
}

exports.getRandomQuoteFromSong = async (ctx, next) => {
    const song = await findSongById(ctx.params.songId)
    if (song) {
        ctx.body = song.getRandomVerse().getRandomQuote()
    } else {
        ctx.throw(MSG_ERROR_SONG_NOT_FOUND, 404)
    }
    return next()
}

exports.getRandomQuoteFromVerse = async ctx => {
    const song = await findSongById(ctx.params.songId)
    const verse = song && song.verses.find(verse => verse.id === ctx.params.verseId)
    if (verse) {
        ctx.body = verse.getRandomQuote()
    } else {
        ctx.throw(404)
    }
}

exports.getVersesFromSong = async (ctx, next) => {
    const song = await findSongById(ctx.params.songId)
    if (song) {
        ctx.body = song.verses
    } else {
        ctx.throw(MSG_ERROR_SONG_NOT_FOUND, 404)
    }
    return next()
}

exports.getRandomVerseFromSong = async ctx => {
    const song = await findSongById(ctx.params.songId)
    if (song) {
        ctx.body = song.getRandomVerse()
    } else {
        ctx.throw(MSG_ERROR_SONG_NOT_FOUND, 404)
    }
}

exports.getVerseFromSong = async (ctx, next) => {
    const song = await findSongById(ctx.params.songId)
    const verse = song && song.verses.id(ctx.params.verseId)
    if (verse) {
        ctx.body = verse
    } else {
        ctx.throw(MSG_ERROR_NOT_FOUND, 404)
    }
    return next()
}

exports.getQuoteFromVerse = async (ctx, next) => {
    const song = await findSongById(ctx.params.songId)
    const verse = song && song.verses.id(ctx.params.verseId)
    const quote = verse && verse.quotes.id(ctx.params.quoteId)
    if (quote) {
        ctx.body = quote
    } else {
        ctx.throw(MSG_ERROR_NOT_FOUND, 404)
    }
    return next()
}
