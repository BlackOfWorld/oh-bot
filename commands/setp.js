exports.run = (client, message, args) => {
	if(args.length < 2) return message.channel.send("Not enough parameters were given!");;
	client.settings.modRole = args[0];
	client.settings.adminRole = args[1];
	message.channel.send("Channels set!");
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 4
};

exports.help = {
  name: 'setp',
  description: 'Set\'s mod and admin role names',
  usage: 'setp <mod> <admin>'
};
