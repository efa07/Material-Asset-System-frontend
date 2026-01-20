import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AssetAssignmentsService} from './asset-assignments.service';

@ApiTags('asset-assignments')
@Controller('api/v1/asset-assignments')
export class AssetAssignmentsController {
  constructor(private readonly service: AssetAssignmentsService) {}
  
  @Get()
  findAll() {
    return this.service.findAll();
  }
}
