import { defineEvent } from "../classes/Event.js";

export default defineEvent({
  name: "clientReady",
  once: false,
  run: (client) => {
    client.logger.info(`Logged in as ${client.user?.tag}!`);
    client.uploadCommands();
  },
});
