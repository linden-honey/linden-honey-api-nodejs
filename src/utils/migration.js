const fetch = require('node-fetch')
const Song = require('../models/song')

exports.initData = url => {
    console.log('Data migration started...')
    fetch(url)
      .then(res => res.json())
      .then(json => Song.insertMany(json))
      .then(() => console.log('Data migration succesfully finished!'))
      .catch(err => console.error('Data migration error:\n', err))
}
