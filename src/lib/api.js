const fetch = require('node-fetch')
const cheerio = require('cheerio')
const { Song, SongMeta, Quote } = require('./models')
const constants = require('./util/source-constants')

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
                    return new Song($link.text(), id)
                })
                .toArray())
}

const fetchRandomSongMeta = () => {
    return fetchAllSongs()
            .then(songs => songs[Math.floor(Math.random() * songs.length)])
            .then(song => fetchSongMetaById(song.id))
}

const fetchSongById = id => {
    return fetchAllSongs()
                .then(songs => {
                    const result = songs.filter(song => song.id === id)
                    if(result.length === 0) {
                        return Promise.reject({
                            message: 'Resource not found',
                            body: '',
                            statusCode: 404
                        })
                    }
                    return result[0]
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
                    return new SongMeta(title, author, album, text)
                })
}

const fetchAllSongsMeta = () => {
    return fetchAllSongs().then(songs => {
        const promises = songs.map(song => fetchSongMetaById(song.id))
        return Promise.all(promises)
    })
}

const fetchAllQuotes = () => {

}

const fetchRandomQuote = () => {

}

module.exports = {
    getSongs: fetchAllSongs,
    getSongsMeta: fetchAllSongsMeta,
    getSongMeta: fetchSongMetaById,
    getRandomSongMeta: fetchRandomSongMeta,
    getQuotes: fetchAllQuotes,
    getRandomQuote: fetchRandomQuote
}
