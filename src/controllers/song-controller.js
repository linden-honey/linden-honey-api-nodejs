const Song = require('../models/song')

const getRandomElementNumber = elementsCount => Math.floor(Math.random() * elementsCount)

exports.getAllSongs = function * () {
    this.body = yield Song.find({}, '_id title')
}

exports.getRandomSong = function * () {
    const elementsCount = yield Song.count()
    const randomElementNumber = getRandomElementNumber(elementsCount)
    this.body = yield Song.findOne().skip(randomElementNumber)
}

exports.getSong = function * (id) {
    const isValidId = Song.base.Types.ObjectId.isValid(id)
    const song = isValidId ? yield Song.findById(id) : null
    if (song) {
        this.body = song
    } else {
        this.throw('Song not found', 404)
    }
}
