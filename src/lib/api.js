import fetch from 'node-fetch'
import cheerio from 'cheerio'
import {Song, SongMeta, Quote, Verse} from './models'
import * as constants from './util/source-constants'

const fetchAllSongs = () => {
    return fetch(constants.TEXTS_RESOURCE_URL)
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
            .then(song => song.getMeta())
}

const fetchSongMeta = songId => {
    return fetch(constants.SONG_PRINT_URL(songId))
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
                                      .map(verse => {
                                          const rows = verse.split('<br>')
                                                            .map(row => row.trim())
                                                            .map(row => row.replace(/\s+/g,' '))
                                          return new Verse(rows)
                                      })
                    return new SongMeta(title, author, album, text)
                })
}

const fetchAllSongsMeta = () => {
    return fetchAllSongs().then(songs => {
        const promises = songs.map(song => song.getMeta())
        return Promise.all(promises)
    })
}

const fetchAllQuotes = () => {

}

const fetchRandomQuote = () => {

}

const api = {
    getSongs: fetchAllSongs,
    getSongsMeta: fetchAllSongsMeta,
    getSongMeta: fetchSongMeta,
    getRandomSongMeta: fetchRandomSongMeta,
    getQuotes: fetchAllQuotes,
    getRandomQuote: fetchRandomQuote
}

export default api
