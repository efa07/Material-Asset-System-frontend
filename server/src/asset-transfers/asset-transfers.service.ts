import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssetTransferDto } from './dto/create-asset-transfer.dto';
import { UpdateAssetTransferDto } from './dto/update-asset-transfer.dto';

@Injectable()
export class AssetTransfersService {
  constructor(private prisma: PrismaService) {}

  create(createDto: CreateAssetTransferDto) {
    const { transferDate, ...rest } = createDto;
    return this.prisma.assetTransfer.create({
      data: {
        ...rest,
        transferDate: transferDate ? new Date(transferDate) : undefined,
      },
    });
  }

  findAll() {
    return this.prisma.assetTransfer.findMany();
  }

  findOne(id: string) {
    return this.prisma.assetTransfer.findUnique({ where: { id } });
  }

  update(id: string, updateDto: UpdateAssetTransferDto) {
    const { transferDate, ...rest } = updateDto;
    return this.prisma.assetTransfer.update({
      where: { id },
      data: {
        ...rest,
        transferDate: transferDate ? new Date(transferDate) : undefined,
      },
    });
  }

  remove(id: string) {
    return this.prisma.assetTransfer.delete({ where: { id } });
  }
}
