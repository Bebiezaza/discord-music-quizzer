require('dotenv').config();
const spotifyClient = process.env.SPOTIFY_CLIENT;
const spotifySecret = process.env.SPOTIFY_SECRET;

const SpotifyWebApi = require('spotify-web-api-node');
const stripSongName = require('./stripSongName');
const spotifyApi = new SpotifyWebApi({
    clientId: spotifyClient,
    clientSecret: spotifySecret
});

function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
    
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

module.exports = async function(message) {
    // Retrieve an access token.
    await spotifyApi.clientCredentialsGrant().then(function(token) {
        // Save the access token so that it's used in future calls
        spotifyApi.setAccessToken(token.body['access_token']);
    }, function(err) {
        console.log('Error: Token authorization: ', err);
    });

    // Get a playlist
    const playlistId = message.guild.quiz.arguments.playlist
        .replace(/\<(.{1,})\>/, "$1")
        .replace(/.{1,}open\.spotify\.com\/playlist\//, "");
    let songList = [];
    await spotifyApi.getPlaylist(playlistId).then(function(data) {
        for (let item of data.body.tracks.items) {
            songList.push({
                title: stripSongName(item.track.name),
                artist: item.track.artists[0].name,
                link: item.track.external_urls.spotify
            });
        }
        
    }, function(err) {
        message.channel.send('Could not retrieve the playlist. Make sure it\'s public');

        return null;
    });
    
    songList = shuffle(songList).filter((song, index) => index < message.guild.quiz.arguments.songs);

    return songList;
}