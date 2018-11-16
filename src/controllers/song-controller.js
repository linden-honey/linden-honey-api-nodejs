class SongController {
    static MSG_ERROR_SONG_NOT_FOUND = 'Song not found'
    static MSG_ERROR_VERSE_NOT_FOUND = 'Verse not found'
    static MSG_ERROR_QUOTE_NOT_FOUND = 'Quote not found'

    constructor({ repository }) {
        this.repository = repository
    }

    async findSongsByTitle(ctx, next) {
        const title = ctx.query.title
        const pageable = {
            page: ctx.query.page,
            size: ctx.query.size,
            order: ctx.query.order
        }
        ctx.body = await this.repository.findSongsByTitle(title, pageable)
        return next()
    }

    async findSongsByPhrase(ctx, next) {
        const phrase = ctx.query.phrase
        const pageable = {
            page: ctx.query.page,
            size: ctx.query.size,
            order: ctx.query.order
        }
        ctx.body = await this.repository.findSongsByPhrase(phrase, pageable)
        return next()
    }

    async getAllSongs(ctx, next) {
        const pageable = {
            page: ctx.query.page,
            size: ctx.query.size,
            order: ctx.query.order
        }
        ctx.body = await this.repository.getAllSongs(pageable)
        return next()
    }

    async getSongById(ctx, next) {
        const song = await this.repository.findSongById(ctx.params.songId)
        if (song) {
            ctx.body = song
        } else {
            ctx.throw(404, SongController.MSG_ERROR_SONG_NOT_FOUND)
        }
        return next()
    }

    async getRandomSong(ctx) {
        const song = await this.repository.getRandomSong()
        if (song) {
            ctx.body = song
        } else {
            ctx.throw(404, SongController.MSG_ERROR_SONG_NOT_FOUND)
        }
    }

    async findQuotesFromSongByPhrase(ctx, next) {
        const songId = ctx.params.songId
        const phrase = ctx.query.phrase
        ctx.body = await this.repository.findQuotesFromSongByPhrase(songId, phrase)
        return next()
    }

    async getQuotesFromSong(ctx, next) {
        const song = await this.repository.findSongById(ctx.params.songId)
        if (song) {
            ctx.body = [].concat(...song.verses.map(verse => verse.quotes))
        } else {
            ctx.throw(404, SongController.MSG_ERROR_SONG_NOT_FOUND)
        }
        return next()
    }

    async getRandomQuoteFromSong(ctx, next) {
        const quote = await this.repository.getRandomQuoteFromSong(ctx.params.songId)
        if (quote) {
            ctx.body = quote
        } else {
            ctx.throw(404, SongController.MSG_ERROR_QUOTE_NOT_FOUND)
        }
        return next()
    }

    async getVersesFromSong(ctx, next) {
        const song = await this.repository.findSongById(ctx.params.songId)
        if (song) {
            ctx.body = song.verses
        } else {
            ctx.throw(404, SongController.MSG_ERROR_SONG_NOT_FOUND)
        }
        return next()
    }

    async getRandomVerseFromSong(ctx, next) {
        const verse = await this.repository.getRandomVerseFromSong(ctx.params.songId)
        if (verse) {
            ctx.body = verse
        } else {
            ctx.throw(404, SongController.MSG_ERROR_VERSE_NOT_FOUND)
        }
        return next()
    }
}

module.exports = SongController
