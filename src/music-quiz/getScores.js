module.exports = function (message, response) {
    const quiz = message.guild.quiz;
    const memberArray = [];

    for (let x of response.member.voice.channel.members.filter(member => !member.user.bot)) {
        memberArray.push([ x[0], quiz.scores[x[0]] ]);
    }

    return memberArray.sort((first, second) => (first[1] || 0) < (second[1] || 0) ? 1 : -1)
        .map((member, index) => {
            let position = `**${index + 1}.** `
            if (index === 0) {
                position = ':first_place:'
            } else if (index === 1) {
                position = ':second_place:'
            } else if (index === 2) {
                position = ':third_place:'
            }

            return `${position} <@${member[0]}> ${member[1] || 0} points`
        })
        .join('\n');
}