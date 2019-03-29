function isObjReachable(obj) {
    return obj && obj !== 'null' && obj !== 'undefined';
}
const utils = require("../Utils.js");
exports.run = async function (client, message, args) {
    var text = 'Here\'s the top 10 users in the scoreboard:```markdown\n';
    for (var i = 0; i < 10; i++) {
        if (!isObjReachable(client.starboardArray[i])) continue;
        var entry = client.starboardArray[i];
        var user = await client.fetchUser(entry.userID);
        var userTag = user.tag.replace('`', '\'');
        text += `${i+1}. ${userTag} (${user.id}) - ${entry.oh}\n`;
    }
    text += '```'
    var a = utils.getUserFromMention(text);
    if (a != null)
        for (var i = 0; i < a.length; i++) {
            text = text.replace(a[i], a[i].splice(2, 0, '\u200B'));
        }
    message.channel.send(text, {
        disableEveryone: true
    });
};
exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: 0
};

exports.help = {
    name: 'scoreboard',
    description: 'Show\'s top 10 oh users!',
    usage: 'scoreboard'
};