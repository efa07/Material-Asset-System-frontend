import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MaintenanceService } from './maintenance.service';

@ApiTags('maintenance')
@Controller('api/v1/maintenance')
export class MaintenanceController {
  constructor(private readonly service: MaintenanceService) {}
  
  @Get()
  findAll() {
    return this.service.findAll();
  }
}
