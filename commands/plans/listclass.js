const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
const cachedStudentsPlansSvgSchema = require('../../schemas/cached-students-plans-svg-schema.js');
const classroomsSchema = require('../../schemas/classrooms-schema.js');
const mongo = require("../../src/mongo");
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    data: new SlashCommandBuilder().
        setName("sale")
        .setDescription("Wyświetla listę wszystkich gabinetów w zse"),
    name: 'sale',
    aliases: [],
    utilisation: '`prefix` sale',
    usage: 'zwraca listę wszystkich sal w zse',//shows
    requiredPermission: false,
    cooldown: 5,
    minArgs: 0,

    execute: async (client, message, interaction, args) => {

        
        let cmd = {
            start: 0,
            end: 0,
            content: null,
            msg: null,
            authorID: null,
            reply: message || interaction,
            embed: new MessageEmbed(),
            nextButton: new MessageButton().setLabel('▶️').setStyle('SECONDARY').setCustomId('mextClassroom'),
            previosButton: new MessageButton().setLabel('◀️').setStyle('SECONDARY').setCustomId('previosClassroom'),
            minButton: new MessageButton().setLabel('⏮️').setStyle('SECONDARY').setCustomId('minClassroom'),
            maxButton: new MessageButton().setLabel('⏭️').setStyle('SECONDARY').setCustomId('maxClassroom'),
            saletable: [],
            row: new MessageActionRow(),

            getMongoData: async () => {
                await mongo().then(async mongoose => {
                    try {

                        const result = await classroomsSchema.find()
                        for (let i = 0; i < result.length; i++) {

                            cmd.saletable.push(result[i])

                        }


                    } finally {
                        mongoose.connection.close()
                    }
                })
            },
            embedGenerator: () => {
                cmd.embed.setTitle('Lista wszystkich gabinetów w ZSE')
                cmd.embed.setColor('#E67E22');
                cmd.embed.setDescription(cmd.content);
                cmd.embed.setFooter({ text: `Showing ${cmd.end} of ${cmd.saletable.length}` });
            },
            getdata: (start, end, tablica) => {
                let str = ''
                // console.log(tablica[0]);
                for (let x = start; x < end; x++) {
                    str = str + (x + 1) + ". `" + tablica[x].name + "`\n"
                }
                return str

                // msg.edit({ embeds: [embed], components: [row] })
            },
            init: async () => {

                cmd.row.addComponents(cmd.minButton, cmd.previosButton, cmd.nextButton, cmd.maxButton)
                await cmd.getMongoData()
                cmd.saletable = cmd.saletable.sort()
                if (cmd.saletable.length > 10) {
                    cmd.end = 10
                } else {
                    cmd.end = cmd.saletable.length
                }
                cmd.content = cmd.getdata(cmd.start, cmd.end, cmd.saletable)
                // console.log(cmd.content);
                cmd.embedGenerator()
                if (interaction) {
                    cmd.authorID = interaction.member.id
                    cmd.msg = await cmd.reply.editReply({
                        embeds: [cmd.embed], components: [cmd.row], ephemeral: true, allowedMentions: {
                            repliedUser: false
                        }
                    })
                } else {
                    cmd.authorID = message.author.id
                    cmd.msg = await cmd.reply.reply({
                        embeds: [cmd.embed], components: [cmd.row], ephemeral: true, allowedMentions: {
                            repliedUser: false
                        }
                    })
                }
                let filter = (int) => {
                    if (int.user.id == cmd.authorID) {
                        return true
                    }
                }
                let collector = await cmd.msg.createMessageComponentCollector({
                    filter,
                    time: 10000
                })
                collector.on('collect', async int => {
                    await int.deferUpdate();
                    switch (int.customId) {
                        case 'mextClassroom': {
                            cmd.start = cmd.start + 10
                            cmd.end = cmd.end + 10
                            if (cmd.end > cmd.saletable.length) {
                                cmd.end = cmd.saletable.length
                                cmd.start = cmd.saletable.length - 10
                                if (cmd.start < 0) {
                                    cmd.start = 0
                                }

                            }
                            break;
                        }
                        case 'previosClassroom': {
                            cmd.start = cmd.start - 10
                            cmd.end = cmd.end - 10
                            if (cmd.start < 0) {
                                cmd.start = 0
                                cmd.end = 10
                                if (cmd.end > cmd.saletable.length) {
                                    cmd.end = cmd.saletable.length
                                }

                            }
                            break;
                        }
                        case 'minClassroom': {
                            cmd.start = 0
                            cmd.end = 10
                            if (cmd.end > cmd.saletable.length) {
                                cmd.end = cmd.saletable.length
                            }
                            break;
                        }
                        case 'maxClassroom': {
                            cmd.end = cmd.saletable.length
                            cmd.start = cmd.saletable.length - 10
                            if (cmd.start < 0) {
                                cmd.start = 0
                            }
                            break;
                        }
                    }
                    cmd.content = await cmd.getdata(cmd.start, cmd.end, cmd.saletable)
                    // console.log(content);
                    await cmd.embedGenerator()
                    await int.editReply({ embeds: [cmd.embed], components: [cmd.row] });
                    collector.resetTimer()

                })
                collector.on('end', collected => {
                    console.log(`Collected ${collected.size} clicks`)
                })

            }
        }

        if (interaction) {
            await interaction.deferReply({ ephemeral: true });
        }
        cmd.init()


    }
};