const Koa = require('koa')
const logger = require('koa-logger')
const Router = require('koa-router')

const { GrobScraper } = require('./services')
const { db, config } = require('./utils')
const { PATH } = require('./utils/constants')
const {
    RootController,
    QuoteController,
    VerseController,
    SongController,
    ScraperController
} = require('./controllers')

const server = module.exports = new Koa()

const rootRouter = Router({ prefix: PATH.ROOT })
const songsRouter = Router({ prefix: PATH.API_SONGS })
const versesRouter = Router({ prefix: PATH.API_VERSES })
const quotesRouter = Router({ prefix: PATH.API_QUOTES })
const scraperRouter = Router({ prefix: PATH.API_SCRAPER })

const paramValidationMiddleware = (validator) => (param, ctx, next) => {
    if (!validator(param)) {
        ctx.throw(400, 'Invalid id')
    }
    return next()
}

rootRouter.get(PATH.ROOT, RootController.getRootPageHandler(config.get('LH:SERVER:MESSAGES:WELCOME')))

songsRouter
    .get('/', SongController.getAllSongs)
    .get('/search/random', SongController.getRandomSong)
    .get('/search/by-title', SongController.findSongsByTitle)
    .get('/search/by-phrase', SongController.findSongsByPhrase)
    .param('songId', paramValidationMiddleware(db.isValidId))
    .get('/:songId', SongController.getSongById)
    .get('/:songId/quotes', SongController.getQuotesFromSong)
    .get('/:songId/quotes/search/random', SongController.getRandomQuoteFromSong)
    .get('/:songId/quotes/search/by-phrase', SongController.findQuotesFromSongByPhrase)
    .get('/:songId/verses', SongController.getVersesFromSong)
    .get('/:songId/verses/search/random', SongController.getRandomVerseFromSong)

versesRouter
    .get('/search/random', VerseController.getRandomVerse)

quotesRouter
    .get('/search/random', QuoteController.getRandomQuote)
    .get('/search/by-phrase', QuoteController.findQuotesByPhrase)    


scraperRouter.use((ctx, next) => {
    if (JSON.parse(config.get('LH:SCRAPERS:ENABLED'))) {
        return next()
    }
})
scraperRouter
    .get('/:scraperId/songs', ScraperController.getSongs([
        new GrobScraper({ url: config.get('LH:SCRAPERS:GROB:URL') })
    ]))

server.use(logger())
server.use(rootRouter.middleware())
server.use(songsRouter.middleware())
server.use(versesRouter.middleware())
server.use(quotesRouter.middleware())
server.use(scraperRouter.middleware())

server.listen(config.get('LH:SERVER:PORT'), () => {
    db.connect({ url: config.get('LH:DB:URI') })
        .catch(error => {
            console.log('Couldn\'t create Mongoose connection:', error.message)
        })
    console.log(`${config.get('LH:SERVER:NAME')} application started!`)
})
