// src/whatsapp/whatsapp.controller.ts
import { Controller, Post, Body, Get } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { OrchestrationService } from 'src/orchestration/orchestration.service';

@Controller('whatsapp')
export class WhatsappController {
  constructor(
    private readonly whatsappService: WhatsappService,
    private readonly orchestrationService: OrchestrationService
  ) {}
    @Post('send')
    async sendMessage(@Body() body: { phone: string; message: string }) {
        return this.whatsappService.sendMessage(body.phone, body.message);
    }

    @Get('status')
    async getStatus() {
        return this.whatsappService.getStatus();
    }

    @Post('connect')
    async getConnectInstance(@Body() body: {instanceName: string}) {
        console.log(body);
        return this.whatsappService.getConnectInstance(body.instanceName);
    }

    @Post('instance')
    async createInstance(@Body() instanceName: string) {
        return this.whatsappService.createInstance(instanceName);
    }

    @Post('webhook')
    async handleWebhook(@Body() body: any) {
        return this.orchestrationService.handleIncomingMessage(body);
    }
}
