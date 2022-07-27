module.exports = (only) => {
    if (only === 'artist') {
        return 'Guess the artist of the song by typing in chat. When guessed corretly you are awarded **3 points**.';
    }

    if (only === 'title') {
        return 'Guess the title of the song by typing in chat. When guessed corretly you are awarded **2 points**.';
    }

    return `
        Guess the song and artist by typing in chat. Points are awarded as follows:
        > Artist - **3 points**
        > Title - **2 points**
        > Artist + title - **5 points**
    `.replace(/  +/g, '');
}