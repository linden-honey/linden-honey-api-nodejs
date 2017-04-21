const nconf = require('nconf')

nconf.argv()
    .env({
        separator: '_'
    })
    .file({
        file: 'config/default.json'
    })

nconf.required([
    'app:name',
    'app:host',
    'app:port',
    'db:url'
])

module.exports = nconf
