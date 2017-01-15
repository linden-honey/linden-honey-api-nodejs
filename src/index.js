import restify from 'restify'
import api from './lib/api'
import * as constants from './lib/util/path-constants'

const server = restify.createServer({name: 'linden-honey', version: '1.0.0'})

server.get(constants.API_SONGS, (req, res, next) => {
    api.getSongs().then(songs => res.send(songs))
    return next()
});

server.get(constants.API_SONGS_RANDOM, (req, res, next) => {
    api.getRandomSongMeta().then(meta => res.send(meta))
    return next()
});

server.get(`${constants.API_SONGS}/:id`, (req, res, next) => {
    api.getSongMeta(req.params.id).then(meta => res.send(meta))
    return next()
});

server.get(constants.API_SONGS_ALL, (req, res, next) => {
    api.getSongsMeta().then(songsMeta => res.send(songsMeta))
    return next()
});

server.get(constants.API_QUOTES, (req, res, next) => {
    api.getQuotes().then(quotes => {
        res.send(quotes)
    })
    return next()
});

server.get(constants.API_QUOTES_RANDOM, (req, res, next) => {
    return next()
});

server.listen(8080, () => {
    console.log('%s listening at %s', server.name, server.url)
})
