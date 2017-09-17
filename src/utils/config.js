const nconf = require('nconf')

nconf
    .argv()
    .env({
        separator: '_'
    })
    .file('file-config', {
        file: 'linden_honey.json',
        dir: 'config',
        search: true
    })
    .defaults({
        LH: {
            APP: {
                NAME: 'Linden Honey',
                PORT: process.env.PORT || 8080,
                MESSAGES: {
                    WELCOME: 'Welcome to the Linden Honey Server!\n\nPowered by Koa.js and Node.js\n\n\n\nИ всё идёт по плану...'
                }
            },
            SCRAPER: {
                ROUTER: {
                    ENABLED: false
                }
            }
        }
    })

nconf.required([
    'LH:DB:URL',
    nconf.get('LH:SCRAPER:ROUTER:ENABLED') ? 'LH:SCRAPER:URL' : 'LH:SCRAPER:ROUTER:ENABLED'
])

module.exports = nconf
