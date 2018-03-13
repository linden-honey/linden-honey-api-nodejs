
const extractId = scraper => {
    const name = scraper.constructor.name
    return name.slice(0, name.lastIndexOf('Scraper') || void 0).toLowerCase()
}

exports.getSongs = (scrapers = []) => async (ctx, next) => {
    const scraper = scrapers.find(s => extractId(s) === ctx.params.scraperId)
    if (!scraper) {
        ctx.throw(404, 'Scraper not found')
    }
    try {
        const songs = await scraper.fetchSongs()
        ctx.body = songs
    } catch (e) {
        console.log('Couldn\'t fetch songs due to error: ', e.message)
        ctx.throw(500, 'Scraping failed with error - try again later')
    }
    return next()
}
