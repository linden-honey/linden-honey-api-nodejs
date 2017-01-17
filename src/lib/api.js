const fetch = require('node-fetch')
const cheerio = require('cheerio')
const StreamJS = require('streamjs')
const { Song, SongMeta, Quote } = require('./models')
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
                    const author = $($meta.get(0)).text().split(': ')[1]
                    const album = $($meta.get(1)).text().split(': ')[1]
                    const text = $($meta.get(2))
                                      .html()
                                      .split(/\<br\>\s*\<br\>/g)
                                      .map(verse => verse.split('<br>')
                                                         .map(row => row.trim())
                                                         .map(row => row.replace(/\s+/g,' ')))
                    return new SongMeta({
                        id: id,
                        title: title,
                        author: author,
                        album: album,
                        text: text
                    })
                })
}

const fetchAllSongsMeta = () => {
    return fetchAllSongs().then(songs => {
        const promises = songs.map(song => fetchSongMetaById(song.id))
        return Promise.all(promises)
    })
}

const fetchAllQuotes = () => {
    return fetchAllSongsMeta()
                .then(songsMeta => StreamJS.of(songsMeta)
                                           .flatMap(meta => StreamJS.of(meta.text))
                                           .flatMap(verse => StreamJS.of(verse))
                                           .map(phrase => new Quote(phrase))
                                           .toArray())
}

const fetchRandomQuote = () => {
    return fetchRandomSongMeta().then(meta => {
        const verse = getRandomElement(meta.text)
        const phrase = getRandomElement(verse)
        return new Quote(phrase)
    })
}

module.exports = {
    getSongs: fetchAllSongs,
    getSongsMeta: fetchAllSongsMeta,
    getSongMeta: fetchSongMetaById,
    getRandomSongMeta: fetchRandomSongMeta,
    getQuotes: fetchAllQuotes,
    getRandomQuote: fetchRandomQuote
}
