const { MongoClient, ObjectId } = require('mongodb')

const connect = async (uri) => {
    const client = new MongoClient(uri, {
        useUnifiedTopology: true,
    })

    try {
        await client.connect()
    } catch (e) {
        console.error(`Couldn't establish connection to ${uri}`, e)
    }

    try {
        await client.db()
            .collection('song')
            .createIndex(
                {
                    title: 'text',
                },
                {
                    default_language: 'russian',
                    weights: {
                        title: 1,
                    },
                },
            )
    } catch (e) {
        console.error('Failed to create index', e)
    }

    return client
}

const convertSortOrder = (order) => order === 'asc' ? 1 : order === 'desc' ? -1 : 1

module.exports = {
    connect,
    convertSortOrder,
    ObjectId,
}
