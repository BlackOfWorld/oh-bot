exports.run = function (client, message, args) {
    var ohCount = parseInt(args[1])
    if (ohCount === NaN)
    {
        message.channel.send("Could not parse the amount parameter.")
        return
    }
    for (var i = 0; i < client.starboardArray.length; i++) {
        if (client.starboardArray[i].userID === args[0]) {
            client.starboardArray[i].oh = ohCount;
            client.updateStarboard();
            message.channel.send("User found! Setting it's oh count to " + args[1]);
            return;
        }
    }
    message.channel.send("User not found! Creating profile and setting oh count.")
    client.starboardArray.push({
        userID: args[0],
        oh: ohCount
    });
    client.updateStarboard();
};
exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: 3
};

exports.help = {
    name: 'setscore',
    description: 'Sets a user\'s score',
    usage: 'setscore <id> <amount>'
};