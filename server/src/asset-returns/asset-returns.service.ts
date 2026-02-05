import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssetReturnDto } from './dto/create-asset-return.dto';
import { UpdateAssetReturnDto } from './dto/update-asset-return.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { AssetStatus } from '@prisma/client';

@Injectable()
export class AssetReturnsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async create(createDto: CreateAssetReturnDto) {
    const { returnDate, userId, ...rest } = createDto;
    
    const assetReturn = await this.prisma.assetReturn.create({
      data: {
        ...rest,
        userId,
        status: 'PENDING',
        returnDate: returnDate ? new Date(returnDate) : undefined,
      },
      include: {
        asset: true,
        user: true,
      },
    });

    // Notify Store Managers
    const storeManagers = await this.prisma.user.findMany({
      where: { role: { name: 'STORE_MANAGER' } },
    });

    for (const manager of storeManagers) {
      await this.notificationsService.create({
        userId: manager.id,
        title: 'Asset Return Request',
        message: `User ${assetReturn.user?.firstName || 'Unknown'} requested to return ${assetReturn.asset.name}`,
        type: 'INFO',
      });
    }

    return assetReturn;
  }

  findAll() {
    return this.prisma.assetReturn.findMany({
      include: {
        asset: true,
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prisma.assetReturn.findUnique({
      where: { id },
      include: {
        asset: true,
        user: true,
      },
    });
  }

  async approve(id: string) {
    const assetReturn = await this.prisma.assetReturn.findUnique({
      where: { id },
      include: { asset: true },
    });

    if (!assetReturn) {
      throw new NotFoundException('Asset return request not found');
    }

    if (assetReturn.status !== 'PENDING') {
      throw new BadRequestException('Asset return request is already processed');
    }

    await this.prisma.$transaction(async (tx) => {
      // 1. Update Asset Return status
      await tx.assetReturn.update({
        where: { id },
        data: { status: 'APPROVED' },
      });

      // 2. Update Asset Assignment to RETURNED
      const activeAssignment = await tx.assetAssignment.findFirst({
        where: {
          assetId: assetReturn.assetId,
          status: 'ACTIVE',
        },
      });

      if (activeAssignment) {
        await tx.assetAssignment.update({
          where: { id: activeAssignment.id },
          data: {
            returnedAt: new Date(),
            status: 'RETURNED',
          },
        });
      }

      // 3. Update Asset to AVAILABLE
      await tx.asset.update({
        where: { id: assetReturn.assetId },
        data: {
          status: AssetStatus.AVAILABLE,
          assignedToUserId: null,
        },
      });
    });

    // 4. Notify User
    if (assetReturn.userId) {
      try {
        await this.notificationsService.create({
          userId: assetReturn.userId,
          title: 'Asset Return Approved',
          message: `Your return request for ${assetReturn.asset.name} has been approved.`,
          type: 'INFO',
        });
      } catch (error) {
        console.error('Failed to send notification', error);
      }
    }

    return { success: true };
  }

  update(id: string, updateDto: UpdateAssetReturnDto) {
    const { returnDate, ...rest } = updateDto;
    return this.prisma.assetReturn.update({
      where: { id },
      data: {
        ...rest,
        returnDate: returnDate ? new Date(returnDate) : undefined,
      },
    });
  }

  remove(id: string) {
    return this.prisma.assetReturn.delete({ where: { id } });
  }
}
