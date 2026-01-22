import { Injectable } from '@nestjs/common';
import { MockDbService } from '../common/mock-db.service';
import { CreateShelfDto } from './dto/create-shelf.dto';
import { UpdateShelfDto } from './dto/update-shelf.dto';

@Injectable()
export class ShelvesService {
    constructor(private mockDb: MockDbService) { }

    create(createShelfDto: CreateShelfDto) {
        return this.mockDb.create('shelves', createShelfDto);
    }

    findAll() {
        return this.mockDb.findAll('shelves');
    }

    findOne(id: string) {
        return this.mockDb.findOne('shelves', id);
    }

    update(id: string, updateShelfDto: UpdateShelfDto) {
        return this.mockDb.update('shelves', id, updateShelfDto);
    }

    remove(id: string) {
        return this.mockDb.remove('shelves', id);
    }
}
