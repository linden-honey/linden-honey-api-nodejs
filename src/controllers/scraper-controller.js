exports.getSongs = scraper => async (ctx, next) => {
    try {
        const songs = await scraper.fetchSongs()
        ctx.body = songs
    } catch (e) {
        console.log('Couldn\'t fetch songs due to error: ', e)
        ctx.throw('Scraping failed with error - try again later', 500)
    }
    return next()    
}
