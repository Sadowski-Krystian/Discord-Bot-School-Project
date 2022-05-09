const { Client, Intents } = require('discord.js');
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
global.guildPrefixes = {}
global.guildWishChannels = {}
client.config = require('./config');
global.mongo = require('./src/mongo.js')
client.fun = require("./src/functions.js")
require('./src/loader');
const loadPrefixes = require('./events/ready.js')
loadPrefixes.loadPrefixes(client)
client.plans = require('./src/getPlans.js')

const tmp = require('./src/getJSON.js')
// tmp.myJSON()
// client.plans.myPlans(client)

client.login(client.config.app.token);