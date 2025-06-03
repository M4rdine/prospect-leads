// webhook.controller.ts
import { Controller, Post, Body, Logger } from '@nestjs/common';
import { OrchestrationService } from 'src/orchestration/orchestration.service';

@Controller('webhook')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(private readonly orchestrationService: OrchestrationService) {}

  @Post()
  async handle(@Body() body: any) {
    this.logger.log(`Mensagem recebida via webhook: ${JSON.stringify(body)}`);
    return this.orchestrationService.registerWebhook();
  }
}