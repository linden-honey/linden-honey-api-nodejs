const fetch = require('node-fetch')
const retry = require('async-retry')

const parser = require('../utils/grob-parser')

const defaultConfig = {
    retries: 5,
    factor: 3,
    minTimeout: 1000,
    maxTimeout: 60000,
    randomize: true
}

const validateFactory = (validationPredicate, errorSupplier) => object => {
    if(!validationPredicate(object)) {
        const error = typeof errorSupplier === 'function' ? errorSupplier() : new Error("Validation failed")
        throw error
    }
    return object
}

const validateSong = validateFactory(
    song => !!(song && song.verses && song.verses.length),
    () => new Error('Song validation failed')
)

class GrobScraper {
    constructor({ url, config = defaultConfig }) {
        this.url = url
        this.config = config
    }

    async fetchPreviews() {
        const response = await fetch(`${this.url}/texts`)
        const html = await response.textConverted()
        return parser.parsePreviews(html)
    }

    async fetchSongs() {
        const previews = await this.fetchPreviews()
        const songs = await Promise.all(previews.map(preview => this.fetchSong(preview.id)))
        return songs
    }

    async fetchSong(id) {
        return await retry(async () => {
            console.debug(`Fetching song with id - ${id} - ${new Date()}`)
            const response = await fetch(`${this.url}/text_print.php?area=go_texts&id=${id}`)
            const html = await response.textConverted()
            const song = parser.parseSong(html)
            return validateSong(song)
        }, this.config)
    }
}

module.exports = GrobScraper
