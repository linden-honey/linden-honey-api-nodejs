const nconf = require('nconf')

nconf.argv()
     .env({
         separator: '_'
     })
     .file({
         file:'config/local.json'
     })

nconf.required([
    'app:name',
    'app:host',
    'app:port',
    'db:dbName',
    'db:host',
    'db:port',
    'db:user',
    'db:password',
])

module.exports = nconf
