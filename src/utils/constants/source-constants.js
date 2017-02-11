const BASE_URL = 'http://www.gr-oborona.ru'
const TEXTS_RESOURCE_URL = `${BASE_URL}/texts`
const SONG_PRINT_URL = songId => {
    return `${BASE_URL}/text_print.php?area=go_texts&id=${songId}`
}

module.exports = Object.freeze({
    BASE_URL,
    TEXTS_RESOURCE_URL,
    SONG_PRINT_URL
})
