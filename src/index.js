const koa = require('koa')
const logger = require('koa-logger')
const Router = require('koa-joi-router')
const docs = require('koa-docs')

const db = require('./utils/db')
const migration = require('./utils/migration')
const config = require('./utils/config')
const constants = require('./utils/constants/path-constants')
const rootController = require('./controllers/root-controller')
const quoteController = require('./controllers/quote-controller')
const verseController = require('./controllers/verse-controller')
const songController = require('./controllers/song-controller')

const server = module.exports = koa()
const rootRouter = Router()
const songsRouter = Router()
const versesRouter = Router()
const quotesRouter = Router()

rootRouter.get(constants.ROOT, rootController.getRootPageHandler(config.get('app:messages:welcome')))

songsRouter.get(constants.API_SONGS, songController.getAllSongs)
songsRouter.get(constants.API_SONGS_RANDOM, songController.getRandomSong)
songsRouter.get(`${constants.API_SONGS}/:songId`, songController.getSongById)
songsRouter.get(`${constants.API_SONGS}/:songId/quotes`, songController.getQuotesFromSong)
songsRouter.get(`${constants.API_SONGS}/:songId/quotes/random`, songController.getRandomQuoteFromSong)
songsRouter.get(`${constants.API_SONGS}/:songId/verses`, songController.getVersesFromSong)
songsRouter.get(`${constants.API_SONGS}/:songId/verses/random`, songController.getRandomVerseFromSong)
songsRouter.get(`${constants.API_SONGS}/:songId/verses/:verseId/quotes/random`, songController.getRandomQuoteFromSongByVerseId)

versesRouter.get(constants.API_VERSES_RANDOM, verseController.getRandomVerse)
versesRouter.get(`${constants.API_VERSES}/:verseId`, verseController.getVerseById)
versesRouter.get(`${constants.API_VERSES}/:verseId/quotes/random`, verseController.getRandomQuoteFromVerse)

quotesRouter.get(constants.API_QUOTES_RANDOM, quoteController.getRandomQuote)
quotesRouter.get(`${constants.API_QUOTES}/:quoteId`, quoteController.getQuoteById)

server.name = config.get('app:name')
server.use(logger())
server.use(rootRouter.middleware())
server.use(songsRouter.middleware())
server.use(versesRouter.middleware())
server.use(quotesRouter.middleware())
server.use(docs.get('/docs', {
    title: config.get('docs:title'),
    version: config.get('app:version'),
    theme: config.get('docs:theme'),
    routeHandlers: config.get('docs:routeHandlers'),
    groups: [
        {
            groupName: config.get('docs:groups:songs:title'),
            routes: songsRouter.routes
        },
        {
            groupName: config.get('docs:groups:verses:title'),
            routes: versesRouter.routes
        },
        {
            groupName: config.get('docs:groups:quotes:title'),
            routes: quotesRouter.routes
        }
    ]
}))

server.listen(process.env.PORT || config.get('app:port') || 8080, () => {
    db.connect(config.get('db:config'))
      .then(() => config.get('db:migration:enabled') && migration.initData(config.get('db:migration:url')))
    console.log(`${server.name} application started!`)
})
