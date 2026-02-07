import { Client, type ClientOptions } from "discord.js";
import { type Logger } from "winston";
import path from "node:path";
import fs from "node:fs";

import { BASE_DIR } from "../config.js";
import logger from "../utils/logger.js";
import { shouldIUpdateCommands } from "../utils/misc.js";

export class ExtendedClient extends Client {
  public commands: Map<string, any> = new Map();
  public logger: Logger = logger;

  constructor(options: ClientOptions) {
    super(options);
    this.registerEvents();
    this.registerCommands();
  }

  private async registerEvents() {
    const eventsPath = path.join(BASE_DIR, "events");
    const eventFiles = await fs.promises.readdir(eventsPath);

    this.logger.info(
      `Registring events... (${eventFiles.length} event files found)`,
    );

    for (const file of eventFiles) {
      const event = await import(path.join(eventsPath, file));
      this.logger.info(`Event ${event.default.name} registered`);
      this[event.once ? "once" : "on"](event.default.name, (...args) =>
        event.default.run(this, ...args),
      );
    }
  }
  private async registerCommands() {
    const commandsPath = path.join(BASE_DIR, "commands");
    const commandFiles = fs.globSync(path.join(commandsPath, "**/*.{ts,js}"));

    this.logger.info(
      `Registring commands... (${commandFiles.length} command files found)`,
    );
    for (const file of commandFiles) {
      const commandFile = await import(file);
      const command = new commandFile.default();

      this.logger.info(`Command ${command.data.name} registered`);
      this.commands.set(command.data.name, command);
    }
  }

  public async uploadCommands() {
    if (shouldIUpdateCommands(this)) {
      this.logger.info("Uploading commands...");
      this.application?.commands
        .set(Array.from(this.commands.values()).map((cmd) => cmd.data))
        .then(() => {
          this.logger.info("Commands uploaded!");
        });
    }
  }
}
