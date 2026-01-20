import { Injectable } from '@nestjs/common';
import { MockDbService } from '../common/mock-db.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';

@Injectable()
export class AssetsService {
    constructor(private mockDb: MockDbService) { }

    create(createAssetDto: CreateAssetDto) {
        return this.mockDb.create('assets', createAssetDto);
    }

    findAll() {
        return this.mockDb.findAll('assets');
    }

    findOne(id: string) {
        return this.mockDb.findOne('assets', +id);
    }

    update(id: string, updateAssetDto: UpdateAssetDto) {
        return this.mockDb.update('assets', +id, updateAssetDto);
    }  

    remove(id: string) {
        return this.mockDb.remove('assets', +id);
    }
}
