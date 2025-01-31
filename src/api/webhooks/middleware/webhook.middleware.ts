import {
  Injectable,
  UnauthorizedException,
  NestMiddleware,
} from "@nestjs/common";
import type { Request, Response, NextFunction } from "express";
import { WebhookCrudService } from "../services/webhook-crud.service";

@Injectable()
export class WebhookValidationMiddleware implements NestMiddleware {
  constructor(private webhookService: WebhookCrudService) {}

  async use(req: Request, _: Response, next: NextFunction) {
    const token = req.headers?.authorization;

    if (!token) throw new UnauthorizedException();

    const webhook = await this.webhookService.getWebhookBySecret(token);

    (req as any).webhook = webhook;

    return next();
  }
}
