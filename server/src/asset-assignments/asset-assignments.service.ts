import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssetAssignmentDto } from './dto/create-asset-assignment.dto';
import { UpdateAssetAssignmentDto } from './dto/update-asset-assignment.dto';

@Injectable()
export class AssetAssignmentsService {
  constructor(private prisma: PrismaService) { }

  create(createDto: CreateAssetAssignmentDto) {
    const { dueDate, ...rest } = createDto;
    return this.prisma.assetAssignment.create({
      data: {
        ...rest,
        dueDate: dueDate ? new Date(dueDate) : undefined,
      },
      include: {
        asset: true,
        user: true,
      }
    });
  }

  findAll() {
    return this.prisma.assetAssignment.findMany({
      include: {
        asset: true,
        user: true,
      }
    });
  }

  findOne(id: string) {
    return this.prisma.assetAssignment.findUnique({
      where: { id },
      include: {
        asset: true,
        user: true,
      }
    });
  }

  update(id: string, updateDto: UpdateAssetAssignmentDto) {
    const { dueDate, ...rest } = updateDto;
    return this.prisma.assetAssignment.update({
      where: { id },
      data: {
        ...rest,
        dueDate: dueDate ? new Date(dueDate) : undefined,
      },
      include: {
        asset: true,
        user: true,
      }
    });
  }

  remove(id: string) {
    return this.prisma.assetAssignment.delete({
      where: { id },
    });
  }
}
