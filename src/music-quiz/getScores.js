module.exports = function (message, response) {
    const quiz = message.guild.quiz;
    const memberArray = [];

    for (let x of response.member.voice.channel.members.filter(member => !member.user.bot)) {
        memberArray.push(x);
    }

    return memberArray.sort((first, second) => (quiz.scores[first.id] || 0) < (quiz.scores[second.id] || 0) ? 1 : -1)
        .map((member, index) => {
            let position = `**${index + 1}.** `
            if (index === 0) {
                position = ':first_place:'
            } else if (index === 1) {
                position = ':second_place:'
            } else if (index === 2) {
                position = ':third_place:'
            }

            return `${position} <@${member[0]}> ${quiz.scores[member[0]] || 0} points`
        })
        .join('\n');
}