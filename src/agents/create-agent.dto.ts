export class CreateAgentDto {
    instanceName: string;
    additionalContext: string;
    additionalMatherial: string;
    agentFeeling: string;
    agentAnswers: string;
    script?: {
        value: string;
        answer: string;
    }[];
    status: string;
    template: string;
}
