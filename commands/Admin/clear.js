const loadPrefixes = require('../../events/ready.js')
const commandPrefixSchema = require("../../schemas/command-prefix-schema");
const mongo = require("../../src/mongo");

module.exports = {
    name: 'clear',
    aliases: [],
    utilisation: '`prefix` clear',
    usage: 'Usuwa podaną ilośc wiadomości z czatu',
    requiredPermission: ['ADMINISTRATOR', 'MANAGE_MESSAGES'],
    cooldown: 10,
    minArgs: 1,

    execute: async (client, message, args) => {
        console.log("wyczyszczono");
        const channel = message.channel
        let amount = parseInt(args[0])

        if(isNaN(amount)){
            channel.send("Musisz podać cyfre wiadomości do usunięcia")
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
                        channel.send("Czat został wyczyszczony")
                    }
                }
                
                //channel.bulkDelete(amount)
            } while (amount>0);
            
        
        

    },
};