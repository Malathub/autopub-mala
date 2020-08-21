const Discord = require("discord.js");
const config = require("../config.json")
const fs = require("fs");
var colors = require('colors');
var temp = require('../temp.js');

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
 
const adapter = new FileSync('./Temps/denied.json')
const db = low(adapter)
 
// Set some defaults
db.defaults({ staff: []}).write()


module.exports.run = async (client, message, args) => {
    db.read();
    if(message.author.id != config.owner && !db.get("staff").find({id : message.author.id}).value()) return;
    

    fs.readdir("./embeds/", async (err, files) => {
        if(err) console.log(err)
        console.log(`${files.length} embeds loaded`.bgRed.black);
        let jsfiles = files.filter(f => f.split(".").pop() === "json");
    
        if(jsfiles.length <= 0){
            console.log("Embeds not loaded")
            return;
        }
      
        let i = -1;
        let embed = {};
        
        jsfiles.forEach((f, i) => {
            let props;
            try
            {
                props = require(`../embeds/${f}`);
                embed[i++] = props;
            } catch(err)
            {
                embed[i] = {
                    "embed": {
                      "title": "Error",
                      "description": err.message,
                      "color": 2895667,
                      "image": {
                        "url": "https://bhawanigarg.com/wp-content/uploads/2014/05/error-code-18.jpeg"
                      }
                    }
                    }
            }
            
            
        })
        
        i = -1;
        let msg = await message.channel.send({
            "embed": {
              "title": "Choose your embed",
              "description": "Click on the reation to change pages.",
              "color": 2895667
            }
          })

          msg.react("⬅️")
          msg.react("➡️")
          msg.react("✅")
          msg.react("❌")
          let collector = msg.createReactionCollector((reaction, user) => user.id === message.author.id);

          collector.on("collect", async(reaction, user) => {
            
            if(reaction.emoji.name === "⬅️") {
                i--;
                reaction.users.remove(user.id);
                msg.edit(embed[i]).catch(err => {
                    msg.edit(new Discord.MessageEmbed()
                    .setTitle("Erreur")
                    .setDescription(` \`\`${err.message} \`\``)
                    .setImage("https://bhawanigarg.com/wp-content/uploads/2014/05/error-code-18.jpeg")
                    .setColor(config.embedColor))
                })

            }

            if(reaction.emoji.name === "➡️") {
                i++;
                reaction.users.remove(user.id);

                    msg.edit(embed[i]).catch(err => {
                        msg.edit(new Discord.MessageEmbed()
                        .setTitle("Erreur")
                        .setDescription(` \`\`${err.message} \`\``)
                        .setImage("https://bhawanigarg.com/wp-content/uploads/2014/05/error-code-18.jpeg")
                        .setColor(config.embedColor))
                    })
                

                }

            if(reaction.emoji.name === "✅") {
                    temp.seletedEmbed = embed[i];
                    message.channel.send("Embed selected.")
                    fs.writeFile("Temps/selected.json", JSON.stringify(embed[i]), (err) => {
                        if(err) throw err;

                    })
                }

            if(reaction.emoji.name === "❌") {
                   reaction.message.delete();
            }
        }); 

    })


    

}

module.exports.help = {
    name: "choose"
}