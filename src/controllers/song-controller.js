const Song = require('../models/song')

const MSG_ERROR_NOT_FOUND = 'Song not found'

const findSongById = function (id) {
    const isValidId = Song.base.Types.ObjectId.isValid(id)
    return isValidId && Song.findById(id)
}

exports.getAllSongs = async (ctx, next) => {
    ctx.body = await Song.find().select('_id title')
    return next()
}

exports.getSongById = async (ctx, next) => {
    const song = await findSongById(ctx.params.songId).select('-__v')
    if (song) {
        ctx.body = song
    } else {
        ctx.throw(MSG_ERROR_NOT_FOUND, 404)
    }
    return next()
}

exports.getRandomSong = async ctx => {
    ctx.body = await Song.findRandomSong().select('-__v')
}

exports.getQuotesFromSong = async (ctx, next) => {
    const song = await findSongById(ctx.params.songId).select('-__v')
    if (song) {
        ctx.body = [].concat(...song.verses.map(verse => verse.quotes))
    } else {
        ctx.throw(MSG_ERROR_NOT_FOUND, 404)
    }
    return next()
}

exports.getRandomQuoteFromSong = async ctx => {
    const song = await findSongById(ctx.params.songId).select('-__v')
    if (song) {
        ctx.body = song.getRandomVerse().getRandomQuote()
    } else {
        ctx.throw(MSG_ERROR_NOT_FOUND, 404)
    }
}

exports.getRandomQuoteFromSongByVerseId = async ctx => {
    const song = await findSongById(ctx.params.songId).select('-__v')
    const verse = song && song.verses.find(verse => verse.id === ctx.params.verseId)
    if (song && verse) {
        ctx.body = verse.getRandomQuote()
    } else {
        ctx.throw(404)
    }
}

exports.getVersesFromSong = async (ctx, next) => {
    const song = await findSongById(ctx.params.songId).select('-__v')
    if (song) {
        ctx.body = song.verses
    } else {
        ctx.throw(MSG_ERROR_NOT_FOUND, 404)
    }
    return next()
}

exports.getRandomVerseFromSong = async ctx => {
    const song = await findSongById(ctx.params.songId).select('-__v')
    if (song) {
        ctx.body = song.getRandomVerse()
    } else {
        ctx.throw(MSG_ERROR_NOT_FOUND, 404)
    }
}
