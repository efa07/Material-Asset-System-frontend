import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class MaintenanceService {
  constructor(private prisma: PrismaService) {}

  create(createDto: CreateMaintenanceDto) {
    const { cost, ...rest } = createDto;
    return this.prisma.maintenanceRecord.create({
      data: {
        ...rest,
        cost: cost ? new Prisma.Decimal(cost) : undefined,
      },
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

  update(id: string, updateDto: UpdateMaintenanceDto) {
    const { cost, ...rest } = updateDto;
    return this.prisma.maintenanceRecord.update({
      where: { id },
      data: {
        ...rest,
        cost: cost ? new Prisma.Decimal(cost) : undefined,
      },
    });
  }

  remove(id: string) {
    return this.prisma.maintenanceRecord.delete({ where: { id } });
  }
}
