import { Injectable } from '@nestjs/common';
import { MockDbService } from '../common/mock-db.service';

@Injectable()
export class MaintenanceService {
  constructor(private mockDb: MockDbService) { }

  findAll() {
    return this.mockDb.findAll('maintenanceTasks');
  }
}
