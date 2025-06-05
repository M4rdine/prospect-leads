import { Body, Controller, Get, Post } from '@nestjs/common';
import { AgentsService } from './agents.service';
import { CreateAgentDto } from './create-agent.dto';

@Controller('agents')
export class AgentsController {
    constructor(private readonly service: AgentsService) {}

    @Post()
    async create(@Body() data: CreateAgentDto) {
        return this.service.createAgent(data);
    }

    @Get()
    async findAll() {
        return this.service.listAgents();
    }
}
