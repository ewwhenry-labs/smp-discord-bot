import { Client, type ClientOptions } from "discord.js";
import { type Logger } from "winston";
import path from "node:path";
import fs from "node:fs";

import { BASE_DIR } from "../config.js";
import logger from "../utils/logger.js";

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
  private async registerCommands() {}
}
