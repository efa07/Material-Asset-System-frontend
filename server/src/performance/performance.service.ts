import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PerformanceService {
  constructor(private prisma: PrismaService) {}
  
  findAll() {
    return this.prisma.performanceRecord.findMany();
  }
}
