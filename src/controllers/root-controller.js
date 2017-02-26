exports.getRootPageHandler = (text) => {
    return (ctx, next) => {
        ctx.body = text
        return next()
    }
}
