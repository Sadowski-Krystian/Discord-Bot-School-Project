const commandPrefixSchema = require("../schemas/command-prefix-schema");
const mongo = require("../src/mongo");
module.exports = async (client) => {
    console.log(`Logged to the client ${client.user.username}\n-> Ready on ${client.guilds.cache.size} servers for a total of ${client.users.cache.size} users`);

    client.user.setActivity(client.config.app.playing);
   module.exports.loadPrefixes(client)
    
};

module.exports.loadPrefixes = async (client) =>{
    
    await mongo().then(async mongoose =>{
        try{
            for (const guild of client.guilds.cache){
                    const result = await commandPrefixSchema.findOne({_id: guild[1].id})
                    try{
                        guildPrefixes[guild[1].id] = result.prefix 
                    }catch{
                        guildPrefixes[guild[1].id] = 's'
                    }
                    
                    console.log(guildPrefixes);
            }
        }finally{
            
        }
    })

}


