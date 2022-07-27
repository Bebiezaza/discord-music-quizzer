const nextSong = require("./nextSong");

module.exports = function (message, response, userID) {
    const quiz = message.guild.quiz;

    if (quiz.skippers.includes(userID)) {
        return;
    }

    quiz.skippers.push(userID);

    const members = response.member.voice.channel.members
            .filter(member => !member.user.bot)
        if (quiz.skippers.length === members.size) {
            nextSong(message, response, 'Song skipped!');

            return;
        }

        message.channel.send(`**(${quiz.skippers.length}/${members.size})** to skip the song`);
}