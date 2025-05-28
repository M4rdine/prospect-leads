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
    console.log(url);
    const payload = {
      number: phone,
      textMessage: { text: message },
    };

    const headers = {
      Authorization: `Bearer ${this.TOKEN}`,
    };

    const response = await firstValueFrom(
      this.http.post(url, payload, { headers }),
    );

    return response.data;
  }
}
