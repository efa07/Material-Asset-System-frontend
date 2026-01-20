import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AssetTransfersService {
  constructor(private prisma: PrismaService) {}
  
  findAll() {
    return this.prisma.assetTransfer.findMany();
  }
}
