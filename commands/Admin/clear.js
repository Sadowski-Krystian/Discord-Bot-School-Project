const loadPrefixes = require('../../events/ready.js')
const commandPrefixSchema = require("../../schemas/command-prefix-schema");
const mongo = require("../../src/mongo");

module.exports = {
    name: 'clear',
    aliases: [],
    utilisation: '{prefix}ping',
    usage: '*I cleaned this chat room for you.*',
    requiredPermission: ['ADMINISTRATOR', 'MANAGE_MESSAGES'],
    cooldown: 10,
    minArgs: 1,

    execute: async (client, message, args) => {
        console.log("wyczyszczono");
        const channel = message.channel
        let amount = parseInt(args[0])

        if(isNaN(amount)){
            channel.send("*You need give me a number of messages you want delate.*")
            return
        }
        
            do {
                if(amount<2){
                    message.delete()
                }else{
                    if(amount>100){
                        channel.bulkDelete(100)
                        amount = amount-100
                        console.log(amount);
                    }else{
                        channel.bulkDelete(amount)
                        amount = amount-100
                        console.log(amount);
                        channel.send("*I clear chat for you.*")
                    }
                }
                
                //channel.bulkDelete(amount)
            } while (amount>0);
            
        
        

    },
};