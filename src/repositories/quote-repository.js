const { convertSortOrder } = require('../utils/db')
const { createPageable } = require('../utils/pageable')

class QuoteRepository {
    constructor({ collection }) {
        this.collection = collection
        this.defaultSort = {
            field: 'phrase',
            order: 'asc',
        }
    }

    getRandomQuote = async () => {
        const quotes = await this.collection
            .aggregate([
                { $unwind: '$verses' },
                { $unwind: '$verses.quotes' },
                {
                    $sample: {
                        size: 1,
                    },
                },
                {
                    $project: {
                        _id: 0,
                        phrase: '$verses.quotes.phrase',
                    },
                },
            ])
            .toArray()
        return quotes && quotes[0]
    }

    findQuotesByPhrase = (phrase, pageable) => {
        const query = phrase && phrase.trim()
        const {
            limit,
            offset,
            sortBy = this.defaultSort.field,
            sortOrder = this.defaultSort.order,
        } = createPageable(pageable)
        return !query
            ? []
            : this.collection
                .aggregate([
                    { $unwind: '$verses' },
                    { $unwind: '$verses.quotes' },
                    {
                        $match: {
                            'verses.quotes.phrase': {
                                $regex: query,
                                $options: 'i',
                            },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            phrase: '$verses.quotes.phrase',
                        },
                    },
                    { $skip: offset },
                    { $limit: limit },
                    {
                        $sort: {
                            [sortBy]: convertSortOrder(sortOrder),
                        },
                    },
                ])
                .toArray()
    }
}

module.exports = QuoteRepository
