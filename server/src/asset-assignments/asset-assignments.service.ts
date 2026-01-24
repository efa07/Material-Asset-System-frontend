import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssetAssignmentDto } from './dto/create-asset-assignment.dto';
import { UpdateAssetAssignmentDto } from './dto/update-asset-assignment.dto';

@Injectable()
export class AssetAssignmentsService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateAssetAssignmentDto) {
    const { dueDate, ...rest } = createDto;

    return this.prisma.$transaction(async (tx) => {
      const assignment = await tx.assetAssignment.create({
        data: {
          ...rest,
          dueDate: dueDate ? new Date(dueDate) : undefined,
        },
        include: {
          asset: true,
          user: true,
        },
      });

      if (assignment.status === 'ACTIVE') {
        // Close any existing active assignments for this asset
        await tx.assetAssignment.updateMany({
          where: {
            assetId: rest.assetId,
            status: 'ACTIVE',
            id: { not: assignment.id },
          },
          data: {
            status: 'RETURNED',
            returnedAt: new Date(),
          },
        });

        await tx.asset.update({
          where: { id: rest.assetId },
          data: {
            assignedToUserId: rest.userId,
            status: 'IN_USE',
          },
        });
      }

      return assignment;
    });
  }

  findAll() {
    return this.prisma.assetAssignment.findMany({
      include: {
        asset: true,
        user: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.assetAssignment.findUnique({
      where: { id },
      include: {
        asset: true,
        user: true,
      },
    });
  }

  async update(id: string, updateDto: UpdateAssetAssignmentDto) {
    const { dueDate, ...rest } = updateDto;

    return this.prisma.$transaction(async (tx) => {
      const assignment = await tx.assetAssignment.update({
        where: { id },
        data: {
          ...rest,
          dueDate: dueDate ? new Date(dueDate) : undefined,
        },
        include: {
          asset: true,
          user: true,
        },
      });

      if (assignment.status === 'ACTIVE') {
        await tx.asset.update({
          where: { id: assignment.assetId },
          data: {
            assignedToUserId: assignment.userId,
            status: 'IN_USE',
          },
        });
      } else if (
        assignment.status === 'RETURNED' ||
        assignment.status === 'COMPLETED'
      ) {
        await tx.asset.update({
          where: { id: assignment.assetId },
          data: {
            assignedToUserId: null,
            status: 'AVAILABLE',
          },
        });
      }

      return assignment;
    });
  }

  remove(id: string) {
    return this.prisma.assetAssignment.delete({
      where: { id },
    });
  }
}
