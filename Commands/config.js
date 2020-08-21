const Discord = require("discord.js");
const config = require("../config.json")
var temp = require('../temp.js');
var fs = require("fs")
var logsChannelGet = require("../Temps/logsChannel.json")
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
 
const adapter = new FileSync('./Temps/denied.json')
const db = low(adapter)
 
// Set some defaults
db.defaults({ staff: []}).write()

module.exports.run = async (client, message, args) => {
    db.read();
    if(message.author.id != config.owner && !db.get("staff").find({id : message.author.id}).value()) return;


    if(message.content == config.prefix + "config"){

        let logsChannelVAR;
        let embedVAR;
        let listMode;
        let pubMode;
        let paused;

        if(temp.logsChannel == ""){
            logsChannelVAR = "No value"
        } else {
            logsChannelVAR = temp.logsChannel
        }

        if(temp.pause){
            paused = "True"
        } else {
            paused = "False"
        }

        if(temp.listMode == undefined){
            listMode = "No value"
        } else {
            listMode = temp.listMode;
        }

        if(temp.seletedEmbed == undefined){
            embedVAR = "No value"
        } else {
            embedVAR = "Okay"
        }

        if(temp.pubMode == undefined){
            pubMode = "No value"
        } else {
            pubMode = temp.pubMode;
        }

        message.channel.send(new Discord.MessageEmbed()
        .setTitle("Config")
        .addField("logsChannel", `<#${logsChannelVAR}>`)
        .addField("selectedEmbed", embedVAR)
        .addField("listMode", listMode)
        .addField("pubMode", pubMode)
        .addField("paused", paused)
        .setColor(config.embedColor))

        return;

    }
    if(args[0] == "logsChannel"){
        if(!args[1]) return message.channel.send(new Discord.MessageEmbed()
        .setTitle("logsChannel")
        .setDescription(`Missing Argument! Example: ${config.prefix}config logsChannel #channel`)
        .setColor(config.embedColor))

        let channel = message.mentions.channels.first();

        if(!channel) return message.channel.send(new Discord.MessageEmbed()
        .setTitle("logsChannel")
        .setDescription(`Missing Argument! Example: ${config.prefix}config logsChannel #channel`)
        .setColor(config.embedColor))

        temp.logsChannel = channel.id;
        logsChannelGet.logsChannel = channel.id;

        let t = JSON.stringify(logsChannelGet)
        t.replace(logsChannelGet.logsChannel, channel.id)

        fs.writeFile("./Temps/logsChannel.json", t, (err) => {
            if(err) throw err;
        })
        

    message.channel.send(new Discord.MessageEmbed()
        .setTitle("logsChannel")
        .setDescription(`new Value: <#${temp.logsChannel}>`)
        .setColor(config.embedColor))


    }

    if(args[0] == "listMode"){
        if(!args[1]) return message.channel.send(new Discord.MessageEmbed()
        .setTitle("listMode")
        .setDescription(`Missing Argument! Example: ${config.prefix}config listMode [text/embed]`)
        .setColor(config.embedColor))


        if(args[1] != "text" && args[1] != "embed") return message.channel.send(new Discord.MessageEmbed()
        .setTitle("listMode")
        .setDescription(`Missing Argument! Example: ${config.prefix}config listMode [text/embed]`)
        .setColor(config.embedColor))
        
        let mode = args[1];

        temp.listMode = mode;


    message.channel.send(new Discord.MessageEmbed()
        .setTitle("listMode")
        .setDescription(`new Value: <${temp.listMode}>`)
        .setColor(config.embedColor))


    }

    if(args[0] == "pubMode"){
        if(!args[1]) return message.channel.send(new Discord.MessageEmbed()
        .setTitle("pubMode")
        .setDescription(`Missing Argument! Example: ${config.prefix}config pubMode [online/all]`)
        .setColor(config.embedColor))


        if(args[1] != "online" && args[1] != "all") return message.channel.send(new Discord.MessageEmbed()
        .setTitle("pubMode")
        .setDescription(`Missing Argument! Example: ${config.prefix}config pubMode [online/all]`)
        .setColor(config.embedColor))
        
        let mode = args[1];

        temp.pubMode = mode;


    message.channel.send(new Discord.MessageEmbed()
        .setTitle("pubMode")
        .setDescription(`new Value: <${temp.pubMode}>`)
        .setColor(config.embedColor))


    }
}

module.exports.help = {
    name: "config"
}