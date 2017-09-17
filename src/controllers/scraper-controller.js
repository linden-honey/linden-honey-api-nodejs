exports.getSongs = scraper => async (ctx, next) => {
    try {
        const songs = await scraper.fetchSongs()
        ctx.body = songs
    } catch (e) {
        console.log('Couldn\'t fetch songs due to error: ', e.message)
        ctx.throw(500, 'Scraping failed with error - try again later')
    }
    return next()    
}
