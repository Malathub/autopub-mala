
var colors = require("colors")
console.log("Succesfuly logged".green.bgWhite)
var config = require("./config.json")
const low = require('lowdb')
var fs = require("fs")
const FileSync = require('lowdb/adapters/FileSync')
 
const adapter = new FileSync('./Temps/denied.json')
const db = low(adapter)
 
// Set some defaults
db.defaults({ staff: []}).write()

var colors = require('colors');
const Discord = require("discord.js");
var selected = require('./temp.js');

var prefix = config.prefix;
const client = new Discord.Client({fetchAllMembers: true});
client.commands = new Discord.Collection();

client.login(config.token).catch(err => {console.log(`${err.message}`.black.bgRed); process.exit()})

fs.readdir("./Commands/", (err, files) => {
    if(err) console.log(err)
    console.log(`${files.length} commands loaded`.bgRed.black);
    let jsfiles = files.filter(f => f.split(".").pop() === "js");

    if(jsfiles.length <= 0){
        console.log("Commands not loaded")
        return;
    }

    jsfiles.forEach((f, i) => {
        let props = require(`./Commands/${f}`) 
        client.commands.set(props.help.name, props);
    })
})






client.on("ready", () => {
    console.log(
        `Connected has ${client.user.tag} \n`.bgGreen.black
        +`Client Id: ${client.user.id} \n `.bgGreen.black
        +`Invite: https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=0 \n`.bgGreen.black
        +`Discord Version: ${Discord.version}`.bgGreen.black
    )

    client.user.setActivity(config.stream, {type: "STREAMING", url: "https://twitch.tv/hey"});


})




client.on("message", async message => {

    client.emit('checkMessage', message);
   
    
    let prefix = config.prefix;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let Args = messageArray.slice(1);
    var args = message.content.substring(prefix.length).split(" ");
    let commandFile = client.commands.get(cmd.slice(prefix.length));
    if(commandFile) commandFile.run(client, message, Args, args)


 
})


client.on("guildMemberAdd", async (member) => {
    if(selected.seletedEmbed == null) return client.channels.cache.get(selected.logsChannel).send("Please configure your embed !")
    try{ 
        member.send(selected.seletedEmbed)
        client.channels.cache.get(selected.logsChannel).send("Welcome sent to " + member.user.tag)
    } catch(err) {
        console.log(err.message)
    }
})

client.on("guildCreate", async (guild) => {
    

    client.channels.cache.get(selected.logsChannel).send(`**__Your bot has been added in__ ${guild.name} ( ${guild.memberCount} members ) - ${guild.id} **`)
    if(selected.seletedEmbed == null) return client.channels.cache.get(selected.logsChannel).send("Please configure your embed !")
    
    let memberarray;
    if(selected.pubMode == "all"){
        memberarray = guild.members.cache.array();
    }else if(selected.pubMode == "online"){
        memberarray =  guild.members.cache.filter(m => m.presence.status === 'online' || m.presence.status === 'dnd' || m.presence.status === 'idle').array();
    }

    

    let membercount = memberarray.length;
    let botcount = 0;
    let successcount = 0;
    let errorcount = 0;

    for (var i = 0; i < membercount; i++) {
        let member = memberarray[i];

        if (member.user.bot) {
            botcount++;
            continue
        }


        
        await sleep(120);
        if(i == (membercount-1)) {

        } else {
     
        }
        try {
         member.send(selected.seletedEmbed).catch(err => {errorcount++})
            successcount++;
        } catch (error) {
            errorcount++
        }
    }

    client.channels.cache.get(selected.logsChannel).send(new Discord.MessageEmbed()
    .setTitle("**:white_check_mark: Pub finish**")
    .setDescription(`Sent to **${successcount}** members`)
    .setFooter(`Not sent: ${errorcount + botcount}`))



})

client.on("guildDelete", async (guild) => {
    client.channels.cache.get(selected.logsChannel).send(`*Your bot has been kicked in__ ${guild.name} ( ${guild.memberCount} members ) - ${guild.id}*`)
})

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
