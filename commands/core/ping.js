const ms = require('ms');

module.exports = {
    name: 'ping',
    aliases: [],
    utilisation: '`prefix` ping',
    usage: 'Pokazuje czas odpowiedzi bota',//shows
    requiredPermission: false,
    minArgs: 0,

    execute: async (client, message) => {
        message.channel.send(`Pong! ${client.ws.ping}ms`);
    },
};