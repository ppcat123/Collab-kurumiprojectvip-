const axios = require('axios');

var eurix = {
  name: "ai",
  version: "1.0.0",
  description: "chatgpt gpt4",
  permission: 0,
  credits: "Eugene Aguilar",
  execute: async function ({ api, event, args }) {
    try {
      const ask = args.join(" ");
      if(!ask) {
      return api.sendMessage(`${global.config.prefix}ai [ ask ]`, event.threadID, event.messageID);
      }
      const response = await axios.get(`https://akhiro-rest-api.onrender.com/api/gpt4?q=${encodeURIComponent(ask)}`);
      const answer = response.data.content;
      api.sendMessage(answer, event.threadID, event.messageID);
    } catch (error) {
      console.error(error);
  api.sendMessage("An error occured while processing your request.", event.threadID, event.messageID);
    }
  }
};

module.exports = eurix;