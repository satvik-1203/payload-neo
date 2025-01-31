import {
  AutoCommand,
  AutoCommandOptions,
} from "#lib/structs/AutoResponse/AutoResponse";
import { ApplyOptions } from "@sapphire/decorators";
import { EmbedColors } from "#utils/colors";
import gamedig from "gamedig";
import { Message, MessageEmbed } from "discord.js";
import type { PayloadCommand } from "#lib/structs/commands/PayloadCommand";
import type { CommandContext } from "@sapphire/framework";
import { LanguageKeys } from "#lib/i18n/all";

@ApplyOptions<AutoCommandOptions>({
  description: LanguageKeys.Auto.Connect.LinkDescription,
  regex: /connect (https?:\/\/)?(.+\.)+\w+(:\d+)?; ?password .+([^\n`$])/,
})
export default class UserAutoCommand extends AutoCommand {
  async messageRun(
    msg: Message,
    args: PayloadCommand.Args,
    context: CommandContext
  ) {
    const connectInfo = context.prefix.toString().trim();
    const parts = connectInfo.split(";");

    const ip = parts[0].replace(/^connect (https?:\/\/)?/, "");
    const ipNoPort = ip.split(":")[0];
    const port = ip.split(":")[1] || "27015";
    const password = parts
      .slice(1)
      .join(";")
      .replace(/"|;$/g, "")
      .replace(/^ ?password /, "");

    const title = `steam://connect/${ip}/${encodeURIComponent(password)}`;

    const embed = new MessageEmbed({
      title: title.length > 250 ? title.slice(0, 250) : title,
    });

    const connectInfoEmbed = await msg.channel.send({ embeds: [embed] });

    try {
      const { name, maxplayers, players } = await gamedig.query({
        type: "tf2",
        host: ipNoPort,
        port: parseInt(port),
      });

      embed.setColor(EmbedColors.GREEN);
      embed.setDescription(
        `${name}\n${players.length}/${maxplayers} ${args.t(
          LanguageKeys.Auto.Connect.Players
        )}`
      );
    } catch (err) {
      embed.setColor(EmbedColors.RED);
      embed.setDescription(args.t(LanguageKeys.Auto.Connect.Offline));
    }

    return await connectInfoEmbed.edit({ embeds: [embed] });
  }
}
