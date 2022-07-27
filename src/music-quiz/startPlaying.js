const { createAudioResource, createAudioPlayer, NoSubscriberBehavior } = require("@discordjs/voice");
const playdl = require("play-dl");
const findSong = require("./findSong");
const finish = require("./finish");
const nextSong = require("./nextSong");

module.exports = async function(message) {
    const quiz = message.guild.quiz;
    if (quiz.arguments.only.toLowerCase() === 'artist') {
        quiz.titleGuessed = true;
    } else if (quiz.arguments.only.toLowerCase() === 'title') {
        quiz.artistGuessed = true;
    }

    const song = quiz.songs[quiz.currentSong];
    const link = await findSong(message, song);

    if (!link) {
        nextSong(message, message, 'Could not find the song on Youtube. Skipping to next.');

        return;
    }

    try {
        const stream = await playdl.stream(link, { filter: 'audioonly', highWaterMark: 1 << 23, type: 'opus', dlChunkSize: 0 });
        quiz.musicStream = createAudioResource(stream.stream, { inputType: stream.type, inlineVolume: true });
    } catch (e) {
        console.error(e);

        nextSong(message, message, 'Could not stream the song from Youtube. Skipping to next.');

        return;
    }

    quiz.songTimeout = setTimeout(() => {
        nextSong(message, message, 'Song was not guessed in time');
    }, 1000 * 60);

    try {
        quiz.voiceStream = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Pause,
            },
        });
    
        quiz.connection.subscribe(quiz.voiceStream);
        quiz.voiceStream.play(quiz.musicStream);

        quiz.voiceStream.on('error', () => {
            message.channel.send('Connection got interrupted. Please try again');

            finish(message);
        })
        quiz.voiceStream.on('finish', () => finish(message));
        quiz.voiceStream;
    } catch (e) {
        console.error(e);

        message.channel.send('Connection got interrupted. Please try again');

        finish(message);
    }
}