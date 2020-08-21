
const Discord = require("discord.js");
const config = require("../config.json")

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
 
const adapter = new FileSync('./Temps/denied.json')
const db = low(adapter)
 
// Set some defaults
db.defaults({ staff: []}).write()
var fs = require("fs");

module.exports.run = async (client, message, args) => {
    db.read();
    if(message.author.id != config.owner && !db.get("staff").find({id : message.author.id}).value()) return;

    if(!args[0]) return message.channel.send(new Discord.MessageEmbed()
    .setTitle("rvstaff")
    .setDescription(`Missing Argument! Example: ${config.prefix}rvstaff <id>`)
    .setColor(config.embedColor))

    db.get('staff').remove({ id: args[0] }).write()

  message.channel.send(`ID ${args[0]} is now demoted.`)
  db.read();
}

module.exports.help = {
    name: "rvstaff"
}