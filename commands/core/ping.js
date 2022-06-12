const { SlashCommandBuilder } = require('@discordjs/builders');
const ms = require('ms');
module.exports = {
    data: new SlashCommandBuilder().
        setName("ping")
        .setDescription("Pong!"),
    name: 'ping',
    aliases: [],
    showHelp: true,
    utilisation: '`prefix` ping',
    usage: 'Pokazuje czas odpowiedzi bota',//shows
    requiredPermission: false,
    minArgs: 0,

    execute: async (client, message, interaction, args) => {
        let cmd = {
            reply: message || interaction,
            init: ()=>{
                cmd.reply.reply({content: `Pong! ${client.ws.ping}ms`, 
                ephemeral: true,
                allowedMentions: {
                    repliedUser: false
                }})
            }
        }
        cmd.init()
    },
};