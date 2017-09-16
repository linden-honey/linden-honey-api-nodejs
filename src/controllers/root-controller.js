exports.getRootPageHandler = text => (ctx, next) => {
    ctx.body = text
    return next()
}
