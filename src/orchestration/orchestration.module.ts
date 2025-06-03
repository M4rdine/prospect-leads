import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OrchestrationService } from './orchestration.service';
import { OrchestrationController } from './orchestration.controller';

@Module({
  imports: [HttpModule],
  controllers: [OrchestrationController],
  providers: [OrchestrationService],
})
export class OrchestrationModule {}
