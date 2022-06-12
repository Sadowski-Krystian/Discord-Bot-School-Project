const { MessageAttachment } = require('discord.js');
const cachedTeachersPlansSchema = require('../../schemas/cached-teachers-plans-schema');
// const cachedStudentsPlansSvgSchema = require('../../schemas/cached-students-plans-svg-schema.js');
const mongo = require("../../src/mongo");
const { htmltoimg } = require('../../functions/svt-to-img.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    data: new SlashCommandBuilder().
    setName("nauczyciel")
    .setDescription("Wyświetla plan dla wybranego nauczyciela")
    .addStringOption(option =>
        option.setName('nauczyciel')
            .setDescription('wpisz nauczyciela (skrót) listę nauczycieli znajdziesz pod komendą nauczyciele')
            .setRequired(true)),
    name: 'nauczyciel',
    aliases: [],
    utilisation: '`prefix` nauczyciel `nauczyciel`',
    usage: 'Zwraca Plan lekcji danego nauczyciela. Nazwa nauczyciela musi być zgodna z listą pod komendą `nauczyciele` ze względów RODO',//shows
    requiredPermission: false,
    cooldown: 30,
    minArgs: 1,

    execute: async (client, message, interaction, args) =>{
        let cmd ={
            result: null,
            reply: message || interaction,
            teacher: "",
            init: async ()=>{
                
                await cmd.getData()
                if(cmd.result){
                    htmltoimg(cmd.result['plan']).then((img)=>{
                        if(interaction){
                            cmd.reply.editReply({content: `To jest plan nauczyciela ${cmd.teacher}\n⁣`,
                            files: [{ attachment: img }],
                            ephemeral: true,
                            allowedMentions: {
                                repliedUser: false
                            }})
                        }else{
                            cmd.reply.reply({content: `To jest plan nauczyciela ${cmd.teacher}\n⁣`,
                            files: [{ attachment: img }],
                            ephemeral: true,
                            allowedMentions: {
                                repliedUser: false
                            }})
                        }
                        
                    })
                    
                }else{
                    if(interaction){
                        cmd.reply.editReply({content: 'Nie znaleziono takiego nauczyciela',
                        ephemeral: true,
                        allowedMentions: {
                            repliedUser: false
                        }})
                    }else{
                        cmd.reply.reply({content: 'Nie znaleziono takiego nauczyciela',
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
                                
                                const result = await cachedTeachersPlansSchema.findOne({_id: cmd.teacher})
                                // console.log(result);
                                cmd.result = result
                                
                                
                                
                    }finally{
                        mongoose.connection.close()
                    }
                })
            }

        }
        if(interaction){
            await interaction.deferReply({ ephemeral: true});
            cmd.teacher = interaction.options.getString('nauczyciel').toLocaleLowerCase()
        }else{
            cmd.teacher = args[0].toLocaleLowerCase()
        }
        cmd.init()
    }
};