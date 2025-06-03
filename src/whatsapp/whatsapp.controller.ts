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

    @Get('connect')
    async getConnectInstance() {
        return this.whatsappService.getConnectInstance();
    }

    @Post('instance')
    async createInstance() {
        return this.whatsappService.createInstance();
    }

    @Post('webhook')
    async handleWebhook(@Body() body: any) {
        return this.orchestrationService.handleIncomingMessage(body);
    }
}
