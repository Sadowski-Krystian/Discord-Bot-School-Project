const { Client, Intents, Collection } = require('discord.js');
require("dotenv").config()
global.client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES
    ],
    disableMentions: 'everyone',
});
client.commands = new Collection();
global.conservation = false
global.guildPrefixes = {}
global.guildWishChannels = {}
client.config = require('./config');
global.mongo = require('./src/mongo.js')
client.fun = require("./src/functions.js")
require('./src/loader.js');
const loadPrefixes = require('./events/ready.js')
loadPrefixes.loadPrefixes(client)
// client.fun.myConservation()
client.login(client.config.app.token);