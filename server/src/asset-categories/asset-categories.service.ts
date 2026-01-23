import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssetCategoryDto } from './dto/create-asset-category.dto';
import { UpdateAssetCategoryDto } from './dto/update-asset-category.dto';

@Injectable()
export class AssetCategoriesService {
  constructor(private prisma: PrismaService) {}

  create(createDto: CreateAssetCategoryDto) {
    return this.prisma.assetCategory.create({
      data: createDto,
    });
  }

  findAll() {
    return this.prisma.assetCategory.findMany({});
  }

  findOne(id: string) {
    return this.prisma.assetCategory.findUnique({
      where: { id },
    });
  }

  update(id: string, updateDto: UpdateAssetCategoryDto) {
    return this.prisma.assetCategory.update({
      where: { id },
      data: updateDto,
    });
  }

  remove(id: string) {
    return this.prisma.assetCategory.delete({
      where: { id },
    });
  }
}
