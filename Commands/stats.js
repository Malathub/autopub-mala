const Discord = require("discord.js");
const config = require("../config.json")
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
 
const adapter = new FileSync('./Temps/denied.json')
const db = low(adapter)
 
// Set some defaults
db.defaults({ staff: []}).write()

/* EMBED */

var eHelp = new Discord.MessageEmbed()
    .setTitle("Here is all commands")
    .addField(config.prefix + "choose", "Select your embed.")
    .addField(config.prefix + "list", "Show server list")
    .addField(config.prefix + "stats", "Show bot stats")
    .addField(config.prefix + "selected", "Show selected embed")
    .addField(config.prefix + "add <JSON EMBED>", "Add embed to folder")
    .addField(config.prefix + "wlstaff <id>", "Add person who can user the bot")
     .addField(config.prefix + "rvstaff <id>", "Remove person who can user the bot")
    .addField(config.prefix + "config", "Config the bot")
    .setFooter("All changes is temporary (when you restart the bot you need config again)")
    .setColor(config.embedColor)

module.exports.run = async (client, message, args) => {
    db.read();
    if(message.author.id != config.owner && !db.get("staff").find({id : message.author.id}).value()) return;
    const promises = [
        client.shard.fetchClientValues('guilds.cache.size'),
        client.shard.broadcastEval('this.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)'),
    ];
    
    Promise.all(promises)
        .then(results => {
            const totalGuilds = results[0].reduce((prev, guildCount) => prev + guildCount, 0);
            const totalMembers = results[1].reduce((prev, memberCount) => prev + memberCount, 0);
            return message.channel.send(`**Total serveurs**: ${totalGuilds}\n Total membres: ${totalMembers}`);
        })
        .catch(console.error);
}

module.exports.help = {
    name: "stats"
}