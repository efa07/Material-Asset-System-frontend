import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateShelfDto } from './dto/create-shelf.dto';
import { UpdateShelfDto } from './dto/update-shelf.dto';

@Injectable()
export class ShelvesService {
  constructor(private prisma: PrismaService) {}

  create(createShelfDto: CreateShelfDto) {
    return this.prisma.shelf.create({
      data: createShelfDto,
    });
  }

  findAll() {
    return this.prisma.shelf.findMany({
      include: {
        store: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.shelf.findUnique({
      where: { id },
      include: {
        store: true,
      },
    });
  }

  update(id: string, updateShelfDto: UpdateShelfDto) {
    return this.prisma.shelf.update({
      where: { id },
      data: updateShelfDto,
    });
  }

  remove(id: string) {
    return this.prisma.shelf.delete({
      where: { id },
    });
  }
}
