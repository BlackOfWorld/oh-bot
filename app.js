const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');
const util = require('util');
const client = new Discord.Client();
const ownerID = "419568355771416577";
var lastMsg = null;
client.starboardArray = {};
console.log = function () {
    process.stdout.write(util.format.apply(null, arguments) + '\n');
};
client.on('guildCreate', (guild) => {
    console.log(`New guild! Name: ${guild.name} | ID: ${guild.id}`)
    setTimeout(() => {
        if (guild.name === "214663714316615680") return;
        //guild.leave().catch(console.error);
    }, 1000);
});
client.on('ready', () => {
    console.log('I AM READY!');
    console.log('Invite link: https://discordapp.com/oauth2/authorize?scope=bot&permissions=2146958847&client_id=' + client.user.id);
    console.log("Serving " + client.guilds.array().length + " server(s):");
    client.guilds.array().forEach(guild => {
        console.log(guild + "(" + guild.id + ")");
        /*if(guild.id !== "214663714316615680" && guild.id !== "337649356654116864")
        	guild.leave().catch(console.error);*/
    });
    client.starboardArray = require('./starboard.json');
    var temp = client.channels.find(val => val.id == client.settings.ohChannel); // get our ohChannel
    if (temp != null) {
        temp.fetchMessages({
            limit: 1
        }).then(messages => lastMsg = messages.first().author.id).catch(console.error); // lastMessageID won't work here
    }
    setInterval(client.updateStarboard, 120000);
});
async function messageHandler(msg) {
    if (msg.author.bot) return;
    if (!msg.content.startsWith(client.settings.prefix)) return;
    let perms = client.elevation(msg);
    let command = msg.content.split(' ')[0].slice(client.settings.prefix.length);
    let args = msg.content.split(' ').slice(1);
    args = args.filter(function (e) {
        return e != ""
    });
    var cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
    if (cmd) {
        if (msg.guild === null && cmd.conf.guildOnly) return msg.reply('This command can be used only in guilds.');
        if (perms < cmd.conf.permLevel) {
            return msg.reply('You don\'t have permissions to execute this command!');
        }
        cmd.run(client, msg, args, perms);
    }
}

function updateOh(id) {
    for (var i = 0; i < client.starboardArray.length; i++) {
        if (client.starboardArray[i].userID === id) {
            client.starboardArray[i].oh = client.starboardArray[i].oh + 1;
            return;
        }
    }
    client.starboardArray.push({
        userID: id.toString(),
        oh: 1
    });
}
client.updateStarboard = function () {
    client.starboardArray.sort((a, b) => a.oh < b.oh);
    json = JSON.stringify(client.starboardArray);
    fs.writeFile('starboard.json', json, 'utf8', function (err) {
        if (err) throw err;
    });
}
client.on('message', msg => {
    if (msg.channel.id == client.settings.cmdChannel || msg.guild === null)
        messageHandler(msg);
    if (msg.channel.id != client.settings.ohChannel) // only patrol our ohChannel
        return;
    if (msg.content !== "oh" || lastMsg == msg.author.id) { // not oh or the same person oh more then once?
        msg.delete().catch(console.error); // delete
        return;
    }
    lastMsg = msg.author.id; // set the last message variable to prevent multiple ohs
    updateOh(msg.author.id);
});
process.on('uncaughtException', (err) => {
    let errorMsg = err.stack.replace(new RegExp(`${__dirname}\/`, 'g'), './');
    console.error("Uncaught Exception: ", errorMsg);
});
process.on("unhandledRejection", err => {
    console.error("Uncaught Promise Error: ", err);
});
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.settings = {};
client.settings.prefix = '>';
client.settings.ohChannel = "556840290934194186";
client.settings.cmdChannel = "556868092492513300";
client.settings.modRole = "Moderator";
client.settings.adminRole = "Admin"
try {
    fs.readdir('./commands/', function (err, cmdfiles) {
        var jsfiles = [];
        if (err) {
            return console.log("Error while reading events!");
        }
        cmdfiles.filter(function (file) {
            if (path.extname(file) === '.js' && file.indexOf(".js") > -1) return jsfiles.push(file);
        });
        console.log(`Loading a total of ${jsfiles.length} commands.`);
        jsfiles.forEach(f => {
            let props = require(`./commands/${f}`);
            console.log(`Loading command: ${props.help.name}`);
            client.commands.set(props.help.name, props);
            props.conf.aliases.forEach(alias => {
                client.aliases.set(alias, props.help.name);
            });
        });
    });
    fs.readdir('./events/', function (err, eventfiles) {
        var jsfiles = [];
        if (err) {
            return console.log("Error while reading events!");
        }
        eventfiles.filter(function (file) {
            if (path.extname(file) === '.js' && file.indexOf(".js") > -1) return jsfiles.push(file);
        });
        console.log(`Loading a total of ${eventfiles.length} events.`);
        eventfiles.forEach(file => {
            const eventName = file.split(".")[0];
            const event = require(`./events/${file}`);
            client.on(eventName, event.bind(null, client));
            console.log(`Loading event: ${eventName}`);
            delete require.cache[require.resolve(`./events/${file}`)];
        });
    });
} catch (e) {
    console.console.log(`File reading error: ${e}`)
}
client.reload = command => {
    return new Promise((resolve, reject) => {
        try {
            console.log('Reloading: ' + command);
            delete require.cache[require.resolve(`./commands/${command}`)];
            let cmd = require(`./commands/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
}; // `` ALT GR + 7
client.elevation = message => {
    let permlvl = 0;
    if (message.guild !== null) {
        let mod_role = message.guild.roles.find(val => val.username === client.settings.modRole);
        if (mod_role && message.member.roles.has(mod_role.id)) permlvl = 2;
        let admin_role = message.guild.roles.find(val => val.username === client.settings.adminRole);
        if (admin_role && message.member.roles.has(admin_role.id)) permlvl = 3;
    }
    if (message.author.id === ownerID) permlvl = 4;
    return permlvl;
};
client.login("NTU2ODM5NTY4MzE4NjYwNxE4.D9_lOW.gxEUsio_uORHCLHK8fbZxhyH_qh");