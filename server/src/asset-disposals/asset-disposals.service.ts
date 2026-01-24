import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssetDisposalDto } from './dto/create-asset-disposal.dto';
import { UpdateAssetDisposalDto } from './dto/update-asset-disposal.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AssetDisposalsService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateAssetDisposalDto) {
    const { disposalDate, value, ...rest } = createDto;

    return this.prisma.$transaction(async (tx) => {
      const disposal = await tx.assetDisposal.create({
        data: {
          ...rest,
          disposalDate: disposalDate ? new Date(disposalDate) : undefined,
          value: value ? new Prisma.Decimal(value) : undefined,
        },
      });

      await tx.asset.update({
        where: { id: rest.assetId },
        data: {
          status: 'DISPOSED',
          storeId: null,
          shelfId: null,
          assignedToUserId: null,
        },
      });

      // Close any active assignments
      await tx.assetAssignment.updateMany({
        where: {
          assetId: rest.assetId,
          status: 'ACTIVE',
        },
        data: {
          status: 'RETURNED',
          returnedAt: new Date(),
        },
      });

      return disposal;
    });
  }

  findAll() {
    return this.prisma.assetDisposal.findMany();
  }

  findOne(id: string) {
    return this.prisma.assetDisposal.findUnique({ where: { id } });
  }

  update(id: string, updateDto: UpdateAssetDisposalDto) {
    const { disposalDate, value, ...rest } = updateDto;
    return this.prisma.assetDisposal.update({
      where: { id },
      data: {
        ...rest,
        disposalDate: disposalDate ? new Date(disposalDate) : undefined,
        value: value ? new Prisma.Decimal(value) : undefined,
      },
    });
  }

  remove(id: string) {
    return this.prisma.assetDisposal.delete({ where: { id } });
  }
}
