import api from './api'

export class Quote {
    constructor(phrase) {
        this.phrase = phrase
    }
}

export class Song {
    constructor(title, id) {
        this.title = title
        this.id = id
    }

    getMeta() {
        return api.getSongMeta(this.id)
    }
}

export class SongMeta {
    constructor(title, author, album, text) {
        this.title = title
        this.author = author
        this.album = album
        this.text = text
    }
}
