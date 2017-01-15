export const BASE_URL = 'http://www.gr-oborona.ru'
export const TEXTS_RESOURCE_URL = `${BASE_URL}/texts`
export const SONG_PRINT_URL = songId => {
    return `${BASE_URL}/text_print.php?area=go_texts&id=${songId}`
}
