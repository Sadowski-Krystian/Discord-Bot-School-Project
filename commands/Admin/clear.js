const { SlashCommandBuilder } = require('@discordjs/builders');
const loadPrefixes = require('../../events/ready.js')
const commandPrefixSchema = require("../../schemas/command-prefix-schema");
const mongo = require("../../src/mongo");
module.exports = {
    data: new SlashCommandBuilder().
        setName("clear")
        .setDescription("Czyści czat")
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Podaj liczbę wiadomości do usunięcia')
                .setRequired(true)),
    name: 'clear',
    aliases: [],
    showHelp: 'Moderation',
    type:'Moderation',
    utilisation: '`prefix` clear',
    usage: 'Usuwa podaną ilośc wiadomości z czatu',
    requiredPermission: ['ADMINISTRATOR', 'MANAGE_MESSAGES'],
    disable: false,
    DMcommand: false,
    cooldown: 10,
    minArgs: 1,

    execute: async (client, message, interaction , args) => {
        let cmd = {
            channel: "",
            amout: 0,
            reply: {},
            interactionCommand: ()=>{
                cmd.channel = interaction.channel
                cmd.amount = interaction.options.getInteger('amount');
                cmd.delate()
            },
            messageCommand: ()=>{
                cmd.channel = message.channel
                cmd.amount = parseInt(args[0])
                if(isNaN(cmd.amount)){
                    cmd.channel.send("Musisz podać cyfre wiadomości do usunięcia")
                    return
                }
                cmd.delate()
            },
            delate: async ()=>{
                do {
                    if(cmd.amount<2){
                        await cmd.channel.bulkDelete(1, true)
                        cmd.amount --
                        
                        
                    }else{
                        if(cmd.amount>100){
                            await cmd.channel.bulkDelete(100, true)
                            cmd.amount = cmd.amount-100
                            console.log(cmd.amount);
                        }else{
                            await cmd.channel.bulkDelete(cmd.amount, true)
                            cmd.amount = cmd.amount-100
                            console.log(cmd.amount);
                            
                        }
                    }
                    
                    //channel.bulkDelete(amount)
                } while (cmd.amount>0);
                if(interaction){
                    interaction.reply({content: "Czat został wyczyszczony", ephemeral: true})
                }else{
                    cmd.channel.send({content: "Czat został wyczyszczony"}).then(msg => {
                        try{
                            setTimeout(() => msg.delete(), 10000)
                        }catch{

                        }
                        
                      })
                }
            }
        }
        if(interaction){
            cmd.interactionCommand()
        }else{
            cmd.messageCommand()
        }

         
         

        
        
           
            
        
        

    },
};

