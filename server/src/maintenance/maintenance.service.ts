import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MaintenanceService {
  constructor(private prisma: PrismaService) {}
  
  findAll() {
    return this.prisma.maintenanceRecord.findMany();
  }
}
