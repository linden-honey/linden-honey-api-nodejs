import fetch from 'node-fetch'
import cheerio from 'cheerio'
import {Song, Quote} from './models'
import * as constants from './util/source-constants'

let fetchAllSongs = () => {
    return fetch(constants.TEXTS_RESOURCE).then(res => res.textConverted())
                               .then(html => cheerio.load(html))
                               .then($ => $('#abc_list li a')
                               .map((index, link) => {
                                   let $link = $(link)
                                   return new Song($link.text(),`${constants.BASE_URL}/${$link.attr('href')}`)
                               })
                               .toArray())
}

const api = {
    getQuotes() {
        return new Promise(quotes => [new Quote('Всё идёт по плану!')])
    },
    getSongs() {
        return fetchAllSongs()
    },
    getRandomSong() {
        return fetchAllSongs().then(songs => songs[Math.floor(Math.random() * songs.length)])
    }
}

export default api
