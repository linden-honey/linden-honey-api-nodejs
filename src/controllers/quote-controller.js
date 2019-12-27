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
        const sortBy = this.repository.defaultSort.field
        const sortOrder = this.repository.defaultSort.order
        const pageable = createPageable({ sortBy, sortOrder, ...req.query })
        const quotes = await this.repository.findQuotesByPhrase(phrase, pageable)
        res.json({
            data: quotes,
            ...pageable
        })
    }
}

module.exports = QuoteController
