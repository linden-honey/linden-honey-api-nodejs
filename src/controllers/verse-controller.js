const { Song } = require('../models/mongoose')

const MSG_ERROR_VERSE_NOT_FOUND = 'Verse not found'
const MSG_ERROR_NOT_FOUND = 'Not found'

const findVerseById = async function (id) {
    const song = await Song.findOne().where('verses._id').eq(id)
    return song && song.verses.id(id)
}

exports.getVerseById = async (ctx, next) => {
    const verse = await findVerseById(ctx.params.verseId)
    if (verse) {
        ctx.body = verse
    } else {
        ctx.throw(404, MSG_ERROR_VERSE_NOT_FOUND)
    }
    return next()
}

exports.getRandomVerse = async ctx => {
    const song = await Song.findRandomSong()
    ctx.body = song.getRandomVerse()
}

exports.getRandomQuoteFromVerse = async ctx => {
    const verse = await findVerseById(ctx.params.verseId)
    const quote = verse && verse.getRandomQuote()
    if (quote) {
        ctx.body = quote
    } else {
        ctx.throw(404, MSG_ERROR_NOT_FOUND)
    }
}

exports.getQuotesFromVerse = async ctx => {
    const verse = await findVerseById(ctx.params.verseId)
    if (verse) {
        ctx.body = verse.quotes
    } else {
        ctx.throw(404, MSG_ERROR_NOT_FOUND)
    }
}

exports.getQuoteFromVerse = async ctx => {
    const verse = await findVerseById(ctx.params.verseId)
    const quote = verse && verse.quotes.id(ctx.params.quoteId)
    if (quote) {
        ctx.body = quote
    } else {
        ctx.throw(404, MSG_ERROR_NOT_FOUND)
    }
}

