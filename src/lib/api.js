const fetch = require('node-fetch')
const cheerio = require('cheerio')
const { Song, SongMeta, Quote, Verse, Text } = require('./models')
const constants = require('./util/source-constants')

const getRandomElement = array => array[Math.floor(Math.random() * array.length)]

const checkResponse = res => {
    const error = {
        message: 'Http Error happens',
        body: '',
        statusCode: res.status
    }
    return !res.ok ? Promise.reject(error) : res
}

const fetchAllSongs = () => {
    return fetch(constants.TEXTS_RESOURCE_URL)
                .then(checkResponse)
                .then(res => res.textConverted())
                .then(html => cheerio.load(html))
                .then($ => $('#abc_list li a')
                .map((index, link) => {
                    const $link = $(link)
                    const path = $link.attr('href')
                    const id = path.substring(path.lastIndexOf('/') + 1, path.indexOf('.'))
                    return new Song(id, $link.text())
                })
                .toArray())
}

const fetchRandomSongMeta = () => {
    return fetchAllSongs()
                .then(songs => getRandomElement(songs))
                .then(song => fetchSongMetaById(song.id))
}

const fetchSongById = id => {
    return fetchAllSongs()
                .then(songs => {
                    const song = songs.find(song => song.id === id)
                    return song || Promise.reject({message: 'Resource not found', statusCode: 404})
                })
}

const fetchSongMetaById = id => {
    return fetchSongById(id)
                .then(song => fetch(constants.SONG_PRINT_URL(song.id)))
                .then(checkResponse)
                .then(res => res.textConverted())
                .then(html => cheerio.load(html))
                .then($ => {
                    $._options.decodeEntities = false
                    const title = $('h2').text()
                    const $meta = $('p')
                    const unknownAlbum = $meta.length === 2
                    const textSelector = unknownAlbum ? 1 : 2
                    const author = $($meta.get(0)).text().split(': ')[1]
                    const album = unknownAlbum ? 'неизвестен' : $($meta.get(1)).text().split(': ')[1]
                    const verses = $($meta.get(textSelector))
                                    .html()
                                    .split(/\<br\>\s*\<br\>/g)
                                    .map(verse => {
                                        const quotes = verse.split('<br>')
                                                            .map(row => row.trim().replace(/\s+/g,' '))
                                                            .map(phrase => new Quote(phrase))
                                        return new Verse(quotes)
                                    })
                    const text = new Text(verses)
                    return new SongMeta({
                        id: id,
                        title: title,
                        author: author,
                        album: album,
                        text: text
                    })
                })
}

const fetchRandomQuote = () => {
    return fetchRandomSongMeta().then(meta => {
        const verse = getRandomElement(meta.text.verses)
        const quote = getRandomElement(verse.quotes)
        return quote
    })
}

module.exports = {
    getSongs: fetchAllSongs,
    getSongMeta: fetchSongMetaById,
    getRandomSongMeta: fetchRandomSongMeta,
    getRandomQuote: fetchRandomQuote
}
