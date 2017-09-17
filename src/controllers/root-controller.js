exports.getRootPageHandler = text => (ctx, next) => {
    ctx.body = text || 'Welcome' 
    return next()
}
