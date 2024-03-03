const { EmbedBuilder, ButtonBuilder } = require('@discordjs/builders');
const { ButtonStyle } = require('discord-api-types/v10');
const { MessageEmbed, MessageButton, MessageActionRow, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: false,
    name: 'import',
    aliases: [],
    showHelp: false,
    utilisation: '`prefix` import',
    usage: 'Manualnie wywołuje import i zapis danych do pazy danych. \n\r !!!UWAGA!!! nie będzie możlowe kożystanie z komend podczas importu.',
    requiredPermission: ['459333178163724288'],
    cooldown: 10,
    minArgs: 0,

    execute: async (client, message, interaction, args) => {
        const yes = new ButtonBuilder();
        const no = new ButtonBuilder();
        
        // console.log(message);
        yes.setLabel('✅');
        yes.setStyle(ButtonStyle.Primary)
        yes.setCustomId('yes');
        no.setStyle(ButtonStyle.Primary)
        no.setLabel('❌');
        no.setCustomId('no');

        const embed = new EmbedBuilder();
        embed.setTitle('OSTRZERZENIE')

        // console.log(content);
        embed.setDescription('Aktywacja importu spowoduje tymczasowe wyłączenie wszystkich komend na czas trwania importu. Może to potrwać do kilku minut\n\nCzy chcesz kontynuować?');
        const row = new ActionRowBuilder().addComponents(yes,no);
        let msg = await message.channel.send({ embeds: [embed], components: [row] })

        const filter = (interaction) => {
            if (interaction.user.id == message.author.id) {
                return true
            }
        }
        const collector = await msg.createMessageComponentCollector({
            filter,
            time: 30000
        });
        collector.on('collect', async interaction => {
            await interaction.deferUpdate();
            const embedReply = new EmbedBuilder();
            
            switch (interaction.customId) {
                case 'yes':
                    embedReply.setTitle('Rozpoczęto import.')
                    client.fun.myConservation()
                    break;

                case 'no':
                    embedReply.setTitle('Przerwano import.')
                    break;
            
            }
            await msg.edit({ embeds: [embedReply], components: []})

        })
        collector.on('end', collected => {
            console.log(`Collected ${collected.size} clicks`)
        })
        
    },
};