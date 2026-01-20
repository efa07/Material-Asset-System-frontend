import { Injectable } from '@nestjs/common';
import { MockDbService } from '../common/mock-db.service';

@Injectable()
export class NotificationsService {
  constructor(private mockDb: MockDbService) { }

  findAll() {
    return this.mockDb.findAll('notifications');
  }
}
