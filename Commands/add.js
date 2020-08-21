const Discord = require("discord.js");
const config = require("../config.json")

var fs = require("fs");
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
 
const adapter = new FileSync('./Temps/denied.json')
const db = low(adapter)
 
// Set some defaults
db.defaults({ staff: []}).write()

module.exports.run = async (client, message, args) => {
    db.read();
    if(message.author.id != config.owner && !db.get("staff").find({id : message.author.id}).value()) return;

  let content = message.content.substring(5);

  try {
      JSON.parse(content)
  } catch(err) {
      message.channel.send(new Discord.MessageEmbed()
      .setTitle("Erreur")
      .setDescription(` \`\`${err.message} \`\``)
      .setImage("https://bhawanigarg.com/wp-content/uploads/2014/05/error-code-18.jpeg")
      .setColor(config.embedColor))
      return;
  }

  fs.writeFile(`./embeds/embed_${Math.floor(Math.random() * 10000)}.json`, content, (err) => {
      if(err) throw err;
  })

  message.channel.send(JSON.parse(content));
  message.channel.send("Embed added");
}

module.exports.help = {
    name: "add"
}