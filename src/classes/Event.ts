import { ClientEvents } from "discord.js";
import { ExtendedClient } from "./ExtendedClient";

export type Event<K extends keyof ClientEvents> = {
  name: K;
  once: boolean;
  run: (client: ExtendedClient, ...args: any[]) => void;
};

export function defineEvent<K extends keyof ClientEvents>(
  event: Event<K>,
): Event<K> {
  return event;
}
