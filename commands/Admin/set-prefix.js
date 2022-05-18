const loadPrefixes = require('../../events/ready.js')
const commandPrefixSchema = require("../../schemas/command-prefix-schema");
const mongo = require("../../src/mongo");

module.exports = {
    name: 'prefix',
    aliases: [],
    utilisation: '`prefix` prefix',
    usage: 'Ustawia prefix dla bota na serwerze',
    requiredPermission: ['ADMINISTRATOR'],
    cooldown: 10,
    minArgs: 0,

    execute: async (client, message, args) => {
        await mongo().then(async mongoose =>{
            try{
                if(args[0] == undefined || args[0] == null){
                    args[0] = client.config.app.px;
                    message.channel.send('`Prefix` został ustawiony na domyślny')
                }else{
                    message.channel.send('Ustawiono `prefix` '+args[0])
                }
                const guildID = message.guild.id 
                await commandPrefixSchema.findOneAndUpdate({
                    _id: guildID
                },{
                    _id: guildID,
                    prefix: args[0]
                },{
                    upsert: true
                })
                
                
            }finally{
                mongoose.connection.close()
            }
            
            loadPrefixes.loadPrefixes(client)
            
        })
    },
};