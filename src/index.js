const Koa = require('koa')
const logger = require('koa-logger')
const Router = require('koa-router')

const db = require('./utils/db')
const config = require('./utils/config')
const constants = require('./utils/constants/path-constants')
const rootController = require('./controllers/root-controller')
const quoteController = require('./controllers/quote-controller')
const verseController = require('./controllers/verse-controller')
const songController = require('./controllers/song-controller')

const server = module.exports = new Koa()
const rootRouter = Router({ prefix: constants.ROOT })
const songsRouter = Router({ prefix: constants.API_SONGS })
const versesRouter = Router({ prefix: constants.API_VERSES })
const quotesRouter = Router({ prefix: constants.API_QUOTES })

const paramValidationMiddleware = (validator) => (param, ctx, next) => {
    if (!validator(param)) {
        ctx.throw('Invalid param', 400)
    }
    return next()
}

rootRouter.get(constants.ROOT, rootController.getRootPageHandler(config.get('APP:MESSAGES:WELCOME')))

songsRouter
    .get('/', songController.findSongs)
    .get('/', songController.getAllSongs)
    .get('/random', songController.getRandomSong)
    .param('songId', paramValidationMiddleware(db.isValidId))
    .get('/:songId', songController.getSongById)
    .get('/:songId/quotes', songController.getQuotesFromSong)
    .get('/:songId/quotes/random', songController.getRandomQuoteFromSong)
    .get('/:songId/verses', songController.getVersesFromSong)
    .get('/:songId/verses/random', songController.getRandomVerseFromSong)
    .param('verseId', paramValidationMiddleware(db.isValidId))
    .get('/:songId/verses/:verseId', songController.getVerseFromSong)
    .get('/:songId/verses/:verseId/quotes', songController.getQuotesFromVerse)
    .get('/:songId/verses/:verseId/quotes/random', songController.getRandomQuoteFromVerse)
    .param('quoteId', paramValidationMiddleware(db.isValidId))
    .get('/:songId/verses/:verseId/quotes/:quoteId', songController.getQuoteFromVerse)

versesRouter
    .get('/random', verseController.getRandomVerse)
    .param('verseId', paramValidationMiddleware(db.isValidId))
    .get('/:verseId', verseController.getVerseById)
    .get('/:verseId/quotes', verseController.getQuotesFromVerse)
    .get('/:verseId/quotes/random', verseController.getRandomQuoteFromVerse)
    .param('quoteId', paramValidationMiddleware(db.isValidId))
    .get('/:verseId/quotes/:quoteId', verseController.getQuoteFromVerse)

quotesRouter
    .get('/random', quoteController.getRandomQuote)
    .param('quoteId', paramValidationMiddleware(db.isValidId))
    .get('/:quoteId', quoteController.getQuoteById)

server.name = config.get('APP:NAME')
server.use(logger())
server.use(rootRouter.middleware())
server.use(songsRouter.middleware())
server.use(versesRouter.middleware())
server.use(quotesRouter.middleware())

server.listen(process.env.PORT || config.get('APP:PORT') || 8080, () => {
    db.connect(config.get('DB'))
    console.log(`${server.name} application started!`)
})
