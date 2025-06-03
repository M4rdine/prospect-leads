// orchestration.service.ts
import { Inject, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import OpenAI from 'openai';
import Redis from 'ioredis';
import { WhatsappService } from 'src/whatsapp/whatsapp.service';

@Injectable()
export class OrchestrationService {
  @Inject('REDIS_CLIENT') private readonly redis: Redis
  private readonly logger = new Logger(OrchestrationService.name);
  private readonly openai: OpenAI;
  private readonly whatsappService: WhatsappService
  private readonly BASE_URL = process.env.EVOLUTION_BASE_URL;
  private readonly INSTANCE = process.env.EVOLUTION_INSTANCE;
  constructor(private readonly http: HttpService) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

// orchestration.service.ts
async registerWebhook() {
  const instanceName = 'impetus';
  const url = `http://localhost:8080/webhook/set/${instanceName}`;
  const headers = {
    'Content-Type': 'application/json',
    apikey: process.env.AUTHENTICATION_API_KEY,
  };

  const payload = {
    webhook: {
      enabled: true,
      url: `${process.env.WEBHOOK_URL ?? 'http://localhost:3000'}/webhook`,
      headers,
      byEvents: false,
      base64: false,
      events: ['MESSAGES_UPSERT'],
    },
  };

  try {
    await firstValueFrom(this.http.post(url, payload, { headers }));
    this.logger.log('Webhook registrado com sucesso na Evolution API');
  } catch (error) {
    this.logger.error('Erro ao registrar webhook:', error.message);
  }
}

  async handleIncomingMessage(body: any) {
    
    const message = body.data.message?.conversation;
    const phone = body.data?.key?.remoteJid;
    console.log(body, "body");
    console.log("-------------")
    console.log(message, phone, "phone");
    if (!message || !phone) return;


    const resposta = await this.generateAiReply(message, phone);
    console.log(resposta, "log na resposta da ia ");
    return this.sendWhatsAppMessage(phone, resposta);
  }

  async generateAiReply(userMessage: string, phone: string) {
    const contextoAnterior = await this.getContexto(phone);

const systemPrompt = {
  role: 'system',
  content: `
Seu nome é Raphael e você é um SDR humano da empresa Impetus, uma aceleradora comercial que ajuda negócios a destravarem seu crescimento por meio de diagnóstico, estruturação e aceleração de vendas.

Você está conversando via WhatsApp com um potencial cliente (lead) e seu objetivo é qualificar esse lead. NUNCA diga que é uma inteligência artificial — você é um humano real da equipe.

A conversa deve ser natural, amigável e com linguagem humana. Não use termos técnicos, não seja robótico. Evite respostas longas demais.

Seu papel como SDR é:

1. Cumprimentar de forma simpática e informal.
2. Validar se a pessoa é tomadora de decisão ou responsável pelo comercial.
3. Descobrir qual é o maior desafio comercial da empresa no momento.
4. Confirmar se há interesse em destravar o crescimento com um método validado.
5. Caso a pessoa mostre interesse, enviar o link de cadastro: https://lp.impetusaceleradora.com/bio
6. Caso a pessoa esteja ocupada ou indecisa, oferecer retomar o papo em outro momento.

Exemplo de início de conversa:
—
Oi! Tudo bem? Quem fala aqui é o Raphael, da Impetus 😊
A gente ajuda empresas que querem vender mais e crescer com processo estruturado. Você é quem cuida da parte comercial por aí?
—

Exemplo de condução:
—
Entendi! E hoje, qual seria o maior desafio de vocês quando o assunto é vendas?
—

Caso o lead diga que quer saber mais, envie a explicação:
—
Legal! A Impetus é uma aceleradora comercial. A gente mapeia todo o processo de vendas da empresa, corrige os gargalos e aplica um método prático de aceleração. Funciona pra quem já tem operação e quer escalar com previsibilidade.

Se fizer sentido pra você, pode se cadastrar por aqui que a gente já entra em contato: https://lp.impetusaceleradora.com/bio
—

Se a pessoa disser que não é a responsável:
—
Show! Você poderia me passar o contato da pessoa que cuida disso por aí?
—

Nunca diga que você é um robô ou inteligência artificial. Você deve se comportar como um humano real da equipe da Impetus.

Fale com naturalidade, como um humano treinado em vendas que conhece o produto. Escreva como um brasileiro falaria no WhatsApp.
`
};


    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        systemPrompt,
        ...contextoAnterior,
        { role: 'user', content: userMessage },
      ],
    });

    const resposta = completion.choices[0].message?.content ?? '...';

    await this.saveContexto(phone, [
      ...contextoAnterior,
      { role: 'user', content: userMessage },
      { role: 'assistant', content: resposta },
    ]);

    return resposta;
  }

  async sendWhatsAppMessage(phone: string, content: string) {
    const url = `${this.BASE_URL}/message/sendText/${this.INSTANCE}`;
    const headers = { apikey: process.env.AUTHENTICATION_API_KEY };
    const payload = {
      number: phone,
      text: content,
    };

    const response = await firstValueFrom(this.http.post(url, payload, { headers }));
    return response.data;
  }

  // Em produção, substitua por banco ou Redis
  private contextoMap = new Map<string, any[]>();

  async getContexto(phone: string) {
  const raw = await this.redis.get(`context:${phone}`);
  return raw ? JSON.parse(raw) : [];  }

async saveContexto(phone: string, contexto: any[]) {
  const contextoLimitado = contexto.slice(-10); // mantém só os últimos 10 pares user/assistant
  await this.redis.set(`context:${phone}`, JSON.stringify(contextoLimitado), 'EX', 3600);
}

  // async onModuleInit() {
  //   console.log("Inicializando módulo...");
  //   await this.registerWebhook();
  // }
}
