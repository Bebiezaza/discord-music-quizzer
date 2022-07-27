require('dotenv').config();
const { ShardingManager } = require('discord.js');
const path = require('path');

const manager = new ShardingManager(
    path.resolve(__dirname, 'bot.js'),
    { token: process.env.DISCORD_TOKEN }
);
manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));
manager.spawn();
