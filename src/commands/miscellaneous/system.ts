import {
  ChatInputCommandInteraction,
  InteractionContextType,
} from "discord.js";
import { Command } from "../../classes/Command.js";
import { ExtendedClient } from "../../classes/ExtendedClient.js";
import os from "node:os";
import { secondsToHuman } from "../../utils/misc.js";

export default class PingCommand extends Command {
  constructor() {
    super({
      name: "system",
      description: "Get system information and statistics",
      contexts: [InteractionContextType.Guild, InteractionContextType.BotDM],
    });
  }

  override async run(
    _client: ExtendedClient,
    intreaction: ChatInputCommandInteraction,
  ) {
    const platform = os.platform(); // 'linux', 'darwin', 'win32'
    const arch = os.arch(); // 'x64', 'arm64', 'arm'
    const OS = os.type(); // 'Linux', 'Darwin', 'Windows_NT'
    // const _kernel = os.release(); // versión del kernel
    // const _hostname = os.hostname(); // nombre del host

    const totalmem = os.totalmem(); // bytes totales
    const freemem = os.freemem(); // bytes libres

    const cpus = os.cpus(); // array de objetos con información de la CPU
    const cpusCount = cpus.length; // número de CPUs
    const cpusModel = cpus[0].model; // modelo de la CPU
    const cpusSpeed = cpus[0].speed; // velocidad de la CPU

    const totalmemMB = totalmem / (1024 * 1024); // bytes totales en MB
    const freememMB = freemem / (1024 * 1024); // bytes libres en MB

    const uptime = os.uptime(); // segundos encendido
    const humanUptime = secondsToHuman(uptime); // tiempo en humano

    intreaction.reply({
      content: `
### Información del sistema
> - **💻 Plataforma**: ${platform}
> - **🆎 Tipo de sistema**: ${OS}
> - **🏗️ Arquitectura**: ${arch}
> - **⏳ Tiempo en ejecución**: ${humanUptime}

### 💻 Información de la CPU
> - **🦠 Número de CPUs**: ${cpusCount}
> - **🦠 Modelo de la CPU**: ${cpusModel}
> - **🦠 Velocidad de la CPU**: ${cpusSpeed}

### 💻 Memoria
> - **💻 Memoria Total**: ${Number(Number(totalmemMB) / 1024).toFixed(2)} GB
> - **💻 Memoria Libre**: ${Number(Number(freememMB) / 1024).toFixed(2)} GB
`,
    });
  }
}
