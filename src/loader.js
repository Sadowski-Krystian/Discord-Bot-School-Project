const { readdirSync } = require('fs');
const { Collection } = require('discord.js');

client.commands.clear()

const events = readdirSync('./events/').filter(file => file.endsWith('.js'));

console.log(`Loading events...`);

for (const file of events) {
    const event = require(`../events/${file}`);
    console.log(`-> Loaded event ${file.split('.')[0]}`);
    client.on(file.split('.')[0], event.bind(null, client));
    delete require.cache[require.resolve(`../events/${file}`)];
};

console.log(`Loading commands...`);

readdirSync('./commands/').forEach(dirs => {
    const commands = readdirSync(`./commands/${dirs}`).filter(files => files.endsWith('.js'));

    for (const file of commands) {
        const command = requireUncached(`../commands/${dirs}/${file}`);
        console.log(command);
        console.log(`-> Loaded command ${command.name.toLowerCase()}`);
        client.commands.set(command.name.toLowerCase(), command);
        // delete require.cache[require.resolve(`../commands/${dirs}/${file}`)];
    };
});

function requireUncached(module) {
    delete require.cache[require.resolve(module)];
    return require(module);
}