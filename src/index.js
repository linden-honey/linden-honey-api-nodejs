const Koa = require('koa')
const logger = require('koa-logger')
const Router = require('koa-router')

const { Song } = require('./models/mongoose')
const { QuoteRepository, VerseRepository, SongRepository } = require('./repositories')
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
const songRouter = Router({ prefix: PATH.API_SONGS })
const verseRouter = Router({ prefix: PATH.API_VERSES })
const quoteRouter = Router({ prefix: PATH.API_QUOTES })
const scraperRouter = Router({ prefix: PATH.API_SCRAPER })

const paramValidationMiddleware = (validator) => (param, ctx, next) => {
    if (!validator(param)) {
        ctx.throw(400, 'Invalid id')
    }
    return next()
}

rootRouter.get(PATH.ROOT, RootController.getRootPageHandler(config.get('LH:SERVER:MESSAGES:WELCOME')))

const songController = new SongController({
    repository: new SongRepository({ db: Song })
})
songRouter
    .get('/', songController.getAllSongs)
    .get('/search/random', songController.getRandomSong)
    .get('/search/by-title', songController.findSongsByTitle)
    .get('/search/by-phrase', songController.findSongsByPhrase)
    .param('songId', paramValidationMiddleware(db.isValidId))
    .get('/:songId', songController.getSongById)
    .get('/:songId/quotes', songController.getQuotesFromSong)
    .get('/:songId/quotes/search/random', songController.getRandomQuoteFromSong)
    .get('/:songId/quotes/search/by-phrase', songController.findQuotesFromSongByPhrase)
    .get('/:songId/verses', songController.getVersesFromSong)
    .get('/:songId/verses/search/random', songController.getRandomVerseFromSong)

const verseController = new VerseController({
    repository: new VerseRepository({ db: Song })
})
verseRouter
    .get('/search/random', verseController.getRandomVerse)

const quoteController = new QuoteController({
    repository: new QuoteRepository({ db: Song })
})
quoteRouter
    .get('/search/random', quoteController.getRandomQuote)
    .get('/search/by-phrase', quoteController.findQuotesByPhrase)

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
server.use(songRouter.middleware())
server.use(verseRouter.middleware())
server.use(quoteRouter.middleware())
server.use(scraperRouter.middleware())

server.listen(config.get('LH:SERVER:PORT'), () => {
    db.connect({ url: config.get('LH:DB:URI') })
        .catch(error => {
            console.log('Couldn\'t create Mongoose connection:', error.message)
        })
    console.log(`${config.get('LH:SERVER:NAME')} application started!`)
})
