const Song = require('../models/song')

const MSG_ERROR_NOT_FOUND = 'Song not found'

const findSongById = function (id) {
    const isValidId = Song.base.Types.ObjectId.isValid(id)
    return isValidId && Song.findById(id).select('-__v')
}

exports.getAllSongs = async (ctx, next) => {
    ctx.body = await Song.find().select('_id title')
    return next()
}

exports.findSongs = async (ctx, next) => {
    if(!ctx.query.search) return next()
    ctx.body = await Song.find({ 
        $text: { 
            $search: ctx.query.search 
        } 
    }).select('_id title')
}

exports.getSongById = async (ctx, next) => {
    const song = await findSongById(ctx.params.songId)
    if (song) {
        ctx.body = song
    } else {
        ctx.throw(MSG_ERROR_NOT_FOUND, 404)
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
        ctx.throw(MSG_ERROR_NOT_FOUND, 404)
    }
    return next()
}

exports.getRandomQuoteFromSong = async (ctx, next)  => {
    const song = await findSongById(ctx.params.songId)
    if (song) {
        ctx.body = song.getRandomVerse().getRandomQuote()
    } else {
        ctx.throw(MSG_ERROR_NOT_FOUND, 404)
    }
    return next()
}

exports.getRandomQuoteFromVerse = async ctx => {
    const song = await findSongById(ctx.params.songId)
    const verse = song && song.verses.find(verse => verse.id === ctx.params.verseId)
    if (song && verse) {
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
        ctx.throw(MSG_ERROR_NOT_FOUND, 404)
    }
    return next()
}

exports.getRandomVerseFromSong = async (ctx, next) => {
    const song = await findSongById(ctx.params.songId)
    if (song) {
        ctx.body = song.getRandomVerse()
    } else {
        ctx.throw(MSG_ERROR_NOT_FOUND, 404)
    }
    return next()
}

exports.getVerseFromSong = async (ctx, next) => {
    const song = await findSongById(ctx.params.songId)
    const isValidVerseId = Song.base.Types.ObjectId.isValid(ctx.params.verseId)
    const verse = song && isValidVerseId && song.verses.id(ctx.params.verseId)
    if (verse) {
        ctx.body = verse
    } else {
        ctx.throw(MSG_ERROR_NOT_FOUND, 404)
    }
    return next()
}
