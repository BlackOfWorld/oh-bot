const Discord = require('discord.js');
const {inspect} = require("util");
const rand = async () => {
    return Math.floor(Math.random() * parseInt('8' + '9'.repeat(8 - 1)) + parseInt('1' + '0'.repeat(8 - 1)));
}
exports.run = async (client, message, args) => {
    var endings = ["ns", "μs", "ms", "s"];
    const embed = new Discord.RichEmbed();
    const code = args.join(" ");
    const start = process.hrtime();
    let promise;

    try {
        let done = eval(code);
        const hrDiff = process.hrtime(start);
        let end = (hrDiff[0] > 0 ? (hrDiff[0] * 1000000000) : 0) + hrDiff[1];

        let ending = endings[0],
            i = 0;

        while (endings[++i] && end > 1000) {
            end /= 1000;
            ending = endings[i];
        }
        if (typeof done !== "string") {
            if (done instanceof Promise) promise = done;
            done = inspect(done);
        }
        const embed = new Discord.RichEmbed()
            .setTitle(`**INPUT:** \`${code}\`\n**OUTPUT**`)
            .setDescription(done.length < 2036 ? "```js\n" + done.replace(/`/g, "`​").replace(new RegExp(`${client.token}`, "g"), "NTU2O_8qiVUPg4jr6ReckdAOCRiDD8LCCDlnRJJcddIkoyAjKyNniReKmv2") + "\n```" : "Output too long.\nSaved to console.")
            .setFooter(`Runtime: ${end.toFixed(3)}${ending}`, "https://cdn.discordapp.com/attachments/286943000159059968/298622278097305600/233782775726080012.png")
            .setColor(24120);
        if (promise) {
            const start = process.hrtime();

            let done = await promise;

            let end = (hrDiff[0] > 0 ? (hrDiff[0] * 1000000000) : 0) + hrDiff[1];
            let ending = endings[0],
                i = 0;
            while (endings[++i] && end > 1000) {
                end /= 1000;
                ending = endings[i];
            }
            if (typeof done !== "string") done = inspect(done);
            embed.addField("Promise", (done.length < 900 ? `\`\`\`${done}\`\`\`` : "```\nPromise return too long.\nLogged to console\n```") + `\nResolved in ${end.toFixed(3)}${ending}`);
        }
        await message.author.send({
            embed
        });
        return;
    } catch (err) {
        const hrDiff = process.hrtime(start);
        let end = (hrDiff[0] > 0 ? (hrDiff[0] * 1000000000) : 0) + hrDiff[1];
        console.log(end);
        console.log(endings);
        let ending = endings[0],
            i = 0;

        while (endings[++i] && end > 1000) {
            end /= 1000;
            ending = endings[i];
        }
        console.error(err);
        embed.setDescription(`**INPUT:** \`${code}\`\n**ERROR**<:panicbasket:267397363956580352>\n\`\`\`xl\n${clean(err)}\`\`\`\n`)
            .setFooter(`Runtime: ${end.toFixed(3)}${ending}`, "https://cdn.discordapp.com/attachments/286943000159059968/298622278097305600/233782775726080012.png")
            .setColor(rand());
        return message.author.send({
            embed
        });
    }
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: 4
};

exports.help = {
    name: 'eval',
    usage: 'eval <terms>',
    description: 'The Bot will evaluate anything for the Owner.'
};