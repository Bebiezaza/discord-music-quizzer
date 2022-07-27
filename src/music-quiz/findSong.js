const ytsr = require("ytsr");
const finish = require("./finish");

module.exports = async function(message, song) {
    try {
        const filters = await ytsr.getFilters(`${song.title} - ${song.artist}`);
        const filter = filters.get('Type').get('Video');
        const result = await ytsr(filter.url, {limit: 1});
    
        return result?.items[0].url ?? null;
        return null;
    } catch (err) {
        await message.channel.send('Oh no... Youtube police busted the party :(\nPlease try again later.');
        finish(message);

        throw err;
    }
}