import { Module } from '@nestjs/common';
import { AgentsService } from './agents.service';
import { AgentsController } from './agents.controller';
import { HttpModule } from '@nestjs/axios';
import { WhatsappService } from 'src/whatsapp/whatsapp.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AgentSchema, Agent } from './agent.schema';

@Module({
  imports: [HttpModule, MongooseModule.forFeature([{ name: Agent.name, schema: AgentSchema }])],
  providers: [AgentsService, WhatsappService],
  controllers: [AgentsController],
})
export class AgentsModule {}