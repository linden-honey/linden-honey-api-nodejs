const autoBind = require('auto-bind')

const MSG_ERROR_VERSE_NOT_FOUND = 'Verse not found'

class VerseController {

    constructor({ repository }) {
        this.repository = repository
        autoBind(this)
    }

    async getRandomVerse(ctx) {
        const verse = await this.repository.getRandomVerse()
        if (verse) {
            ctx.body = verse
        } else {
            ctx.throw(404, MSG_ERROR_VERSE_NOT_FOUND)
        }
    }
}

module.exports = VerseController
