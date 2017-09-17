exports.getRootPageHandler = text => async (ctx, next) => {
    ctx.body = text || 'Welcome'
    return next()
}
