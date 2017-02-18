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
    'db:config:dbName',
    'db:config:host',
    'db:config:port',
    'db:config:user',
    'db:config:password'
])

module.exports = nconf
