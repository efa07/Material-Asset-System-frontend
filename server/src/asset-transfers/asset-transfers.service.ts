import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssetTransferDto } from './dto/create-asset-transfer.dto';
import { UpdateAssetTransferDto } from './dto/update-asset-transfer.dto';

@Injectable()
export class AssetTransfersService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateAssetTransferDto) {
    const { transferDate, ...rest } = createDto;

    return this.prisma.$transaction(async (tx) => {
      const transfer = await tx.assetTransfer.create({
        data: {
          ...rest,
          transferDate: transferDate ? new Date(transferDate) : undefined,
        },
      });

      // Only update the asset location if the transfer is COMPLETED
      // If status is undefined, Prisma uses default "COMPLETED", so we treat undefined as COMPLETED too or check the result
      const isCompleted = !rest.status || rest.status === 'COMPLETED';

      if (createDto.toStoreId && isCompleted) {
        await tx.asset.update({
          where: { id: rest.assetId },
          data: {
            storeId: createDto.toStoreId,
            shelfId: null, // Reset shelf as it's in a new store
            status: 'AVAILABLE', 
            assignedToUserId: null,
          },
        });

        // Close any active assignments if moving to a store
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
      }

      return transfer;
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
