const fs = require('fs');
exports.run = function(client, message, args) {
message.channel.send('k boss').then(msg => {
            process.exit(1)
        });
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["stfu"],
  permLevel: 4
};

exports.help = {
  name: 'shutdown',
  description: 'Shutdowns the bot.',
  usage: 'shutdown'
};
