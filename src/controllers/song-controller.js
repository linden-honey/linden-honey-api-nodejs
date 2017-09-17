const { Song } = require('../models/mongoose')

const MSG_ERROR_SONG_NOT_FOUND = 'Song not found'
const MSG_ERROR_VERSE_NOT_FOUND = 'Verse not found'
const MSG_ERROR_QUOTE_NOT_FOUND = 'Quote not found'

const findSongById = function (id) {
    return Song.findById(id)
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

exports.getAllSongs = async (ctx, next) => {
    const page = ctx.query.page && parseInt(ctx.query.page) || 0
    const size = ctx.query.size && parseInt(ctx.query.size) || 20
    const skip = page * size
    ctx.body = await Song.find().skip(skip).limit(size).select('_id title')
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
    const song = await Song.findRandomSong()
    if (song) {
        ctx.body = song
    } else {
        ctx.throw(404, MSG_ERROR_SONG_NOT_FOUND)
    }
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
    const song = await findSongById(ctx.params.songId)
    const verse = song && song.getRandomVerse()
    const quote = verse && verse.getRandomQuote()
    if (quote) {
        ctx.body = quote
    } else {
        const message = !song ? MSG_ERROR_SONG_NOT_FOUND : MSG_ERROR_QUOTE_NOT_FOUND
        ctx.throw(404, message)
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
    const song = await findSongById(ctx.params.songId)
    const verse = song && song.getRandomVerse()
    if (verse) {
        ctx.body = song.getRandomVerse()
    } else {
        const message = !song ? MSG_ERROR_SONG_NOT_FOUND : MSG_ERROR_VERSE_NOT_FOUND
        ctx.throw(404, message)
    }
    return next()
}
