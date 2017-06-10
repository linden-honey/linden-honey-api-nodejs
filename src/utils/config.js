const nconf = require('nconf')

nconf.argv()
    .env({
        separator: '_'
    })
    .file({
        file: 'config/default.json'
    })

nconf.required([
    'APP:NAME',
    'APP:PORT',
    'DB:URL'
])

module.exports = nconf
