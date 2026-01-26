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

    // Create disposal request in PENDING state
    // Do not update asset status or assignments yet
    return this.prisma.assetDisposal.create({
      data: {
        ...rest,
        disposalDate: disposalDate ? new Date(disposalDate) : undefined,
        value: value ? new Prisma.Decimal(value) : undefined,
        status: 'PENDING',
      },
    });
  }

  async approve(id: string) {
    return this.prisma.$transaction(async (tx) => {
      const disposal = await tx.assetDisposal.findUnique({ where: { id } });
      if (!disposal) throw new Error('Disposal request not found');
      if (disposal.status !== 'PENDING') return disposal;

      const updatedDisposal = await tx.assetDisposal.update({
        where: { id },
        data: { status: 'APPROVED' },
      });

      await tx.asset.update({
        where: { id: disposal.assetId },
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
          assetId: disposal.assetId,
          status: 'ACTIVE',
        },
        data: {
          status: 'RETURNED',
          returnedAt: new Date(),
        },
      });

      return updatedDisposal;
    });
  }

  async reject(id: string) {
    return this.prisma.assetDisposal.update({
      where: { id },
      data: { status: 'REJECTED' },
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
