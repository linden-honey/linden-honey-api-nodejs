const MSG_ERROR_SONG_NOT_FOUND = 'Song not found'
const MSG_ERROR_VERSE_NOT_FOUND = 'Verse not found'
const MSG_ERROR_QUOTE_NOT_FOUND = 'Quote not found'

class SongController {
    constructor({ repository }) {
        this.repository = repository
    }

    findSongsByTitle = async (req, res) => {
        const { title, page, size, order } = req.query
        const pageable = {
            page,
            size,
            order,
        }
        const songs = await this.repository.findSongsByTitle(title, pageable)
        res.json(songs)
    }

    findSongsByPhrase = async (req, res) => {
        const { phrase, page, size, order } = req.query
        const pageable = {
            page,
            size,
            order,
        }
        const songs = await this.repository.findSongsByPhrase(phrase, pageable)
        res.json(songs)
    }

    getAllSongs = async (req, res) => {
        const { page, size, order } = req.query
        const pageable = {
            page,
            size,
            order,
        }
        const songs = await this.repository.getAllSongs(pageable)
        res.json(songs)
    }

    getSongById = async (req, res) => {
        const { songId } = req.params
        const song = await this.repository.findSongById(songId)
        if (song) {
            res.json(song)
        } else {
            res.status(404).send(MSG_ERROR_SONG_NOT_FOUND)
        }
    }

    getRandomSong = async (_, res) => {
        const song = await this.repository.getRandomSong()
        if (song) {
            res.json(song)
        } else {
            res.status(404).send(MSG_ERROR_SONG_NOT_FOUND)
        }
    }

    findQuotesFromSongByPhrase = async (req, res) => {
        const { songId } = req.params
        const { phrase } = req.query
        const quotes = await this.repository.findQuotesFromSongByPhrase(songId, phrase)
        res.json(quotes)
    }

    getQuotesFromSong = async (req, res) => {
        const { songId } = req.params
        const song = await this.repository.findSongById(songId)
        if (song) {
            const quotes = [].concat(...song.verses.map(verse => verse.quotes))
            res.json(quotes)
        } else {
            res.status(404).send(MSG_ERROR_SONG_NOT_FOUND)
        }
    }

    getRandomQuoteFromSong = async (req, res) => {
        const { songId } = req.params
        const quote = await this.repository.getRandomQuoteFromSong(songId)
        if (quote) {
            res.json(quote)
        } else {
            res.status(404).send(MSG_ERROR_QUOTE_NOT_FOUND)
        }
    }

    getVersesFromSong = async (req, res) => {
        const { songId } = req.params
        const song = await this.repository.findSongById(songId)
        if (song) {
            const { verses } = song
            res.json(verses)
        } else {
            res.status(404).send(MSG_ERROR_SONG_NOT_FOUND)
        }
    }

    getRandomVerseFromSong = async (req, res) => {
        const { songId } = req.params
        const verse = await this.repository.getRandomVerseFromSong(songId)
        if (verse) {
            res.json(verse)
        } else {
            res.status(404).send(MSG_ERROR_VERSE_NOT_FOUND)
        }
    }
}

module.exports = SongController
