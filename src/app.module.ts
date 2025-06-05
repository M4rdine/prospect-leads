import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { OrchestrationModule } from './orchestration/orchestration.module';
import { RedisModule } from 'redis.module';
import { HttpModule } from '@nestjs/axios';
import { WhatsAppModule } from './whatsapp/whatsapp.module';
import { AgentsController } from './agents/agents.controller';
import { AgentsModule } from './agents/agents.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [HttpModule, RedisModule,MongooseModule.forRoot("mongodb+srv://raphaelmardine:Pj92ZNymjizg6pdf@cluster0.kcmmj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"), ConfigModule.forRoot(), WhatsAppModule, OrchestrationModule, AgentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
