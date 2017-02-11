const nconf = require('nconf')

nconf.argv()
     .env({
         separator: '_'
     })
     .file({
         file:'config/local.json'
     })

//TODO add required keys to prevent unexpected behaviour
nconf.required([])

module.exports = nconf
