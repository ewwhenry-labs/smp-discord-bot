import {
  ChatInputCommandInteraction,
  RESTPostAPIApplicationCommandsJSONBody,
} from "discord.js";
import { ExtendedClient } from "./ExtendedClient.js";

export interface CommandData {
  name: string;
  description: string;
  usage: string;
}

export class Command {
  constructor(public data: RESTPostAPIApplicationCommandsJSONBody) {}

  public async run(
    client: ExtendedClient,
    intreaction: ChatInputCommandInteraction,
  ) {
    client.logger.info(`Executing command ${intreaction.commandName}`);
    await intreaction.editReply({
      content: "Hello World!\n-# This command is not implemented yet.",
    });
  }
}
