import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AgentDocument = Agent & Document;
@Schema({ timestamps: true })
export class Agent {
  @Prop({ required: true })
  instanceName: string;

  @Prop()
  additionalContext: string;

  @Prop()
  additionalMatherial: string;

  @Prop()
  script: string;

  @Prop()
  agentFeeling: string;

  @Prop()
  status: string;

  @Prop()

  template: string;
}

export const AgentSchema = SchemaFactory.createForClass(Agent);
