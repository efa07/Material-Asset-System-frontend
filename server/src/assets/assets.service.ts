import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AssetsService {
    constructor(private prisma: PrismaService) { }

    create(createAssetDto: CreateAssetDto) {
        const { purchasePrice, purchaseDate, ...rest } = createAssetDto;
        return this.prisma.asset.create({
            data: {
                ...rest,
                purchasePrice: purchasePrice ? new Prisma.Decimal(purchasePrice) : undefined,
                purchaseDate: purchaseDate ? new Date(purchaseDate) : undefined,
            }
        });
    }

    findAll() {
        return this.prisma.asset.findMany({
            include: {
                category: true,
                store: true,
                shelf: true,
            }
        });
    }

    findOne(id: string) {
        return this.prisma.asset.findUnique({
            where: { id },
            include: {
                category: true,
                store: true,
                shelf: true,
            }
        });
    }

    update(id: string, updateAssetDto: UpdateAssetDto) {
        const { purchasePrice, purchaseDate, ...rest } = updateAssetDto;
        return this.prisma.asset.update({
            where: { id },
            data: {
                ...rest,
                purchasePrice: purchasePrice ? new Prisma.Decimal(purchasePrice) : undefined,
                purchaseDate: purchaseDate ? new Date(purchaseDate) : undefined,
            }
        });
    }

    remove(id: string) {
        return this.prisma.asset.delete({ where: { id } });
    }
}
