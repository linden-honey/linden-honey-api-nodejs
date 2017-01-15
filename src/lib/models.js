import fetch from 'node-fetch'

export class Quote {
    constructor(phrase) {
        this.phrase
    }
}

export class Song {
    constructor(name, url) {
        this.name = name
        this.url = url
    }

    getText() {
        return fetch(this.url)
    }
}
