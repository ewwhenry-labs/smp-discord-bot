import { ChatInputCommandInteraction } from "discord.js";
import { defineEvent } from "../classes/Event.js";

export default defineEvent({
  name: "interactionCreate",
  once: false,
  run: async (client, interaction: ChatInputCommandInteraction) => {
    if (interaction.isChatInputCommand()) {
      client.logger.info(`Received command ${interaction.commandName}`);
      const command = client.commands.get(interaction.commandName);
      if (command) {
        command.run(client, interaction);
      }
    }
  },
});
