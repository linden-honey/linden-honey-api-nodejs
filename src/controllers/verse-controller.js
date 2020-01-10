const MSG_ERROR_VERSE_NOT_FOUND = 'Verse not found'

class VerseController {
    constructor({ repository }) {
        this.repository = repository
    }

    getRandomVerse = async (_, res) => {
        const verse = await this.repository.getRandomVerse()
        if (verse) {
            res.json(verse)
        } else {
            res.status(404).send(MSG_ERROR_VERSE_NOT_FOUND)
        }
    }
}

module.exports = VerseController
