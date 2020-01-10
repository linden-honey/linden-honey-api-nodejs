class VerseRepository {
    constructor({ collection }) {
        this.collection = collection
    }

    getRandomVerse = async () => {
        const verses = await this.collection
            .aggregate([
                { $unwind: '$verses' },
                {
                    $sample: {
                        size: 1,
                    },
                },
                {
                    $project: {
                        _id: 0,
                        quotes: '$verses.quotes',
                    },
                },
            ])
            .toArray()
        return verses && verses[0]
    }
}

module.exports = VerseRepository
