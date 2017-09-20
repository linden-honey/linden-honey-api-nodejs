const Koa = require('koa')
const logger = require('koa-logger')
const Router = require('koa-router')

const { db, config, Scraper } = require('./utils')
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

rootRouter.get(PATH.ROOT, RootController.getRootPageHandler(config.get('LH:APP:MESSAGES:WELCOME')))

songsRouter
    .get('/', SongController.findSongs)
    .get('/', SongController.getAllSongs)
    .get('/random', SongController.getRandomSong)
    .param('songId', paramValidationMiddleware(db.isValidId))
    .get('/:songId', SongController.getSongById)
    .get('/:songId/quotes', SongController.findQuotesFromSong)
    .get('/:songId/quotes', SongController.getQuotesFromSong)
    .get('/:songId/quotes/random', SongController.getRandomQuoteFromSong)
    .get('/:songId/verses', SongController.getVersesFromSong)
    .get('/:songId/verses/random', SongController.getRandomVerseFromSong)

versesRouter
    .get('/random', VerseController.getRandomVerse)

quotesRouter
    .get('/', QuoteController.findQuotes)
    .get('/random', QuoteController.getRandomQuote)


scraperRouter.use((ctx, next) => {
    if(JSON.parse(config.get('LH:SCRAPER:ROUTER:ENABLED'))) {
        return next()
    }
})
scraperRouter
    .get('/songs', ScraperController.getSongs(new Scraper({ url: config.get('LH:SCRAPER:URL') })))

server.use(logger())
server.use(rootRouter.middleware())
server.use(songsRouter.middleware())
server.use(versesRouter.middleware())
server.use(quotesRouter.middleware())
server.use(scraperRouter.middleware())

server.listen(config.get('LH:APP:PORT'), () => {
    db.connect({ url: config.get('LH:DB:URL') })
        .catch(error => {
            console.log('Couldn\'t create Mongoose connection:', error.message)
        })
    console.log(`${config.get('LH:APP:NAME')} application started!`)
})
