class VerseRepository {
    constructor({ collection }) {
        this.collection = collection
    }

    async getRandomVerse() {
        const verses = await this.collection
            .aggregate([
                {
                    $unwind: '$verses'
                },
                {
                    $sample: {
                        size: 1,
                    },
                },
                {
                    $project: {
                        _id: false,
                        quotes: '$verses.quotes',
                    },
                },
            ])
            .toArray()
        return verses && verses[0]
    }
}

module.exports = VerseRepository
