import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AssetAssignmentsService {
  constructor(private prisma: PrismaService) {}
  
  findAll() {
    return this.prisma.assetAssignment.findMany();
  }
}
