const login = require("fb-chat-api-temp");
const fs = require('fs');
const path = require('path');
const appstate = require("./appstate.json");
const config = require("./config.json");

global.config = config;
const commands = new Map();

const commandsPath = path.join(__dirname, 'src', 'cmds');
fs.readdirSync(commandsPath).forEach(file => {
    if (file.endsWith('.js')) {
        const command = require(path.join(commandsPath, file));
        commands.set(command.name, command);
    }
});

global.commands = commands;

login({ appState: appstate }, (err, api) => {
    if (err) {
        console.error(err);
        return;
    }

    api.setOptions({ listenEvents: true });

    api.listenMqtt((err, event) => {
        if (err) {
            console.error(err);
            return;
        }

        if (event.type === "message" || event.type === "message_reply") {
            const senderID = event.senderID;
            const message = event.body;

            if (senderID === api.getCurrentUserID()) return; 
            if (!message.startsWith(config.prefix)) return; 

            const args = message.slice(config.prefix.length).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();

            if (!commands.has(commandName)) {
                api.sendMessage(`Command not found type ${global.config.prefix}help to see all cmds`, event.threadID, event.messageID);
                return;
            }

            const command = commands.get(commandName);

            if (command.permission > 0 && !config.admins.includes(senderID)) {
                api.sendMessage("You do not have permission to use this command.", event.threadID);
                return;
            }

            try {
                command.execute({ api, event, args });
            } catch (error) {
                console.error(error);
                api.sendMessage("There was an error executing the command.", event.threadID);
            }
        }
    });
});