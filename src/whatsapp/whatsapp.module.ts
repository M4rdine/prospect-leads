import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OrchestrationService } from 'src/orchestration/orchestration.service';
import { WhatsappController } from './whatsapp.controller';
import { WhatsappService } from './whatsapp.service';
import { AgentsModule } from 'src/agents/agents.module';

@Module({
  imports: [HttpModule],
  providers: [
    WhatsappService,
    OrchestrationService,
    AgentsModule
  ],
  controllers: [WhatsappController],
})
export class WhatsAppModule {}
