module.exports = async function(message) {
    const quiz = message.guild.quiz;

    if (quiz.songTimeout) clearTimeout(quiz.songTimeout);
    if (quiz.messageCollector) quiz.messageCollector.stop();
    if (quiz.voiceStream) quiz.voiceStream.stop();
    if (quiz.musicStream) quiz.musicStream = null;

    quiz.connection.destroy();
    if (message.guild.quiz) message.guild.quiz = null;
}