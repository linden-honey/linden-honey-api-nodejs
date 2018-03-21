class VerseRepository {
    constructor({ db }) {
        this.db = db
    }

    async getRandomVerse() {
        const verses = await this.db.aggregate([
            { $unwind: '$verses' },
            { $sample: { size: 1 } },
            {
                $project: {
                    _id: false,
                    quotes: '$verses.quotes'
                }
            }
        ])
        return verses && verses[0]
    }
}

module.exports = VerseRepository
