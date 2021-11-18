import type { Webhook } from "#api/webhooks/models/webhook.model";
import config from "#root/config";

export class GuildResponseDto {
  public name!: string;
  public id!: string;
  public icon!: string | null;

  public botName!: string;

  public enableSnipeForEveryone: boolean = false;
  public language: string = "en-US";
  public prefix: string = config.PREFIX;
  public pushcartPoints: number = 0;

  public webhook!: Webhook;

  constructor(options: Partial<GuildResponseDto>) {
    Object.assign(this, options);
  }
}
