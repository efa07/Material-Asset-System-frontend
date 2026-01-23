import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssetReturnDto } from './dto/create-asset-return.dto';
import { UpdateAssetReturnDto } from './dto/update-asset-return.dto';

@Injectable()
export class AssetReturnsService {
  constructor(private prisma: PrismaService) {}

  create(createDto: CreateAssetReturnDto) {
    const { returnDate, ...rest } = createDto;
    return this.prisma.assetReturn.create({
      data: {
        ...rest,
        returnDate: returnDate ? new Date(returnDate) : undefined,
      },
    });
  }

  findAll() {
    return this.prisma.assetReturn.findMany();
  }

  findOne(id: string) {
    return this.prisma.assetReturn.findUnique({ where: { id } });
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
