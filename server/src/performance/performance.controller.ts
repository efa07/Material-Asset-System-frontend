import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PerformanceService } from './performance.service';

@ApiTags('performance')
@Controller('api/v1/performance')
export class PerformanceController {
  constructor(private readonly service: PerformanceService) {}
  
  @Get()
  findAll() {
    return this.service.findAll();
  }
}
