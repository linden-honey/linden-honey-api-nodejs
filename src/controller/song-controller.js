const Song = require('../model/song')

exports.findAll = function * () {
    this.body = yield Song.find({})
}
