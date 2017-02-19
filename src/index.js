const koa = require('koa')
const logger = require('koa-logger')
const route = require('koa-route')

const db = require('./utils/db')
const migration = require('./utils/migration')
const config = require('./utils/config')
const constants = require('./utils/constants/path-constants')
const quoteController = require('./controllers/quote-controller')
const verseController = require('./controllers/verse-controller')
const songController = require('./controllers/song-controller')

const server = module.exports = koa()
server.name = config.get('app:name')
server.use(logger())

server.use(route.get(constants.API_SONGS, songController.getAllSongs))
server.use(route.get(constants.API_SONGS_RANDOM, songController.getRandomSong))
server.use(route.get(`${constants.API_SONGS}/:id`, songController.getSongById))
server.use(route.get(`${constants.API_SONGS}/:id/quotes/random`, songController.getRandomQuoteFromSong))
server.use(route.get(`${constants.API_SONGS}/:id/verses/random`, songController.getRandomVerseFromSong))
server.use(route.get(`${constants.API_SONGS}/:id/verses/:id/quotes/random`, songController.getRandomQuoteFromSongByVerseId))

server.use(route.get(constants.API_VERSES_RANDOM, verseController.getRandomVerse))
server.use(route.get(`${constants.API_VERSES}/:id`, verseController.getVerseById))
server.use(route.get(`${constants.API_VERSES}/:id/quotes/random`, verseController.getRandomQuoteFromVerse))

server.use(route.get(constants.API_QUOTES_RANDOM, quoteController.getRandomQuote))
server.use(route.get(`${constants.API_QUOTES}/:id`, quoteController.getQuoteById))

server.listen(process.env.PORT || config.get('app:port') || 8080, () => {
    db.connect(config.get('db:config'))
      .then(() => config.get('db:migration:enabled') && migration.initData(config.get('db:migration:url')))
    console.log(`${server.name} application started!`)
})
