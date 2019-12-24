const { ObjectId } = require('../utils/db')

class SongRepository {
    constructor({ collection }) {
        this.collection = collection
    }

    findSongs = ({ text, selector, pageable = { page: 0, size: 20, order: 'asc' } }) => {
        const query = text && text.trim()
        const page = pageable.page && parseInt(pageable.page) || 0
        const size = pageable.size && parseInt(pageable.size) || 20
        const skip = page * size
        const order = pageable.order === 'asc' ? 1 : pageable.order === 'desc' ? -1 : 1

        return !query ? [] : this.collection
            .find(
                {
                    [selector]: {
                        $regex: query,
                        $options: 'i',
                    },
                },
                {
                    _id: 1,
                    title: 1,
                },
            )
            .skip(skip)
            .limit(size)
            .sort({ 'title': order })
            .toArray()
    }

    findSongsByTitle = (title, pageable = { page: 0, size: 20, order: 'asc' }) => {
        return this.findSongs({
            text: title,
            selector: 'title',
            pageable
        })
    }

    findSongsByPhrase = (phrase, pageable = { page: 0, size: 20, order: 'asc' }) => {
        return this.findSongs({
            text: phrase,
            selector: 'verses.quotes.phrase',
            pageable
        })
    }

    findSongById = (id) => {
        return this.collection.findOne({
            _id: new ObjectId(id),
        })
    }

    getAllSongs = (pageable = { page: 0, size: 20, order: 'asc' }) => {
        const page = pageable.page && parseInt(pageable.page) || 0
        const size = pageable.size && parseInt(pageable.size) || 20
        const skip = page * size
        const order = pageable.order === 'asc' ? 1 : pageable.order === 'desc' ? -1 : 1
        return this.collection
            .find(
                null,
                {
                    _id: 1,
                    title: 1,
                },
            )
            .skip(skip)
            .limit(size)
            .sort({ title: order })
            .toArray()
    }

    getRandomSong = async () => {
        const songs = await this.collection
            .aggregate([
                { $sample: { size: 1 } }
            ])
            .toArray()
        return songs && songs[0]
    }

    findQuotesFromSongByPhrase = (songId, phrase) => {
        const query = phrase && phrase.trim()
        return !query ? [] : this.collection
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
            .toArray()
    }

    getRandomQuoteFromSong = async (songId) => {
        const quotes = await this.collection
            .aggregate([
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
            .toArray()
        return quotes && quotes[0]
    }

    getRandomVerseFromSong = async (songId) => {
        const verses = await this.collection
            .aggregate([
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
            .toArray()
        return verses && verses[0]
    }

}

module.exports = SongRepository
