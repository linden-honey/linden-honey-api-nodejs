const Song = require('../models/song')

const MSG_ERROR_NOT_FOUND = 'Verse not found'

const findVerseById = async function (id) {
    const isValidId = Song.base.Types.ObjectId.isValid(id)
    const song = isValidId && await Song.findOne().where('verses._id').eq(id)
    return song && song.text.verses[0]
}

exports.getVerseById = async (ctx, next) => {
    const verse = await findVerseById(ctx.params.verseId)
    if (verse) {
        ctx.body = verse
    } else {
        ctx.throw(MSG_ERROR_NOT_FOUND, 404)
    }
    return next()
}

exports.getRandomVerse = async ctx => {
    const song = await Song.findRandomSong()
    ctx.body = song.getRandomVerse()
}

exports.getRandomQuoteFromVerse = async ctx => {
    const verse = await findVerseById(ctx.params.verseId)
    if (verse) {
        ctx.body = verse.getRandomQuote()
    } else {
        ctx.throw(MSG_ERROR_NOT_FOUND, 404)
    }
}
