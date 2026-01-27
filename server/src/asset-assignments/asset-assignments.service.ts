import { Injectable, BadRequestException, NotFoundException, Logger, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssetAssignmentDto } from './dto/create-asset-assignment.dto';
import { UpdateAssetAssignmentDto } from './dto/update-asset-assignment.dto';

@Injectable()
export class AssetAssignmentsService {
  private readonly logger = new Logger(AssetAssignmentsService.name);

  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateAssetAssignmentDto) {
    const { dueDate, status, ...rest } = createDto;
    const initialStatus = 'PENDING';

    try {
      return await this.prisma.$transaction(async (tx) => {
        const asset = await tx.asset.findUnique({ where: { id: rest.assetId } });
        if (!asset) {
          throw new NotFoundException('Asset not found');
        }

        const user = await tx.user.findUnique({ where: { id: rest.userId } });
        if (!user) {
          throw new NotFoundException('User not found');
        }

        if (asset.status === 'DISPOSED' || asset.status === 'RETIRED' || asset.status === 'LOST') {
          throw new BadRequestException(`Cannot assign asset with status ${asset.status}`);
        }

        const assignment = await tx.assetAssignment.create({
          data: {
            ...rest,
            status: initialStatus,
            dueDate: dueDate ? new Date(dueDate) : undefined,
          },
          include: {
            asset: true,
            user: true,
          },
        });

        if (assignment.status === 'ACTIVE') {
          // Close any other active assignments for the same asset
          await tx.assetAssignment.updateMany({
            where: {
              assetId: assignment.assetId,
              status: 'ACTIVE',
              id: { not: assignment.id },
            },
            data: {
              status: 'RETURNED',
              returnedAt: new Date(),
            },
          });

          await tx.asset.update({
            where: { id: assignment.assetId },
            data: {
              assignedToUserId: assignment.userId,
              status: 'IN_USE',
            },
          });
        }

        return assignment;
      }, {
        maxWait: 5000, // default: 2000
        timeout: 20000, // default: 5000
      });
    } catch (error) {
      this.logger.error(`Failed to create assignment: ${error.message}`, error.stack);
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create assignment due to server error');
    }
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
        // Close any other active assignments for the same asset
        await tx.assetAssignment.updateMany({
          where: {
            assetId: assignment.assetId,
            status: 'ACTIVE',
            id: { not: assignment.id },
          },
          data: {
            status: 'RETURNED',
            returnedAt: new Date(),
          },
        });

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
      } else if (assignment.status === 'PENDING' || assignment.status === 'REJECTED') {
        // Leave asset unchanged for pending/rejected states
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
