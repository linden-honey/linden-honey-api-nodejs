const express = require('express')
require('express-async-errors')// patch to support promise rejection

const { connect, ObjectId } = require('./utils/db')
const { config } = require('./utils/config')

const {
    QuoteRepository,
    VerseRepository,
    SongRepository,
} = require('./repositories')

const {
    DocsController,
    QuoteController,
    VerseController,
    SongController,
} = require('./controllers')

const {
    validation,
} = require('./middleware')

const { oas } = require('./docs')

const app = express()

const { Router } = express

connect(config.application.db.uri).then((client) => {
    const collection = client.db().collection('songs')

    /**
     * Declare song routes
     */
    const songController = new SongController({
        repository: new SongRepository({
            collection,
        }),
    })
    const songRouter = new Router()
        .get('/', songController.getAllSongs)
        .get('/search/random', songController.getRandomSong)
        .get('/search/by-title', songController.findSongsByTitle)
        .get('/search/by-phrase', songController.findSongsByPhrase)
        .use('/:songId', validation.createValidator(({ params: { songId } }) => songId, ObjectId.isValid, 'Invalid id!'))
        .get('/:songId', songController.getSongById)
        .get('/:songId/quotes', songController.getQuotesFromSong)
        .get('/:songId/quotes/search/random', songController.getRandomQuoteFromSong)
        .get('/:songId/quotes/search/by-phrase', songController.findQuotesFromSongByPhrase)
        .get('/:songId/verses', songController.getVersesFromSong)
        .get('/:songId/verses/search/random', songController.getRandomVerseFromSong)

    /**
     * Declare verse routes
     */
    const verseController = new VerseController({
        repository: new VerseRepository({
            collection,
        }),
    })
    const verseRouter = new Router()
        .get('/search/random', verseController.getRandomVerse)

    /**
     * Declare quote routes
     */
    const quoteController = new QuoteController({
        repository: new QuoteRepository({
            collection,
        }),
    })
    const quoteRouter = new Router()
        .get('/search/random', quoteController.getRandomQuote)
        .get('/search/by-phrase', quoteController.findQuotesByPhrase)

    /**
     * Declare documentation routes
     */
    const docsController = new DocsController({
        spec: oas,
    })
    const docsRouter = new Router()
        .use('/', docsController.swaggerUiStatic)
        .get('/api-docs', docsController.getSpec)
        .get('/', docsController.getSwaggerUi)

    /**
     * Declare API routes
     */
    const apiRouter = new Router()
        .use('/songs', songRouter)
        .use('/verses', verseRouter)
        .use('/quotes', quoteRouter)

    /**
     * Apply routes
     */
    app.use('/', docsRouter)
    app.use(config.application.rest.basePath, apiRouter)

    app.listen(config.server.port, () => {
        console.log(`Application is started on ${config.server.port} port!`)
    })
})
