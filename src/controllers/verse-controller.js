const { Song } = require('../models/mongoose')

const MSG_ERROR_VERSE_NOT_FOUND = 'Verse not found'

exports.getRandomVerse = async ctx => {
    const song = await Song.findRandomSong()
    const verse = song && song.getRandomVerse()
    if(verse) {
        ctx.body = song.getRandomVerse()
    } else {
        ctx.throw(404, MSG_ERROR_VERSE_NOT_FOUND)
    }
}
