import { Injectable } from '@nestjs/common';
import { MockDbService } from '../common/mock-db.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Injectable()
export class StoresService {
    constructor(private mockDb: MockDbService) { }

    async create(createStoreDto: CreateStoreDto) {
        return this.mockDb.create('stores', createStoreDto);
    }

    async findAll() {
        return this.mockDb.findAll('stores');
    }

    async findOne(id: string) {
        return this.mockDb.findOne('stores', id);
    }

    async update(id: string, updateStoreDto: UpdateStoreDto) {
        return this.mockDb.update('stores', id, updateStoreDto);
    }

    async remove(id: string) {
        return this.mockDb.remove('stores', id);
    }
}
