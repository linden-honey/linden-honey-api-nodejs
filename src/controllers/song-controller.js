const Song = require('../models/song')

exports.findAll = function * () {
    this.body = yield Song.find()
}
