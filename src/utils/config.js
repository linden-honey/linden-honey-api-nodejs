const nconf = require('nconf')

nconf
    .argv()
    .env({
        separator: '_'
    })
    .file('local', {
        file: 'linden_honey_config.json',
        dir: 'config',
        search: true
    })
    .defaults({
        LH: {
            APP: {
                NAME: 'Linden Honey Bot',
                PORT: process.env.PORT || 8080,
                MESSAGES: {
                    WELCOME: 'Welcome to the Linden Honey Server!\n\nPowered by Koa.js and Node.js\n\n\n\nИ всё идёт по плану...'
                }
            }
        }
    })

nconf.required([
    'LH:DB:URL'
])

module.exports = nconf
