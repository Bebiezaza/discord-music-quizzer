const { userMention } = require("discord.js");
const start = require("./music-quiz/start");
const cancelledCommand = require("./util/cancelledCommand");

module.exports = {
    name: 'music-quiz',
    description: 'Music Quiz from Spotify playlists',
    throttling: {usages: 1, duration: 10},
    args: [
        {
            key: 'playlist',
            prompt: 'Which playlist to play songs from',
            type: 'string',
        },
        {
            key: 'songs',
            prompt: 'How many songs the quiz will contain',
            type: 'string',
            default: 10
        },
        {
            key: 'only',
            prompt: 'Only this answer is required; artist, title or both',
            type: 'string',
            oneOf: ['artist', 'title', 'both'],
            default: 'both'
        }
    ],

    callback: async function (client, message) {        
        if (message.guild.quiz) {
            console.log(message.guild.quiz);
            message.channel.send('there are already infos');
            // return message.channel.send('Quiz is already running');
        }
    
        if (message.member.voice.channel === null) {
            return message.channel.send('Please join a voice channel and try again');
        }
        
        const args = message.content.split(/[ ]+/);
        let playlist = args[1] || null;
        let songs = parseInt(args[2]) || 10;
        let only = args[3]?.toLowerCase() || "both";

        if (!playlist) {
            message.channel.send(userMention(message.author.id) + ", Which playlist to play songs from\nRespond with `cancel` to cancel the command. The command will automatically be cancelled in 30 seconds.")
            
            const filter = (response) => { return response.author.id === message.author.id }
            await message.channel.awaitMessages({ filter, max: 1, time: 30 * 1000, errors: ['time'] }).then(function(collected) {
                if (collected.first().content.toLowerCase() === 'cancel') return cancelledCommand(message);
                return playlist = collected.first().content;
            }).catch(function(err) {
                return cancelledCommand(message);
            });

            if (!playlist) return; // just return, PLEASE
        }
        
        if (['artist', 'title', 'both'].indexOf(only) === -1) {            
            const waitMessage = async function (message) {
                message.channel.send(userMention(message.author.id) + ", Please enter one of the following options: `artist`, `title`, `both`\nRespond with `cancel` to cancel the command. The command will automatically be cancelled in 30 seconds.");

                const filter = (response) => { return response.author.id === message.author.id }
                return await message.channel.awaitMessages({ filter, max: 1, time: 30 * 1000, errors: ['time'] }).then(function(collected) {
                    if (collected.first().content.toLowerCase() === 'cancel') return cancelledCommand(message);
                    else if (['artist', 'title', 'both'].indexOf(collected.first().content.toLowerCase()) === -1) {
                        waitMessage(message);
                    }
                    return collected.first().content.toLowerCase();
                }).catch(function(err) {
                    return cancelledCommand(message);
                });
            }

            only = await waitMessage(message);

            if (['artist', 'title', 'both'].indexOf(only) === -1) return; // just return, PLEASE
        }
    
        message.guild.quiz = {
            guild: message.guild,
            textChannel: message.channel,
            voiceChannel: message.member.voice.channel,
            arguments: {
                playlist,
                songs,
                only
            },
            connection: null,
            voiceStream: null, // player
            musicStream: null, // resource
            currentSong: 0,
            songTimeout: null,
            skippers: [],
            scores: {},
            messageCollector: null,
            titleGuessed: false,
            reactPermissionNotified: false
        }
    
        try {
            await start(message);
            // message.guild.quiz.start();
        } catch (e) {
            console.log(e);
            console.log("Process ded");
        }
    }
}