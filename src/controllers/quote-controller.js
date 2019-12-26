const { createPageable } = require('../utils/pageable')

const MSG_ERROR_QUOTE_NOT_FOUND = 'Quote not found'

class QuoteController {
    constructor({ repository }) {
        this.repository = repository
    }

    getRandomQuote = async (_, res) => {
        const quote = await this.repository.getRandomQuote()
        if (quote) {
            res.json(quote)
        } else {
            res.status(404).send(MSG_ERROR_QUOTE_NOT_FOUND)
        }
    }

    findQuotesByPhrase = async (req, res) => {
        const { phrase } = req.query
        const pageable = createPageable({ ...req.query, sortBy: 'phrase' })
        const quotes = await this.repository.findQuotesByPhrase(phrase, pageable)
        res.json({
            data: quotes,
            ...pageable
        })
    }
}

module.exports = QuoteController
