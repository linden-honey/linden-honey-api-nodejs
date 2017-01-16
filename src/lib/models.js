module.exports.Quote = class Quote {
    constructor(phrase) {
        this.phrase = phrase
    }
}

module.exports.Song = class Song {
    constructor(title, id) {
        this.title = title
        this.id = id
    }
}

module.exports.SongMeta = class SongMeta {
    constructor(title, author, album, text) {
        this.title = title
        this.author = author
        this.album = album
        this.text = text
    }
}
