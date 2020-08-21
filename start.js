const Discord = require('discord.js');
const shard = new Discord.ShardingManager('./mala.js');
shard.spawn(1);