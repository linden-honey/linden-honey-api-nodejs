const { MongoClient, ObjectId } = require('mongodb')

const connect = async (uri) => {
    const client = new MongoClient(uri, {
        useUnifiedTopology: true,
    })

    try {
        await client.connect()
    } catch (e) {
        console.error(`Couldn't establish connection to ${uri}`, e)
        process.exit(1)
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

const convertSortOrder = (order) => {
    switch (order) {
        case 'asc':
            return 1
        case 'desc':
            return -1
        default:
            return 1
    }
}

module.exports = {
    connect,
    convertSortOrder,
    ObjectId,
}
