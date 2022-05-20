const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');

module.exports = {
    name: 'import',
    aliases: [],
    utilisation: '`prefix` import',
    usage: 'Manualnie wywołuje import i zapis danych do pazy danych. \n\r !!!UWAGA!!! nie będzie możlowe kożystanie z komend podczas importu.',
    requiredPermission: ['ADMINISTRATOR', '459333178163724288'],
    cooldown: 10,
    minArgs: 0,

    execute: async (client, message, args) => {
        const yes = new MessageButton();
        const no = new MessageButton();
        
        // console.log(message);
        yes.setLabel('✅');
        yes.setStyle('PRIMARY')
        yes.setCustomId('yes');
        no.setStyle('PRIMARY')
        no.setLabel('❌');
        no.setCustomId('no');

        const embed = new MessageEmbed();
        embed.setTitle('OSTRZERZENIE')
        embed.setColor('ORANGE');

        // console.log(content);
        embed.setDescription('Aktywacja importu spowoduje tymczasowe wyłączenie wszystkich komend na czas trwania importu. Może to potrwać do kilku minut\n\nCzy chcesz kontynuować?');
        const row = new MessageActionRow().addComponents(yes,no);
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
            const embedReply = new MessageEmbed();
            
            switch (interaction.customId) {
                case 'yes':
                    embedReply.setTitle('Rozpoczęto import.')
                    embedReply.setColor('GREEN');
                    client.fun.myConservation()
                    break;

                case 'no':
                    embedReply.setTitle('Przerwano import.')
                    embedReply.setColor('RED');
                    break;
            
            }
            await interaction.channel.send({ embeds: [embedReply]})

        })
        collector.on('end', collected => {
            console.log(`Collected ${collected.size} clicks`)
        })
        
    },
};