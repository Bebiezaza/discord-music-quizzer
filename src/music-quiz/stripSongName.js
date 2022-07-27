/**
 * Will remove all excess from the song names
 * Examples:
 * death bed (coffee for your head) (feat. beabadoobee) -> death bed
 * Dragostea Din Tei - DJ Ross Radio Remix -> Dragostea Din Tei
 *
 * @param name string
 */

module.exports = (name) => {
    return name
        .replace(/ \(.*\)/g, '')
        .replace(/ - .*$/, '');
}