const UNKNOWN = 'неизвестен'

const defaultState = {
    title: UNKNOWN,
    author: UNKNOWN,
    album: UNKNOWN,
    verses: []
}

module.exports = class Song {
    constructor({ title = UNKNOWN, author = UNKNOWN, album = UNKNOWN, verses = [] } = defaultState) {
        this.title = title
        this.author = author
        this.album = album
        this.verses = verses
    }
}
