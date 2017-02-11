const koa = require('koa')
const logger = require('koa-logger')
const route = require('koa-route')

const db = require('./util/db')
const config = require('./util/config')
const constants = require('./util/constants/path-constants')
const songController = require('./controller/song-controller')

const server = module.exports = koa()
server.name = config.get('app:name')
server.use(logger())

server.use(route.get(constants.API_SONGS, songController.findAll))

server.listen(process.env.PORT || config.get('app:port') || 8080, () => {
    db.init(config.get('db'))
    console.log('%s application started!', server.name)
})
