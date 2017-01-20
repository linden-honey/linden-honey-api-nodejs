const fetch = require('node-fetch')
const constants = require('./constants/source-constants')
const parser = require('./parser')

const checkResponse = res => {
    const error = {
        message: 'Http Error happens',
        statusCode: res.status
    }
    return !res.ok
        ? Promise.reject(error)
        : res
}

const getRandomElement = array => array[Math.floor(Math.random() * array.length)]

const getQuoteFromMeta = meta => {
    const verse = getRandomElement(meta.text.verses)
    return getRandomElement(verse.quotes)
}

const fetchAllSongs = () => (
    fetch(constants.TEXTS_RESOURCE_URL)
        .then(checkResponse)
        .then(res => res.textConverted())
        .then(parser.getSongs)
)

const fetchSongById = id => fetchAllSongs().then(songs => {
    const song = songs.find(song => song.id === id)
    return song || Promise.reject({message: 'Resource not found', statusCode: 404})
})

const fetchRandomSongMeta = () =>  (
    fetchAllSongs()
        .then(songs => getRandomElement(songs))
        .then(song => fetchSongMetaById(song.id))
)

const fetchSongMetaById = id => (
    fetchSongById(id)
        .then(song => fetch(constants.SONG_PRINT_URL(song.id)))
        .then(checkResponse)
        .then(res => res.textConverted())
        .then(parser.getSongMeta)
)

const fetchRandomQuote = () => fetchRandomSongMeta().then(getQuoteFromMeta)

module.exports = {
    getSongs: fetchAllSongs,
    getSongMeta: fetchSongMetaById,
    getRandomSongMeta: fetchRandomSongMeta,
    getRandomQuote: fetchRandomQuote
}
