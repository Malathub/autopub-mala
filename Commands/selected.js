const Discord = require("discord.js");
const config = require("../config.json")
const fs = require("fs");
var colors = require('colors');
var selected = require('../temp.js');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
 
const adapter = new FileSync('./Temps/denied.json')
const db = low(adapter)
 
// Set some defaults
db.defaults({ staff: []}).write()


module.exports.run = async (client, message, args) => {
  db.read();
  if(message.author.id != config.owner && !db.get("staff").find({id : message.author.id}).value()) return;
  
  
  if(!selected.seletedEmbed) return message.channel.send({
    "embed": {
      "title": "Error",
      "description": "No embed selected",
      "color": 2895667,
      "image": {
        "url": "https://bhawanigarg.com/wp-content/uploads/2014/05/error-code-18.jpeg"
      }
    }
    })
    
        message.channel.send(selected.seletedEmbed).catch(err => {
            message.channel.send({
                "embed": {
                  "title": "Error",
                  "description": "No embed selected",
                  "color": 2895667,
                  "image": {
                    "url": "https://bhawanigarg.com/wp-content/uploads/2014/05/error-code-18.jpeg"
                  }
                }
                })
        })
    
    

}

module.exports.help = {
    name: "selected"
}