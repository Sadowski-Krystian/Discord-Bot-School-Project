const loadPrefixes = require('../../events/ready.js')
const commandPrefixSchema = require("../../schemas/command-prefix-schema");
const mongo = require("../../src/mongo");
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    data: new SlashCommandBuilder().
        setName("prefix")
        .setDescription("Ustawia prefix bota")
        .addStringOption(option =>
            option.setName('prefix')
                .setDescription('Podaj nowy prefix')
                .setRequired(false)),
    name: 'prefix',
    aliases: [],
    utilisation: '`prefix` prefix',
    usage: 'Ustawia prefix dla bota na serwerze',
    requiredPermission: ['ADMINISTRATOR'],
    showHelp: 'Moderation',
    type:'Moderation',
    disable: false,
    DMcommand: false,
    cooldown: 10,
    minArgs: 0,

    execute: async (client, message, interaction,  args) => {
        
        let cmd = {
            prefix: "s",
            guildID: "",
            msg: "",
            interactionCommand: ()=>{
                cmd.guildID = interaction.guild.id
                if(interaction.options.getString('prefix') == null){
                    cmd.msg = '`Prefix` został ustawiony na domyślny'
                }else{
                    cmd.prefix = interaction.options.getString('prefix')
                    cmd.msg = 'Ustawiono `prefix` '+cmd.prefix
                }
                interaction.reply({content: cmd.msg, ephemeral: true})
                cmd.addPrefix()
            },
            messageCommand: ()=>{
                cmd.guildID = message.guild.id 
                if(args[0] == undefined || args[0] == null){
                    cmd.msg = '`Prefix` został ustawiony na domyślny'
                }else{
                    cmd.prefix = args[0]
                    cmd.msg = 'Ustawiono `prefix` '+cmd.prefix
                }
                message.channel.send({content: cmd.msg})
                cmd.addPrefix()
            },
            addPrefix: async ()=>{
                await mongo().then(async mongoose =>{
                    try{
                        
                        await commandPrefixSchema.findOneAndUpdate({
                            _id: cmd.guildID
                        },{
                            _id: cmd.guildID,
                            prefix: cmd.prefix
                        },{
                            upsert: true
                        })
                        
                        
                    }finally{
                        mongoose.connection.close()
                    }
                    
                    loadPrefixes.loadPrefixes(client)
                    
                })
            }
        }
        if(interaction){
            cmd.interactionCommand()
        }else{
            cmd.messageCommand()
        }


        
         
       
    },
};



