import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OrchestrationService } from 'src/orchestration/orchestration.service';
import { WhatsappController } from './whatsapp.controller';
import { WhatsappService } from './whatsapp.service';

@Module({
  imports: [HttpModule],
  providers: [
    WhatsappService,
    OrchestrationService,
  ],
  controllers: [WhatsappController],
})
export class WhatsAppModule {}
