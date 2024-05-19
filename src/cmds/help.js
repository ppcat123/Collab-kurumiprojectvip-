

var eurix = {
    name: "help",
    version: "1.0.0",
    description: "Show the list of available commands",
    permission: 0,
    credits: "Eugene Aguilar",
    execute: async function ({ api, event, args }) {
        try {
            let commandList = "Available commands:\n\n";

            global.commands.forEach(command => {
                const { name, version, description, permission, credits } = command;
                commandList += `${global.config.prefix}${name}\nDescription: ${description}\nVersion: ${version}\nPermission: ${permission}\nCredits: ${credits}\n\n`;
            });

            
            api.sendMessage(commandList, event.threadID, event.messageID);
        } catch (error) {
            console.error(error);
            api.sendMessage("There was an error executing the command.", event.threadID);
        }
    }
};

module.exports = eurix;