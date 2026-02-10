import {
  ChatInputCommandInteraction,
  InteractionContextType,
} from "discord.js";
import { Command } from "../../classes/Command.js";
import { ExtendedClient } from "../../classes/ExtendedClient.js";

export default class PingCommand extends Command {
  constructor() {
    super({
      name: "ping",
      description: "Ping the bot",
      contexts: [InteractionContextType.Guild, InteractionContextType.BotDM],
    });
  }

  override async run(
    _client: ExtendedClient,
    intreaction: ChatInputCommandInteraction,
  ) {
    await intreaction.deferReply();
    await intreaction.editReply({
      content: "Pong!",
    });
  }
}
