exports.getRootPageHandler = function (text) {
    return function * () {
        this.body = yield Promise.resolve(text)
    }
}
