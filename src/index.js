const Koa = require('koa')
const logger = require('koa-logger')
const Router = require('koa-joi-router')

const db = require('./utils/db')
const config = require('./utils/config')
const constants = require('./utils/constants/path-constants')
const rootController = require('./controllers/root-controller')
const quoteController = require('./controllers/quote-controller')
const verseController = require('./controllers/verse-controller')
const songController = require('./controllers/song-controller')

const server = module.exports = new Koa()
const rootRouter = Router()
const songsRouter = Router()
const versesRouter = Router()
const quotesRouter = Router()

rootRouter.get(constants.ROOT, rootController.getRootPageHandler(config.get('APP:MESSAGES:WELCOME')))

songsRouter.get(constants.API_SONGS, songController.findSongs)
songsRouter.get(constants.API_SONGS, songController.getAllSongs)
songsRouter.get(constants.API_SONGS_RANDOM, songController.getRandomSong)
songsRouter.get(`${constants.API_SONGS}/:songId`, songController.getSongById)
songsRouter.get(`${constants.API_SONGS}/:songId/quotes`, songController.getQuotesFromSong)
songsRouter.get(`${constants.API_SONGS}/:songId/quotes/random`, songController.getRandomQuoteFromSong)
songsRouter.get(`${constants.API_SONGS}/:songId/verses`, songController.getVersesFromSong)
songsRouter.get(`${constants.API_SONGS}/:songId/verses/random`, songController.getRandomVerseFromSong)
songsRouter.get(`${constants.API_SONGS}/:songId/verses/:verseId`, songController.getVerseFromSong)
songsRouter.get(`${constants.API_SONGS}/:songId/verses/:verseId/quotes/random`, songController.getRandomQuoteFromVerse)

versesRouter.get(constants.API_VERSES_RANDOM, verseController.getRandomVerse)
versesRouter.get(`${constants.API_VERSES}/:verseId`, verseController.getVerseById)
versesRouter.get(`${constants.API_VERSES}/:verseId/quotes/random`, verseController.getRandomQuoteFromVerse)

quotesRouter.get(constants.API_QUOTES_RANDOM, quoteController.getRandomQuote)
quotesRouter.get(`${constants.API_QUOTES}/:quoteId`, quoteController.getQuoteById)

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
