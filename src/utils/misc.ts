import { ExtendedClient } from "../classes/ExtendedClient.js";
import fs from "node:fs";
import crypto from "node:crypto";

export function shouldIUpdateCommands(client: ExtendedClient) {
  var previous_hash = "";
  if (fs.existsSync("commands.hash")) {
    previous_hash = fs.readFileSync("commands.hash", "utf-8");
  }

  const actual_hash = crypto
    .createHash("sha256")
    .update(JSON.stringify(client.commands.values().map((c) => c.data)))
    .digest("hex");

  if (previous_hash !== actual_hash) {
    fs.writeFileSync("commands.hash", actual_hash);

    return true;
  } else return false;
}

export function secondsToHuman(seconds: number): string {
  const units = [
    ["día", 86400],
    ["hora", 3600],
    ["minuto", 60],
    ["segundo", 1],
  ] as const;

  const parts: string[] = [];

  for (const [name, value] of units) {
    const amount = Math.floor(seconds / value);
    if (amount > 0) {
      parts.push(`${amount} ${name}${amount > 1 ? "s" : ""}`);
      seconds %= value;
    }
  }

  return parts.length ? parts.join(", ") : "0 segundos";
}
