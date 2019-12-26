const { convertSortOrder } = require('../utils/db')
const { createPageable } = require('../utils/pageable')

class QuoteRepository {
    constructor({ collection }) {
        this.collection = collection
    }

    getRandomQuote = async () => {
        const quotes = await this.collection
            .aggregate([
                { $unwind: '$verses' },
                { $unwind: '$verses.quotes' },
                { $sample: { size: 1 } },
                {
                    $project: {
                        _id: false,
                        phrase: '$verses.quotes.phrase'
                    }
                }
            ])
            .toArray()
        return quotes && quotes[0]
    }

    findQuotesByPhrase = (phrase, pageable) => {
        const query = phrase && phrase.trim()
        const {
            limit,
            offset,
            sortOrder,
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
                                $options: 'i'
                            }
                        }
                    },
                    { $group: { _id: '$verses.quotes.phrase' } },
                    {
                        $project: {
                            _id: false,
                            phrase: '$_id'
                        }
                    },
                    { $skip: offset },
                    { $limit: limit },
                    { $sort: { phrase: convertSortOrder(sortOrder) } }
                ])
                .toArray()
    }

}

module.exports = QuoteRepository
