const { ObjectId } = require('../utils/db')

class SongRepository {
    constructor({ db }) {
        this.db = db
    }

    findSongs({ text, selector, pageable = { page: 0, size: 20, order: 'asc' } }) {
        const query = text && text.trim()
        const page = pageable.page && parseInt(pageable.page) || 0
        const size = pageable.size && parseInt(pageable.size) || 20
        const skip = page * size
        const order = pageable.order === 'asc' ? 1 : pageable.order === 'desc' ? -1 : 1

        return !query ? [] : this.db
            .find({
                [selector]: {
                    $regex: query,
                    $options: 'i'
                }
            })
            .skip(skip)
            .limit(size)
            .sort({ 'title': order })
            .select('_id title')
    }

    findSongsByTitle(title, pageable = { page: 0, size: 20, order: 'asc' }) {
        return this.findSongs({
            text: title,
            selector: 'title',
            pageable
        })
    }

    findSongsByPhrase(phrase, pageable = { page: 0, size: 20, order: 'asc' }) {
        return this.findSongs({
            text: phrase,
            selector: 'verses.quotes.phrase',
            pageable
        })
    }

    findSongById(id) {
        return this.db.findById(id)
    }

    getAllSongs(pageable = { page: 0, size: 20, order: 'asc' }) {
        const page = pageable.page && parseInt(pageable.page) || 0
        const size = pageable.size && parseInt(pageable.size) || 20
        const skip = page * size
        const order = pageable.order === 'asc' ? 1 : pageable.order === 'desc' ? -1 : 1
    
        return this.db
            .find()
            .skip(skip)
            .limit(size)
            .sort({ title: order })
            .select('_id title')
    }
    
    async getRandomSong() {
        const songs = await this.db.aggregate([
            { $sample: { size: 1 } }
        ])
        return songs && songs[0]
    }
    
    findQuotesFromSongByPhrase(songId, phrase) {
        const query = phrase && phrase.trim()    
        return !query ? [] : this.db
            .aggregate([
                { $unwind: '$verses' },
                { $unwind: '$verses.quotes' },
                {
                    $match: {
                        _id: new ObjectId(songId),
                        'verses.quotes.phrase': {
                            $regex: query,
                            $options: 'i'
                        }
                    }
                },
                { $group: { _id: '$verses.quotes.phrase' } },
                {
                    $project: {
                        _id: false,
                        phrase: '$_id'
                    }
                }
            ])
    }
    
    async getRandomQuoteFromSong(songId) {
        const quotes = await Song.aggregate([
            {
                $match: {
                    _id: new ObjectId(songId)
                }
            },
            { $unwind: '$verses' },
            { $unwind: '$verses.quotes' },
            { $sample: { size: 1 } },
            {
                $project: {
                    _id: false,
                    phrase: '$verses.quotes.phrase'
                }
            }
        ])
        return quotes && quotes[0]
    }
    
    async getRandomVerseFromSong(songId) {
        const verses = await Song.aggregate([
            {
                $match: {
                    _id: new ObjectId(songId)
                }
            },
            { $unwind: '$verses' },
            { $sample: { size: 1 } },
            {
                $project: {
                    _id: false,
                    quotes: '$verses.quotes'
                }
            }
        ])
        return verses && verses[0]
    }

}

module.exports = SongRepository
