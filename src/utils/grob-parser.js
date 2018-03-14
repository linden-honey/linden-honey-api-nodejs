const cheerio = require('cheerio')

const { Preview, Quote, Song, Verse } = require('../models/domain')

const parseHtml = html => cheerio.load(html)
const isNotBlank = string => !!string && string.trim().length > 0

const parseQuote = html => {
    const $ = parseHtml(html)
    const phrase = $.text().trim().replace(/\s+/g, ' ')
    return new Quote(phrase)
}

const parseVerse = html => {
    const quotes = html.split('<br>').map(parseQuote).filter(quote => isNotBlank(quote.phrase))
    return new Verse(quotes)
}

const parseLyrics = html => html ? html.split(/(?:<br\>\s*){2,}/g).map(parseVerse) : []

const parseSong = html => {
    const $ = parseHtml(html)
    const title = $('h2').text() || void 0
    const author = $('p:has(strong:contains(Автор))').text().split(': ')[1]
    const album = $('p:has(strong:contains(Альбом))').text().split(': ')[1]
    const lyricsHtml = $('p:last-of-type').html()
    const verses = parseLyrics(lyricsHtml)
    return new Song({ title, author, album, verses })
}

const parsePreviews = html => {
    const $ = parseHtml(html)
    return $('#abc_list a')
        .map((index, link) => {
            const $link = $(link)
            const path = $link.attr('href')
            const id = path && path.substring(path.lastIndexOf('/') + 1, path.indexOf('.'))
            const title = $link.text()
            return new Preview({ id, title })
        })
        .toArray()
        .filter(preview => preview.id)
}

module.exports = {
    parseQuote,
    parseVerse,
    parseLyrics,
    parseSong,
    parsePreviews
}
