import { Args, Command, CommandOptions } from "@sapphire/framework";
import { ApplyOptions } from "@sapphire/decorators";
import type { Message } from "discord.js";
import { send } from "@sapphire/plugin-editable-commands";
import getArgs from "#root/util/get-args";
import { getChangelog } from "#root/util/get-changelog";
import { codeBlock } from "@discordjs/builders";

@ApplyOptions<CommandOptions>({
  description:
    "Retreives the changelog for the current version or [version]. Versions must follow the #.#.# format.",
})
export class UserCommand extends Command {
  async run(msg: Message, args: Args) {
    const [version] = getArgs(args);

    const changeLog = await getChangelog(version);

    if (!changeLog)
      return await send(msg, { content: "Invalid version format" });

    return await send(msg, {
      content: codeBlock("md", changeLog),
    });
  }
}
