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
    message.channel.send(eHelp)
}

module.exports.help = {
    name: "help"
}