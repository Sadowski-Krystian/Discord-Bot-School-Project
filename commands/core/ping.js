const ms = require('ms');

module.exports = {
    name: 'ping',
    aliases: [],
    utilisation: '{prefix}ping',
    usage: '*This show my response time.*',//shows
    requiredPermission: false,
    minArgs: 0,

    execute: async (client, message) => {
        message.channel.send(`*My last heartbeat registered ${client.ws.ping}ms ago*`);
    },
};