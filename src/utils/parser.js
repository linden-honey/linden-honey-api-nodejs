const cheerio = require('cheerio')

const { Preview, Quote, Song, Verse  } = require('../models/domain')

const parseHtml = async html => cheerio.load(html, {
    decodeEntities: false
})

const parseQuote = html => {
    const phrase = html.trim().replace(/\s+/g, ' ')
    return new Quote(phrase)
}

const parseVerse = html => {
    const quotes = html.split('<br>').map(parseQuote)
    return new Verse(quotes)
}

const parseLyrics = html => {
    return html.split(/\<br\>\s*\<br\>/g).map(parseVerse)
}

const parseSong = html => {
    return parseHtml(html).then($ => {
        const title = $('h2').text()
        const author = $('p:has(strong:contains(Автор))').text().split(': ')[1]
        const album = $('p:has(strong:contains(Альбом))').text().split(': ')[1]
        const lyricsHtml = $('p:last-of-type').html()
        const verses = parseLyrics(lyricsHtml)
        return new Song({ title, author, album, verses })
    })
}

const parsePreviews = html => {
    return parseHtml(html).then($ => {
        return $('#abc_list li a').map((index, link) => {
            const $link = $(link)
            const path = $link.attr('href') || ''      
            const id = path.substring(path.lastIndexOf('/') + 1, path.indexOf('.'))
            const title = $link.text()
            return new Preview({ id, title })
        }).toArray()
    })
}

module.exports = {
    parseSong
}
