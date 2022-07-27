const { createAudioResource, createAudioPlayer, NoSubscriberBehavior, AudioPlayerStatus } = require("@discordjs/voice");
const playdl = require("play-dl");
// const createPlayer = require("./createPlayer");
const findSong = require("./findSong");
const finish = require("./finish");
const nextSong = require("./nextSong");
const printStatus = require("./printStatus");

function createPlayer(message) {
    const quiz = message.guild.quiz;

    quiz.voiceStream = createAudioPlayer({
        behaviors: {
            noSubscriber: NoSubscriberBehavior.Pause,
        },
    });

    quiz.connection.subscribe(quiz.voiceStream);

    /* start of many handlers */
    quiz.voiceStream.on("error", (err) => {
        message.channel.send('Connection got interrupted. Please try again');

        finish(message);
    });
    
    quiz.voiceStream.on("stateChange", (oldState, newState) => {
        if (newState.status === AudioPlayerStatus.Idle && oldState.status !== AudioPlayerStatus.Idle) {
            if (quiz.songTimeout) clearTimeout(quiz.songTimeout);
            if (quiz.currentSong + 1 === quiz.songs.length) {
                finish(message);
                return;
            }

            quiz.currentSong++;
            quiz.skippers = [];
            if (quiz.musicStream) quiz.musicStream = null;

            startPlaying(message);
        }
    });
    /* end of many handlers */
}

async function startPlaying(message) {
    const quiz = message.guild.quiz;
    
    quiz.titleGuessed = false;
    quiz.artistGuessed = false;

    if (quiz.arguments.only.toLowerCase() === 'artist') {
        quiz.titleGuessed = true;
    } else if (quiz.arguments.only.toLowerCase() === 'title') {
        quiz.artistGuessed = true;
    }

    const song = quiz.songs[quiz.currentSong];
    const link = await findSong(message, song);

    if (!link) {
        if (quiz.songTimeout) clearTimeout(quiz.songTimeout);
        printStatus(message, message, 'Could not find the song on Youtube. Skipping to next.');
        quiz.voiceStream.stop();
    }

    try {
        const stream = await playdl.stream(link, { filter: 'audioonly', highWaterMark: 1 << 23, type: 'opus', dlChunkSize: 0 });
        quiz.musicStream = createAudioResource(stream.stream, { inputType: stream.type, inlineVolume: true });
    } catch (e) {
        console.error(e);
        
        if (quiz.songTimeout) clearTimeout(quiz.songTimeout);
        printStatus(message, message, 'Could not stream the song from Youtube. Skipping to next.');
        quiz.voiceStream.stop();
    }

    quiz.songTimeout = setTimeout(() => {
        if (quiz.songTimeout) clearTimeout(quiz.songTimeout);
        printStatus(message, message, 'Song was not guessed in time');
        quiz.voiceStream.stop();
    }, 1000 * 60);

    try {
        if (!quiz.voiceStream) createPlayer(message);
        quiz.voiceStream.play(quiz.musicStream);
    } catch (e) {
        console.error(e);

        message.channel.send('Connection got interrupted. Please try again');

        finish(message);
    }
}

module.exports = startPlaying;