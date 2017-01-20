class Text {
    constructor(verses = []) {
        this.verses = [...verses]
    }
}

class Verse {
    constructor(quotes = []) {
        this.quotes = [...quotes]
    }
}

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

class SongMeta {
    constructor(options) {
        this.title = options.title
        this.author = options.author
        this.album = options.album
        this.text = options.text
    }
}

exports.Text = Text
exports.Verse = Verse
exports.Quote = Quote
exports.Song = Song
exports.SongMeta = SongMeta
