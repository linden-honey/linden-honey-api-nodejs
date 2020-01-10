const { ObjectId, convertSortOrder } = require('../utils/db')
const { createPageable } = require('../utils/pageable')

const renameField = (
    oldName,
    newName,
    {
        [oldName]: value,
        ...others
    },
) => ({
    [newName]: value,
    ...others,
})

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
                    projection: {
                        title: 1,
                    },
                    skip: offset,
                    limit,
                    sort: {
                        [sortBy]: convertSortOrder(sortOrder),
                    },
                },
            )
            .map((song) => renameField('_id', 'id', song))
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

    findSongById = async (id) => {
        const song = await this.collection.findOne({
            _id: new ObjectId(id),
        })
        return renameField('_id', 'id', song)
    }

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
                    projection: {
                        title: 1,
                    },
                    skip: offset,
                    limit,
                    sort: {
                        [sortBy]: convertSortOrder(sortOrder),
                    },
                },
            )
            .map((song) => renameField('_id', 'id', song))
            .toArray()
    }

    getRandomSong = async () => {
        const songs = await this.collection
            .aggregate([
                {
                    $sample: {
                        size: 1,
                    },
                },
            ])
            .map((song) => renameField('_id', 'id', song))
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
                {
                    $project: {
                        _id: 0,
                        phrase: '$verses.quotes.phrase',
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
                {
                    $sample: {
                        size: 1,
                    },
                },
                {
                    $project: {
                        _id: 0,
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
                {
                    $sample: {
                        size: 1,
                    },
                },
                {
                    $project: {
                        _id: 0,
                        quotes: '$verses.quotes',
                    },
                },
            ])
            .toArray()
        return verses && verses[0]
    }
}

module.exports = SongRepository
