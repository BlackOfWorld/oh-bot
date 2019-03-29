const child_process = require("child_process");
const Discord = require('discord.js');

exports.run = async(client, message, args) => {
    const command = args.join(" ");
    let m = await message.channel.send(`Running \`${command}\`...`).catch(console.error);
    let stdOut = await doExec(command).catch(data=> outputErr(m, data));
    std = stdOut.substring(0, 1750);
         m.edit(`\`OUTPUT\`
\`\`\`sh
${await clean(client,std)}
\`\`\``);
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 4
};

exports.help = {
    name: 'exec',
    description: 'Executes a console command.',
    usage: 'exec [command]'
};

const clean = async(client,text) => {
    text = await text;
    if (typeof text !== 'string')
        text = require('util').inspect(text, {
            depth: 0
        });
        text = text.replace(/`/g, "`" + String.fromCharCode(8203))
        .replace(/@/g, "@" + String.fromCharCode(8203))
        .replace(client.token, "Wow wow wow, hold on. No API keys to show!")
    return text;
};
const outputErr = (msg, stdData) => {
    let {
        stdout,
        stderr
    } = stdData;
    stderr = stderr ? ["`STDERR`", "```sh", clean(msg.client,stderr.substring(0, 800)) || " ", "```"] : [];
    stdout = stdout ? ["`STDOUT`", "```sh", clean(msg.client,stdout.substring(0, stderr ? stderr.length : 2046 - 40)) || " ", "```"] : [];
    let message = stdout.concat(stderr).join("\n").substring(0, 2000);
    msg.edit(message);
};

const doExec = (cmd, opts = {}) => {
    return new Promise((resolve, reject) => {
        child_process.exec(cmd, opts, (err, stdout, stderr) => {
            if (err) return reject({
                stdout,
                stderr
            });
            resolve(stdout);
        });
    });
};