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
    .setTitle("wlstaff")
    .setDescription(`Missing Argument! Example: ${config.prefix}wlstaff <id>`)
    .setColor(config.embedColor))

    db.get('staff').push({ id: args[0]}).write()

  message.channel.send(`ID ${args[0]} is now staff.`)

  db.read();
    
}

module.exports.help = {
    name: "wlstaff"
}