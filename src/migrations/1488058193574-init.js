const fetch = require('node-fetch')
const config = require('../utils/config')
require('../models/mongoose/song')

export async function up() {
    const url = config.get('LH:DB:MIGRATION:URL')
    const response = await fetch(url)
    const collection = await response.json()
    await this('Song').collection.insertMany(collection)
}

export async function down() {
    await this('Song').remove({})
}
