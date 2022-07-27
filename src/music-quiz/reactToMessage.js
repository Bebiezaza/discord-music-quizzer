module.exports = async function (quiz, message, emoji) {
    try {
        await message.react(emoji);
    } catch (e) {
        if (quiz.reactPermissionNotified) {
            return;
        }

        this.reactPermissionNotified = true;
        message.channel.send(`
            Please give me permission to react to messages.
        `.replace(/  +/g, ''));
    }
}