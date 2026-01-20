import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AssetDisposalsService {
  constructor(private prisma: PrismaService) {}
  
  findAll() {
    return this.prisma.assetDisposal.findMany();
  }
}
