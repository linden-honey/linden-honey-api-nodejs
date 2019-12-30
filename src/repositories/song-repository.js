const { ObjectId, convertSortOrder } = require('../utils/db')
const { createPageable } = require('../utils/pageable')

class SongRepository {
    constructor({ collection }) {
        this.collection = collection
        this.defaultSort = {
            field: 'title',
            order: 'asc',
        }
    }

    findSongs = ({ text, selector, pageable }) => {
        const query = text && text.trim()
        const {
            limit,
            offset,
            sortBy = this.defaultSort.field,
            sortOrder = this.defaultSort.order,
        } = createPageable(pageable)
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
            .skip(offset)
            .limit(limit)
            .sort({ [sortBy]: convertSortOrder(sortOrder) })
            .toArray()
    }

    findSongsByTitle = (title, pageable) => this.findSongs({
        text: title,
        selector: 'title',
        pageable: createPageable(pageable),
    })

    findSongsByPhrase = (phrase, pageable) => this.findSongs({
        text: phrase,
        selector: 'verses.quotes.phrase',
        pageable: createPageable(pageable),
    })

    findSongById = (id) => this.collection.findOne({
        _id: new ObjectId(id),
    })

    getAllSongs = (pageable) => {
        const {
            limit,
            offset,
            sortBy = this.defaultSort.field,
            sortOrder = this.defaultSort.order,
        } = createPageable(pageable)
        return this.collection
            .find(
                null,
                {
                    _id: 1,
                    title: 1,
                },
            )
            .skip(offset)
            .limit(limit)
            .sort({ [sortBy]: convertSortOrder(sortOrder) })
            .toArray()
    }

    getRandomSong = async () => {
        const songs = await this.collection
            .aggregate([
                { $sample: { size: 1 } },
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
                            $options: 'i',
                        },
                    },
                },
                { $group: { _id: '$verses.quotes.phrase' } },
                {
                    $project: {
                        _id: false,
                        phrase: '$_id',
                    },
                },
            ])
            .toArray()
    }

    getRandomQuoteFromSong = async (songId) => {
        const quotes = await this.collection
            .aggregate([
                {
                    $match: {
                        _id: new ObjectId(songId),
                    },
                },
                { $unwind: '$verses' },
                { $unwind: '$verses.quotes' },
                { $sample: { size: 1 } },
                {
                    $project: {
                        _id: false,
                        phrase: '$verses.quotes.phrase',
                    },
                },
            ])
            .toArray()
        return quotes && quotes[0]
    }

    getRandomVerseFromSong = async (songId) => {
        const verses = await this.collection
            .aggregate([
                {
                    $match: {
                        _id: new ObjectId(songId),
                    },
                },
                { $unwind: '$verses' },
                { $sample: { size: 1 } },
                {
                    $project: {
                        _id: false,
                        quotes: '$verses.quotes',
                    },
                },
            ])
            .toArray()
        return verses && verses[0]
    }
}

module.exports = SongRepository
