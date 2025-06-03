import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { OrchestrationModule } from './orchestration/orchestration.module';
import { RedisModule } from 'redis.module';
import { HttpModule } from '@nestjs/axios';
import { WhatsAppModule } from './whatsapp/whatsapp.module';

@Module({
  imports: [HttpModule, RedisModule, ConfigModule.forRoot(), WhatsAppModule, OrchestrationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
