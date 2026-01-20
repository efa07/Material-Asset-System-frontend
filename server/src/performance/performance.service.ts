import { Injectable } from '@nestjs/common';
import { MockDbService } from '../common/mock-db.service';

@Injectable()
export class PerformanceService {
  constructor(private mockDb: MockDbService) { }

  findAll() {
    return []; // No mock data for performance yet
  }
}
