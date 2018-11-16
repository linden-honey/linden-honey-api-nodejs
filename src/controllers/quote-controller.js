const MSG_ERROR_QUOTE_NOT_FOUND = 'Quote not found'

class QuoteController {
   
    constructor({repository}) {
        this.repository = repository
    }

    async getRandomQuote(ctx, next) {
        const quote = await this.repository.getRandomQuote()
        if (quote) {
            ctx.body = quote
        } else {
            ctx.throw(404, MSG_ERROR_QUOTE_NOT_FOUND)
        }
        return next()
    }

    async findQuotesByPhrase(ctx, next) {
        const phrase = ctx.query.phrase
        const pageable = {
            page: ctx.query.page,
            size: ctx.query.size,
            order: ctx.query.order
        }
        ctx.body = await this.repository.findQuotesByPhrase(phrase, pageable)
        return next()
    }
}

module.exports = QuoteController
