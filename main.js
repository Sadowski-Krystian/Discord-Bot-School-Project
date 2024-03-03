const { Client, Intents, Collection, GatewayIntentBits } = require('discord.js');
require("dotenv").config()
global.client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent
    ],
    disableMentions: 'everyone',
});
client.commands = new Collection();
global.conservation = false
global.guildPrefixes = {}
global.guildWishChannels = {}
client.helpChoise= []
client.slashCommands = []
client.cooldowns = {}
client.nauczyciele = []
client.config = require('./config');
global.mongo = require('./src/mongo.js')
client.fun = require("./src/functions.js")
client.loader = require('./src/loader.js');
require('./src/cronJobs.js')
client.loader.loader();
client.loader.loadevents();
const loadPrefixes = require('./events/ready.js');
const { loader } = require('./src/loader.js');
loadPrefixes.loadPrefixes(client)
// client.fun.myConservation()
client.login(client.config.app.token);