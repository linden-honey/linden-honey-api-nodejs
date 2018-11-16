class VerseController {
    static MSG_ERROR_VERSE_NOT_FOUND = 'Verse not found'

    constructor({ repository }) {
        this.repository = repository
    }

    async getRandomVerse(ctx) {
        const verse = await this.repository.getRandomVerse()
        if (verse) {
            ctx.body = verse
        } else {
            ctx.throw(404, VerseController.MSG_ERROR_VERSE_NOT_FOUND)
        }
    }
}

module.exports = VerseController
