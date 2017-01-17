class Quote {
    constructor(phrase) {
        this.phrase = phrase
    }
}

class Song {
    constructor(id, title) {
        this.id = id
        this.title = title
    }
}

class SongMeta extends Song {
    constructor(options) {
        super(options.id, options.title)
        this.author = options.author
        this.album = options.album
        this.text = options.text
    }
}

exports.Quote = Quote
exports.Song = Song
exports.SongMeta = SongMeta
