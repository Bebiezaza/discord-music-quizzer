const getScores = require("./getScores");

module.exports = async function(message, response, status) {
    const quiz = message.guild.quiz;
    const song = quiz.songs[quiz.currentSong];

    await message.channel.send(`
        **(${quiz.currentSong + 1}/${quiz.songs.length})** ${status}
        > **${song.title}** by **${song.artist}**
        > Link: || ${song.link} ||

        **__SCORES__**
        ${getScores(message, response)}
    `.replace(/  +/g, ''));
}
