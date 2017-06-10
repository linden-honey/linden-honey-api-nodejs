const Koa = require('koa')
const logger = require('koa-logger')
const Router = require('koa-router')

const { db, config } = require('./utils')
const { PATH } = require('./utils/constants')
const { RootController, QuoteController, VerseController, SongController } = require('./controllers')

const server = module.exports = new Koa()

const rootRouter = Router({ prefix: PATH.ROOT })
const songsRouter = Router({ prefix: PATH.API_SONGS })
const versesRouter = Router({ prefix: PATH.API_VERSES })
const quotesRouter = Router({ prefix: PATH.API_QUOTES })

const paramValidationMiddleware = (validator) => (param, ctx, next) => {
    if (!validator(param)) {
        ctx.throw('Invalid param', 400)
    }
    return next()
}

rootRouter.get(PATH.ROOT, RootController.getRootPageHandler(config.get('APP:MESSAGES:WELCOME')))

songsRouter
    .get('/', SongController.findSongs)
    .get('/', SongController.getAllSongs)
    .get('/random', SongController.getRandomSong)
    .param('songId', paramValidationMiddleware(db.isValidId))
    .get('/:songId', SongController.getSongById)
    .get('/:songId/quotes', SongController.getQuotesFromSong)
    .get('/:songId/quotes/random', SongController.getRandomQuoteFromSong)
    .get('/:songId/verses', SongController.getVersesFromSong)
    .get('/:songId/verses/random', SongController.getRandomVerseFromSong)
    .param('verseId', paramValidationMiddleware(db.isValidId))
    .get('/:songId/verses/:verseId', SongController.getVerseFromSong)
    .get('/:songId/verses/:verseId/quotes', SongController.getQuotesFromVerse)
    .get('/:songId/verses/:verseId/quotes/random', SongController.getRandomQuoteFromVerse)
    .param('quoteId', paramValidationMiddleware(db.isValidId))
    .get('/:songId/verses/:verseId/quotes/:quoteId', SongController.getQuoteFromVerse)

versesRouter
    .get('/random', VerseController.getRandomVerse)
    .param('verseId', paramValidationMiddleware(db.isValidId))
    .get('/:verseId', VerseController.getVerseById)
    .get('/:verseId/quotes', VerseController.getQuotesFromVerse)
    .get('/:verseId/quotes/random', VerseController.getRandomQuoteFromVerse)
    .param('quoteId', paramValidationMiddleware(db.isValidId))
    .get('/:verseId/quotes/:quoteId', VerseController.getQuoteFromVerse)

quotesRouter
    .get('/', QuoteController.findQuotes)
    .get('/random', QuoteController.getRandomQuote)
    .param('quoteId', paramValidationMiddleware(db.isValidId))
    .get('/:quoteId', QuoteController.getQuoteById)

server.use(logger())
server.use(rootRouter.middleware())
server.use(songsRouter.middleware())
server.use(versesRouter.middleware())
server.use(quotesRouter.middleware())

server.listen(config.get('APP:PORT'), () => {
    db.connect(config.get('DB'))
    console.log(`${config.get('APP:NAME')} application started!`)
})
