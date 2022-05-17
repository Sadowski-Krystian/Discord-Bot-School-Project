const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');

module.exports = {
    name: 'reload',
    aliases: [],
    utilisation: '{prefix}reload',
    usage: 'Przeładowuje komendy bez potrzeby wyłączenia bota.',
    requiredPermission: ['ADMINISTRATOR'],
    cooldown: 10,
    minArgs: 0,

    execute: async (client, message, args) => {
        
        const embed = new MessageEmbed();
        embed.setTitle('Komendy zostały załadowane ponownie')
        embed.setColor('GREEN');
        // conservation = true
        // client.commands.clear()
        // console.log(client.commands);
        // delete require.cache[require.resolve(`../../src/loader.js`)];
        // require('../../src/loader.js')
        // console.log(client.commands);
        // conservation = false
        // console.log(content);
        // embed.setDescription('Aktywacja importu spowoduje tymczasowe wyłączenie wszystkich komend na czas trwania importu. Może to potrwać do kilku minut\n\nCzy chcesz kontynuować?');
        // const row = new MessageActionRow().addComponents(yes,no);
        let msg = await message.channel.send({ embeds: [embed] })

        
    },
};