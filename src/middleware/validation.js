const createValidator = (extractor, predicate, message) => {
    if (typeof extractor !== 'function') {
        throw new Error('Invalid extractor!')
    }
    if (typeof predicate !== 'function') {
        throw new Error('Invalid predicate!')
    }
    return (req, res, next) => {
        const param = extractor(req)
        if (!predicate(param)) {
            res.status(400).send(message || 'Bad request')
        } else {
            next()
        }
    }
}

module.exports = {
    createValidator,
}
