import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AssetReturnsService {
  constructor(private prisma: PrismaService) {}
  
  findAll() {
    return this.prisma.assetReturn.findMany();
  }
}
