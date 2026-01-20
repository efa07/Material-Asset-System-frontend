import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';

@Injectable()
export class AssetsService {
    constructor(private prisma: PrismaService) { }

    create(createAssetDto: CreateAssetDto) {
        return this.prisma.asset.create({ data: createAssetDto });
    }

    findAll() {
        return this.prisma.asset.findMany({
            include: { category: true, store: true, shelf: true }
        });
    }

    findOne(id: string) {
        return this.prisma.asset.findUnique({
            where: { id },
            include: { category: true, store: true, shelf: true, assignments: true }
        });
    }

    update(id: string, updateAssetDto: UpdateAssetDto) {
        return this.prisma.asset.update({ where: { id }, data: updateAssetDto });
    }

    remove(id: string) {
        return this.prisma.asset.delete({ where: { id } });
    }
}
