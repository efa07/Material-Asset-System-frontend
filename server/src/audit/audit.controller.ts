import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuditService } from './audit.service';

@ApiTags('audit')
@Controller('api/v1/audit')
export class AuditController {
  constructor(private readonly service: AuditService) {}
  
  @Get()
  findAll() {
    return this.service.findAll();
  }
}
