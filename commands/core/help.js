const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Pokazuje wszystkie komendy')
    .addStringOption(option =>
        option.setName('command')
            .setDescription('Pokazuje pomoc dla wybranej komendy')
            .setRequired(false)
            .setAutocomplete(true)
    ),
    name: 'help',
    aliases: ['h'],
    showHelp: false,
    utilisation: '`prefix` help',
    requiredPermission: false,
    minArgs: 0,

    execute: async (client, message, interaction, args) => {
        let cmd = {
            embed: new MessageEmbed(),
            commands: client.commands.filter(x => x.showHelp !== false),
            commandName: null,
            command: "",
            messages: ['Witam w czym mogę ci dzis pomóc?', 'Czego dzisiaj potrzebujesz?', 'Cześć, w czym mogę ci pomóc?'],
            embedDescription: "",
            reply: interaction || message,
            msg: "",
            interactionCommand: () => {
                cmd.commandName = interaction.options.getString('command')
                cmd.msg = cmd.messages[Math.floor(Math.random() * 3)]+'\nWpisz `'+guildPrefixes[interaction.guild.id]+'help` `[command]` po więcej informacji'
                // interaction.reply({ embeds: [embed], ephemeral: true})
                cmd.embedBuilder()
            },
            messageCommand: () => {
                cmd.commandName = args[0] || null
                
                    cmd.msg = cmd.messages[Math.floor(Math.random() * 3)]+'\nWpisz `'+guildPrefixes[message.guild.id]+'help` `[command]` po więcej informacji'
                
                cmd.embedBuilder()
            },
            embedBuilder: () => {
                let data = new Date
                data = data.getFullYear().toString()
                cmd.embed.setColor('#E67E22');
                cmd.embed.setAuthor(client.user.username, client.user.displayAvatarURL({ size: 1024, dynamic: true }));
                cmd.embed.setFooter('Copyright © ' + data + ' Sadowski Krystian (Ewa Kuacja®) - wszelkie prawa zastrzerzone');

                if (cmd.commandName != null) {
                    cmd.command = cmd.commands.filter(x => x.name == cmd.commandName || x.aliases.includes(cmd.commandName))
                    if (cmd.command.size > 0) {
                        let usage = cmd.command.map(x => x.utilisation)
                        let description = cmd.command.map(x => x.usage)
                        cmd.msg = '**Użycie: **' + usage[0] + "\n\n**Opis: **" + description[0];
                    } else {
                        cmd.msg = "Nie ma takiej komendy"
                    }
                } else {
                    cmd.embed.addField(`Enabled - ${cmd.commands.size}`, cmd.commands.map(x => `\`${x.name}${x.aliases[0] ? ` (${x.aliases.map(y => y).join(', ')})\`` : '\`'}`).join(' | '));
                }
                cmd.embed.setDescription(cmd.msg)
                cmd.reply.reply({ embeds: [cmd.embed], 
                    ephemeral: true,
                    allowedMentions: {
                        repliedUser: false
                    }})
            }
        }

        
        if (interaction) {
            cmd.interactionCommand()
        } else {
            cmd.messageCommand()
        }

       
    },
};