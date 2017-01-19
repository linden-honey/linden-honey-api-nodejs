const cheerio = require('cheerio')
const {Song, SongMeta, Quote, Verse, Text} = require('./models')

const patchCheerio = $ => {
    $._options.decodeEntities = false
    return $
}

const getQuote = html => {
    const phrase = html.trim().replace(/\s+/g, ' ')
    return new Quote(phrase)
}

const getVerse = html => {
    const quotes = html.split('<br>').map(getQuote)
    return new Verse(quotes)
}

const getText = html => {
    const verses = html.split(/\<br\>\s*\<br\>/g).map(getVerse)
    return new Text(verses)
}

const parseHtml = html => Promise.resolve(cheerio.load(html)).then(patchCheerio)

const getSongs = html => {
    return parseHtml(html).then($ => {
        return $('#abc_list li a').map((index, link) => {
            const $link = $(link)
            const path = $link.attr('href')
            const id = path.substring(path.lastIndexOf('/') + 1, path.indexOf('.'))
            return new Song(id, $link.text())
        }).toArray()
    })
}

const getSongMeta = html => {
    return parseHtml(html).then($ => {
        const title = $('h2').text()
        const $meta = $('p')
        const author = $($meta.get(0)).text().split(': ')[1]
        const unknownAlbum = $meta.length === 2
        const album = unknownAlbum ? 'неизвестен' : $($meta.get(1)).text().split(': ')[1]
        const textSelector = unknownAlbum ? 1 : 2
        const textHtml = $($meta.get(textSelector)).html()
        const text = getText(textHtml)
        return new SongMeta({title: title, author: author, album: album, text: text})
    })
}

module.exports = {
    getSongs: getSongs,
    getSongMeta: getSongMeta
}
