const fetch = require('node-fetch')
const Song = require('../models/song')

exports.initData = url => {
    fetch(url)
      .then(res => res.json())
      .then(json => {
          return Song.insertMany(json)
      })
      .catch(err => console.error('Data migration error:\n', err))
}
