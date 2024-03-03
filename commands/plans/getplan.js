const { MessageAttachment } = require('discord.js');
const cachedStudentsPlansSvgSchema = require('../../schemas/cached-students-plans-svg-schema.js');
const mongo = require("../../src/mongo");
const { htmltoimg } = require('../../functions/svt-to-img.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    data: new SlashCommandBuilder().
        setName("plan")
        .setDescription("Wyświetla plan dla podanej klasy")
        .addStringOption(option =>
            option.setName('klasa')
                .setDescription('Podaj klase')
                .setRequired(true)),
    name: 'plan',
    aliases: [],
    utilisation: '`prefix` plan `klasa`',
    usage: 'Zwraca Plan lekcji danej klasy',//shows
    requiredPermission: false,
    cooldown: 30,
    minArgs: 1,

    execute: async (client, message, interaction, args) =>{
        let cmd ={
            result: null,
            reply: message || interaction,
            class: "",
            init: async ()=>{
                
                await cmd.getData()
                if(cmd.result){
                    if(interaction){
                        await cmd.reply.deferReply()
                    }
                    htmltoimg(cmd.result['plan']).then((img)=>{
                        if(interaction){
                            cmd.reply.editReply({content: `To jest plan klasy ${cmd.class}\n⁣`,
                            files: [{ attachment: img }],
                            ephemeral: true,
                            allowedMentions: {
                                repliedUser: false
                            }})
                        }else{
                            cmd.reply.reply({content: `To jest plan klasy ${cmd.class}\n⁣`,
                            files: [{ attachment: img }],
                            ephemeral: true,
                            allowedMentions: {
                                repliedUser: false
                            }})
                        }
                        
                    })
                    
                }else{
                    if(interaction){
                        await cmd.reply.deferReply()
                    }
                    if(interaction){
                        cmd.reply.editReply({content: 'Nie znaleziono takiej klasy',
                        ephemeral: true,
                        allowedMentions: {
                            repliedUser: false
                        }})
                    }else{
                        cmd.reply.reply({content: 'Nie znaleziono takiej klasy',
                        ephemeral: true,
                        allowedMentions: {
                            repliedUser: false
                        }})
                    }
                    
                }
            },
            getData: async ()=>{
                await mongo().then(async mongoose =>{
                    try{
                                
                                const result = await cachedStudentsPlansSvgSchema.findOne({_id: cmd.class})
                                // console.log(result);
                                cmd.result = result
                                
                                
                                
                    }finally{
                        mongoose.connection.close()
                    }
                })
            }

        }
        if(interaction){
            interaction.deferReply();
            cmd.class = interaction.options.getString('klasa').toLocaleLowerCase()
        }else{
            cmd.class = args[0].toLocaleLowerCase()
        }
        cmd.init()
        
       
    },
};