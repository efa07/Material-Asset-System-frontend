import { Injectable } from '@nestjs/common';
import { MockDbService } from '../common/mock-db.service';

@Injectable()
export class AssetAssignmentsService {
  constructor(private mockDb: MockDbService) { }

  findAll() {
    return this.mockDb.findAll('assignments');
  }
}
