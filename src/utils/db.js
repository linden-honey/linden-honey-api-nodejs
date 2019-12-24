const { connect, ObjectId } = require('mongodb')

exports.ObjectId = ObjectId
exports.isValidId = ObjectId.isValid

exports.connect = async (uri) => {
    const client = await connect(uri, {
        useUnifiedTopology: true,
    })
    
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

    // client.addListener('connected', (arg) => {
    //     console.log('Connected to ', arg)
    // })

    // client.addListener('disconnected', () => {
    //     console.log('Database - disconnected')
    // })

    return client
}
