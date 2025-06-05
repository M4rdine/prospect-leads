import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { WhatsappService } from 'src/whatsapp/whatsapp.service';
import { CreateAgentDto } from './create-agent.dto';
import { firstValueFrom } from 'rxjs';
import { InjectModel } from '@nestjs/mongoose';
import { AgentDocument, Agent } from './agent.schema';
import { Model } from 'mongoose';

@Injectable()
export class AgentsService {
  @Inject("REDIS_CLIENT") private readonly redis: Redis;
  private readonly logger = new Logger(AgentsService.name);
  private readonly BASE_URL = process.env.EVOLUTION_BASE_URL;

  constructor(
    private readonly http: HttpService,
    private readonly whatsappService: WhatsappService,
    @InjectModel(Agent.name) private readonly agentModel: Model<AgentDocument>,
  ) { }

  async createAgent(data: CreateAgentDto) {
    const { instanceName } = data
    // verificar qual body enviar para criar instancia dinamicamente.

    await this.whatsappService.createInstance(instanceName);

    await this.registerWebhook(instanceName, "http://host.docker.internal:3000/webhook");

    const created = new this.agentModel(data);

    await created.save();

    return {
      message: 'Agente criado com sucesso',
      instance: instanceName,
    };
  }

  async listAgents() {
    return this.agentModel.find().exec();
  }


  private async registerWebhook(instanceName: string, webhookUrl: string) {
    const url = `${this.BASE_URL}/webhook/set/${instanceName}`;
    const headers = {
      'Content-Type': 'application/json',
      apikey: process.env.AUTHENTICATION_API_KEY,
    };

    const payload = {
      webhook: {
        enabled: true,
        url: webhookUrl,
        events: [
          'MESSAGES_UPSERT',
          'APPLICATION_STARTUP',
          'CALL',
          'CHATS_DELETE',
          'CHATS_SET',
          'CHATS_UPDATE',
          'CHATS_UPSERT',
          'MESSAGES_UPDATE',
          'MESSAGES_SET',
          'MESSAGES_DELETE',
          'SEND_MESSAGE',
        ],
        base64: false,
        byEvents: false,
      },
    };

    await firstValueFrom(this.http.post(url, payload, { headers }));
    this.logger.log(`Webhook criado para ${instanceName}`);
  }
}
