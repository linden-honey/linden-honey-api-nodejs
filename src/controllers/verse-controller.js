const Song = require('../models/song')

const MSG_ERROR_NOT_FOUND = 'Verse not found'

const findVerseById = async function (id, fields) {
    const isValidId = Song.base.Types.ObjectId.isValid(id)
    const criteria = {
        'text.verses._id': id
    }
    const song = isValidId && await Song.findOne(criteria, fields)
    return song && song.text.verses[0]
}

exports.getVerseById = async (ctx, next) => {
    const verse = await findVerseById(ctx.params.verseId, 'text')
    if (verse) {
        ctx.body = verse
    } else {
        ctx.throw(MSG_ERROR_NOT_FOUND, 404)
    }
    return next()
}

exports.getRandomVerse = async (ctx, next) => {
    const song = await Song.findRandomSong()
    ctx.body = song.text.getRandomVerse()
}

exports.getRandomQuoteFromVerse = async (ctx, next) => {
    const verse = await findVerseById(ctx.params.verseId, '-__v')
    if (verse) {
        ctx.body = verse.getRandomQuote()
    } else {
        ctx.throw(MSG_ERROR_NOT_FOUND, 404)
    }
    return next()
}
