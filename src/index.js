import restify from 'restify'
import * as api from './lib/api.js'

const server = restify.createServer({
  name: 'linden-honey',
  version: '1.0.0'
})

server.get('/echo/:name', function (req, res, next) {
  res.send({
      params: req.params,
      quotes: api.getQuotes()
  })
  return next()
});

server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url)
})
