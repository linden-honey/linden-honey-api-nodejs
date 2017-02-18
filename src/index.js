const koa = require('koa')
const logger = require('koa-logger')
const route = require('koa-route')

const db = require('./utils/db')
const migration = require('./utils/migration')
const config = require('./utils/config')
const constants = require('./utils/constants/path-constants')
const songController = require('./controllers/song-controller')

const server = module.exports = koa()
server.name = config.get('app:name')
server.use(logger())

server.use(route.get(constants.API_SONGS, songController.getAllSongs))
server.use(route.get(constants.API_SONGS_RANDOM, songController.getRandomSong))
server.use(route.get(`${constants.API_SONGS}/:id`, songController.getSongById))
server.use(route.get(`${constants.API_SONGS}/:id/quotes/random`, songController.getRandomQuoteFromSong))
server.use(route.get(constants.API_QUOTES_RANDOM, songController.getRandomQuote))

server.listen(process.env.PORT || config.get('app:port') || 8080, () => {
    db.init(config.get('db:config'))
      .then(() => !!config.get('db:migration:enabled') && migration.initData(config.get('db:migration:url')))
    console.log(`${server.name} application started!`)
})
