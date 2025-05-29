// src/whatsapp/whatsapp.service.ts
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WhatsappService {
  private readonly BASE_URL = process.env.EVOLUTION_BASE_URL;
  private readonly TOKEN = process.env.EVOLUTION_TOKEN;
  private readonly INSTANCE = process.env.EVOLUTION_INSTANCE;

  constructor(private readonly http: HttpService) {}

  async sendMessage(phone: string, message: string) {
    const url = `${this.BASE_URL}/message/sendText/${this.INSTANCE}`;
    const payload = {
      number: phone,
      text: message,
    };
    const headers = { apikey: process.env.AUTHENTICATION_API_KEY };
    const response = await firstValueFrom(this.http.post(url, payload, { headers }));
    return response.data;
  }

  async getStatus() {
    const url = `${this.BASE_URL}/status/${this.INSTANCE}`;
    const headers = { Authorization: `Bearer ${this.TOKEN}` };
    const response = await firstValueFrom(this.http.get(url, { headers }));
    return response.data;
  }

  async getConnectInstance() {
    const url = `${this.BASE_URL}/instance/connect/${this.INSTANCE}`;
    const headers = { apikey: process.env.AUTHENTICATION_API_KEY };
    const response = await firstValueFrom(this.http.get(url, { headers }));
    return response.data;
  }

  async createInstance() {
    const url = `${this.BASE_URL}/instance/create`;
    const headers = { apikey: process.env.AUTHENTICATION_API_KEY };
    const payload = {
      instanceName: this.INSTANCE,
      qrcode: true,
      integration: "WHATSAPP-BAILEYS"
    }
    const response = await firstValueFrom(this.http.post(url, payload, { headers }));
    return response.data;
  }
  
}
