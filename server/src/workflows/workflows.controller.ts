import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WorkflowsService } from './workflows.service';

@ApiTags('workflows')
@Controller('api/v1/workflows')
export class WorkflowsController {
  constructor(private readonly service: WorkflowsService) {}
  
  @Get()
  findAll() {
    return this.service.findAll();
  }
}
