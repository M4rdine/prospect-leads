import { Controller, Post, Body } from '@nestjs/common';
import { OrchestrationService } from './orchestration.service';

@Controller('webhook')
export class OrchestrationController {
  constructor(private readonly orchestrationService: OrchestrationService) {}

  @Post()
  async handleWebhook(@Body() body: any) {
            if(body.event === "messages.upsert") {
            return this.orchestrationService.handleIncomingMessage(body);
        } else {
            return false;
        }
  }
}
