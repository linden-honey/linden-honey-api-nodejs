const restify = require('restify')
const api = require('./utils/api')
const config = require('./utils/config')
const constants = require('./utils/constants/path-constants')

const errorHandler = (res, err) => {
    const error = Error.isPrototypeOf(err) ?
                  restify.InternalServerError(err.message) :
                  new restify.HttpError(err)
    res.send(error)
}

const server = restify.createServer({
    name: config.get('app:name'),
    version: config.get('app:version')
})

server.get(constants.ROOT, (req, res, next) => {
    res.end(config.get('app:messages:welcome'))
    return next()
})

server.get(constants.API_SONGS, (req, res, next) => {
    api.getSongs()
       .then(songs => res.send(songs))
       .catch(err => errorHandler(res, err))
    return next()
})

server.get(constants.API_SONGS_RANDOM, (req, res, next) => {
    api.getRandomSongMeta()
       .then(meta => res.send(meta))
       .catch(err => errorHandler(res, err))
    return next()
})

server.get(`${constants.API_SONGS}/:id`, (req, res, next) => {
    api.getSongMeta(req.params.id)
       .then(meta => res.send(meta))
       .catch(err => errorHandler(res, err))
    return next()
})

server.get(`${constants.API_SONGS}/:id/quotes/random`, (req, res, next) => {
    api.getRandomQuoteFromSong(req.params.id)
       .then(quote => res.send(quote))
       .catch(err => errorHandler(res, err))
    return next()
})

server.get(constants.API_QUOTES_RANDOM, (req, res, next) => {
    api.getRandomQuote()
       .then(quote => res.send(quote))
       .catch(err => errorHandler(res, err))
    return next()
})

server.listen(process.env.PORT || 8080, () => {
    console.log('%s listening at %s', server.name, server.url)
})
