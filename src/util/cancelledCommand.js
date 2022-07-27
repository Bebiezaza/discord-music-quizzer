const { userMention } = require("discord.js");

module.exports = function (message) {
    return message.channel.send(userMention(message.author.id) + ", Cancelled command.");
}