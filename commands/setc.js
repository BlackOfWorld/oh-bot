exports.run = (client, message, args) => {
	if(args.length < 2) return message.channel.send("Not enough parameters were given!");;
	client.settings.ohChannel = args[0];
	client.settings.cmdChannel = args[1];
	message.channel.send("Channels set!");
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 4
};

exports.help = {
  name: 'setc',
  description: 'Set\'s oh channel and cmd channel',
  usage: 'setc <oh> <cmd>'
};
