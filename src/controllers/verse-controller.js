const { Song } = require('../models/mongoose')

const MSG_ERROR_VERSE_NOT_FOUND = 'Verse not found'

exports.getRandomVerse = async ctx => {
    const verses = await Song.aggregate([
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
    if(verse) {
        ctx.body = verse
    } else {
        ctx.throw(404, MSG_ERROR_VERSE_NOT_FOUND)
    }
}
