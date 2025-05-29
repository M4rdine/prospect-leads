// src/whatsapp/whatsapp.controller.ts
import { Controller, Post, Body, Get } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';

@Controller('whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

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
}
