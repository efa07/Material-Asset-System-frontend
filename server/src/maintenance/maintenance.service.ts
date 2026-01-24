import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';
import { Prisma, MaintenanceStatus } from '@prisma/client';

@Injectable()
export class MaintenanceService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateMaintenanceDto) {
    const { cost, status, ...rest } = createDto;
    // Cast incoming DTO status to the Prisma enum to avoid enum type mismatch
    const statusEnum = status as unknown as MaintenanceStatus;
    
    return this.prisma.$transaction(async (tx) => {
      const maintenance = await tx.maintenanceRecord.create({
        data: {
          ...rest,
          status: statusEnum,
          cost: cost ? new Prisma.Decimal(cost) : undefined,
        },
      });

      if (statusEnum === MaintenanceStatus.IN_PROGRESS) {
        await tx.asset.update({
          where: { id: rest.assetId },
          data: {
            status: 'MAINTENANCE',
            assignedToUserId: null,
          },
        });

        // Close active assignments
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

      return maintenance;
    });
  }

  findAll() {
    return this.prisma.maintenanceRecord.findMany({
      include: {
        asset: true,
      },
      orderBy: { maintenanceDate: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prisma.maintenanceRecord.findUnique({
      where: { id },
      include: {
        asset: true,
      },
    });
  }

  async update(id: string, updateDto: UpdateMaintenanceDto) {
    const { cost, status, ...rest } = updateDto;
    // Cast incoming DTO status to the Prisma enum to avoid enum type mismatch
    const statusEnum = status as unknown as MaintenanceStatus;

    return this.prisma.$transaction(async (tx) => {
      const existingRecord = await tx.maintenanceRecord.findUnique({
        where: { id },
      });

      if (!existingRecord) {
        throw new NotFoundException(`Maintenance record with ID ${id} not found`);
      }

      const maintenance = await tx.maintenanceRecord.update({
        where: { id },
        data: {
          ...rest,
          status: statusEnum,
          cost: cost ? new Prisma.Decimal(cost) : undefined,
        },
      });

      // If status changed to IN_PROGRESS, update asset status
      if (statusEnum === MaintenanceStatus.IN_PROGRESS) {
        await tx.asset.update({
          where: { id: maintenance.assetId },
          data: {
            status: 'MAINTENANCE',
            assignedToUserId: null,
          },
        });

        await tx.assetAssignment.updateMany({
          where: {
            assetId: maintenance.assetId,
            status: 'ACTIVE',
          },
          data: {
            status: 'RETURNED',
            returnedAt: new Date(),
          },
        });
      } 
      else if (
        statusEnum === MaintenanceStatus.COMPLETED || 
        statusEnum === MaintenanceStatus.CANCELLED
      ) {
        const asset = await tx.asset.findUnique({
          where: { id: maintenance.assetId },
        });
        if (asset && asset.status === 'MAINTENANCE') {
          await tx.asset.update({
            where: { id: maintenance.assetId },
            data: { status: 'AVAILABLE' },
          });
        }
      }

      return maintenance;
    });
  }

  remove(id: string) {
    return this.prisma.maintenanceRecord.delete({ where: { id } });
  }
}
