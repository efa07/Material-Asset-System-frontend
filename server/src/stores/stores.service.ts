import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Injectable()
export class StoresService {
  constructor(private prisma: PrismaService) {}

  async create(createStoreDto: CreateStoreDto) {
    return this.prisma.store.create({
      data: createStoreDto,
    });
  }

  async findAll() {
    return this.prisma.store.findMany({
      include: {
        shelves: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.store.findUnique({
      where: { id },
      include: {
        shelves: true,
      },
    });
  }

  async update(id: string, updateStoreDto: UpdateStoreDto) {
    return this.prisma.store.update({
      where: { id },
      data: updateStoreDto,
    });
  }

  async remove(id: string) {
    return this.prisma.store.delete({
      where: { id },
    });
  }
}
