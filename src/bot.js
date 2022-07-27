require('dotenv').config();
const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const commands = require('./commands');

const client = new Client({ intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.MessageContent, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.GuildMembers, 
    GatewayIntentBits.GuildMessageReactions, 
    GatewayIntentBits.GuildVoiceStates
] });
const prefix = process.env.PREFIX;

client.once("ready", () => {
    client.user.setActivity('Ready to quiz');
    console.log("Ready!");
});
client.on("error", (e) => console.error('Discord error', e));
client.on("warn", (e) => console.warn('Discord warn', e));
client.on("disconnect", (e) => console.info('Discord disconnect event', e));

client.on("messageCreate", (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    
    const searcher = message.content.toLowerCase();

    if (searcher.startsWith(`${prefix}music-quiz`)) {
        commands.callback(client, message);
    } else if (searcher === `${prefix}dump` && message.author.id == "420466984552235012") {
        console.log(message.guild.quiz);
    }
});

client.login(process.env.DISCORD_TOKEN);