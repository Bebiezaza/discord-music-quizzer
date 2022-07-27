const finish = require("./finish");
const printStatus = require("./printStatus");
const startPlaying = require("./startPlaying");

module.exports = function (message, response, status) {
    const quiz = message.guild.quiz;

    /* these are now handled by quiz.voiceStream.on("stateChange") */
    // if (quiz.songTimeout) clearTimeout(quiz.songTimeout);
    printStatus(message, response, status);
    
    // if (quiz.currentSong + 1 === quiz.songs.length) {
    //     finish(message);
    //     return;
    // }

    // quiz.currentSong++;
    // quiz.skippers = [];
    // if (quiz.musicStream) quiz.musicStream = null;
    if (quiz.voiceStream) quiz.voiceStream.stop();
    // startPlaying(message);
}