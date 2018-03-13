const { describe, it } = require('mocha')
const { expect } = require('chai')

const parser = require('./parser')

describe('Parser', () => {
    describe('#parseQuote(html)', () => {
        it('should return quote object with a phrase string', () => {
            const html = 'Some phrase'
            const quote = parser.parseQuote(html)
            expect(quote)
                .to.be.exist
                .and
                .to.be.an('object')
                .and
                .to.have.property('phrase')
                .that.is.a('string').equals('Some phrase')
        })

        it('should replace all trailing spaces in a phrase', () => {
            const html = '    Some text    with    trailing spaces  '
            const quote = parser.parseQuote(html)
            expect(quote)
                .to.have.property('phrase')
                .that
                .equals('Some text with trailing spaces')
        })

        it('should convert all html formatting tags to regular text', () => {
            const html = '<strong>Some</strong> text<br\> with html<br\> <i>formatting</i> <b>tags</b>'
            const quote = parser.parseQuote(html)
            expect(quote)
                .to.have.property('phrase')
                .that
                .equals('Some text with html formatting tags')
        })
    })

    describe('#parseVerse(html)', () => {
        it('should return verse object with a quotes array', () => {
            const html = 'Some phrase'
            const verse = parser.parseVerse(html)
            expect(verse)
                .to.be.exist
                .and
                .to.be.an('object')
                .and
                .to.have.property('quotes')
                .that
                .is.an('array').with.lengthOf(1)
                .and
                .deep.has.members([{
                    phrase: 'Some phrase'
                }])
        })

        it('should parse all phrases into a quotes array', () => {
            const html =
                'Some phrase 1'
                + '<br\>'
                + 'Some phrase 2'
                + '<br\>'
                + 'Some phrase 3'
            const verse = parser.parseVerse(html)
            expect(verse)
                .to.have.property('quotes')
                .that
                .is.an('array').with.lengthOf(3)
                .and
                .deep.has.members([{
                    phrase: 'Some phrase 1'
                }, {
                    phrase: 'Some phrase 2'
                }, {
                    phrase: 'Some phrase 3'
                }])
        })
    })

    describe('#parseLyrics(html)', () => {
        it('should return array with verses objects', () => {
            const html =
                'Some phrase 1'
                + '<br\><br\><br\>'
                + 'Some phrase 2'
                + '<br\>'
                + 'Some phrase 3'
                + '<br\> <br\>'
                + 'Some phrase 4'
            const lyrics = parser.parseLyrics(html)
            expect(lyrics)
                .to.be.exist
                .and
                .to.be.an('array')
                .with.lengthOf(3)
                .and
                .to.deep.have.members([{
                    quotes: [{ phrase: 'Some phrase 1' }]
                }, {
                    quotes: [
                        { phrase: 'Some phrase 2' },
                        { phrase: 'Some phrase 3' }
                    ]
                }, {
                    quotes: [{ phrase: 'Some phrase 4' }]
                }])
        })
    })

    describe('#parseSong(html)', () => {
        it('should return default song object', () => {
            const html = ''
            const song = parser.parseSong(html)
            expect(song).to.be.exist.and.to.be.an('object')
            expect(song).to.have.property('title').that.is.a('string').equals('неизвестен')
            expect(song).to.have.property('author').that.is.a('string').equals('неизвестен')
            expect(song).to.have.property('album').that.is.a('string').equals('неизвестен')
            expect(song).to.have.property('verses').that.is.an('array').with.lengthOf(0)
        })

        it('should return song object with all filled props', () => {
            const html =
                '<h2>Всё идёт по плану</h2>'
                + '<p><strong>Автор:</strong> Е.Летов</p>'
                + '<p><strong>Альбом:</strong> Всё идёт по плану</p>'
                + '<p>Some phrase 1<br\>Some phrase 2</p>'
            const song = parser.parseSong(html)
            expect(song).to.be.exist.and.to.be.an('object')
            expect(song).to.have.property('title').that.is.a('string').equals('Всё идёт по плану')
            expect(song).to.have.property('author').that.is.a('string').equals('Е.Летов')
            expect(song).to.have.property('album').that.is.a('string').equals('Всё идёт по плану')
            expect(song)
                .to.have.property('verses')
                .that
                .is.an('array').with.lengthOf(1)
                .and.deep.has.members([{
                    quotes: [
                        { phrase: 'Some phrase 1' },
                        { phrase: 'Some phrase 2' }
                    ]
                }])
        })

        it('should return song object with unknown title', () => {
            const html =
                + '<p><strong>Автор:</strong> Е.Летов</p>'
                + '<p><strong>Альбом:</strong> Всё идёт по плану</p>'
                + '<p></p>'
            const song = parser.parseSong(html)
            expect(song).to.be.exist.and.to.be.an('object')
            expect(song).to.have.property('title').that.is.a('string').equals('неизвестен')
            expect(song).to.have.property('author').that.is.a('string').equals('неизвестен')
            expect(song).to.have.property('album').that.is.a('string').equals('Всё идёт по плану')
            expect(song)
                .to.have.property('verses')
                .that
                .is.an('array').with.lengthOf(0)
        })

        it('should return song object with unknown author', () => {
            const html =
                '<h2>Всё идёт по плану</h2>'
                + '<p><strong>Альбом:</strong> Всё идёт по плану</p>'
                + '<p></p>'
            const song = parser.parseSong(html)
            expect(song).to.be.exist.and.to.be.an('object')
            expect(song).to.have.property('title').that.is.a('string').equals('Всё идёт по плану')
            expect(song).to.have.property('author').that.is.a('string').equals('неизвестен')
            expect(song).to.have.property('album').that.is.a('string').equals('Всё идёт по плану')
            expect(song)
                .to.have.property('verses')
                .that
                .is.an('array').with.lengthOf(0)
        })

        it('should return song object with unknown album', () => {
            const html =
                '<h2>Всё идёт по плану</h2>'
                + '<p><strong>Автор:</strong> Е.Летов</p>'
                + '<p></p>'
            const song = parser.parseSong(html)
            expect(song).to.be.exist.and.to.be.an('object')
            expect(song).to.have.property('title').that.is.a('string').equals('Всё идёт по плану')
            expect(song).to.have.property('author').that.is.a('string').equals('Е.Летов')
            expect(song).to.have.property('album').that.is.a('string').equals('неизвестен')
            expect(song)
                .to.have.property('verses')
                .that
                .is.an('array').with.lengthOf(0)
        })
    })

    describe('#parsePreviews(html)', () => {
        it('should return array with preview objects', () => {
            const html =
                '<ul id="abc_list">'
                + '<li><a href="/texts/1056899068.html">Всё идёт по плану</a></li>'
                + '<li><a href="">Unknown</a></li>'
                + '<li><a href="/texts/1056901056.html">Всё как у людей</a></li>'
                + '</ul>'
            const previews = parser.parsePreviews(html)
            expect(previews)
                .to.be.exist
                .and
                .to.be.an('array').with.lengthOf(2)
                .and
                .to.be.deep.have.members([{
                    id: '1056899068',
                    title: 'Всё идёт по плану'
                },
                {
                    id: '1056901056',
                    title: 'Всё как у людей'
                }])
        })

        it('should return empty array', () => {
            const html = ''
            const previews = parser.parsePreviews(html)
            expect(previews)
                .to.be.exist
                .and
                .to.be.an('array').with.lengthOf(0)
        })
    })
})
