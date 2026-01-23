import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssetDisposalDto } from './dto/create-asset-disposal.dto';
import { UpdateAssetDisposalDto } from './dto/update-asset-disposal.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AssetDisposalsService {
  constructor(private prisma: PrismaService) {}

  create(createDto: CreateAssetDisposalDto) {
    const { disposalDate, value, ...rest } = createDto;
    return this.prisma.assetDisposal.create({
      data: {
        ...rest,
        disposalDate: disposalDate ? new Date(disposalDate) : undefined,
        value: value ? new Prisma.Decimal(value) : undefined,
      },
    });
  }

  findAll() {
    return this.prisma.assetDisposal.findMany();
  }

  findOne(id: string) {
    return this.prisma.assetDisposal.findUnique({ where: { id } });
  }

  update(id: string, updateDto: UpdateAssetDisposalDto) {
    const { disposalDate, value, ...rest } = updateDto;
    return this.prisma.assetDisposal.update({
      where: { id },
      data: {
        ...rest,
        disposalDate: disposalDate ? new Date(disposalDate) : undefined,
        value: value ? new Prisma.Decimal(value) : undefined,
      },
    });
  }

  remove(id: string) {
    return this.prisma.assetDisposal.delete({ where: { id } });
  }
}
