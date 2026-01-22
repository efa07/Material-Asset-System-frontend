import { Injectable } from '@nestjs/common';
import { MockDbService } from '../common/mock-db.service';
import { CreateAssetCategoryDto } from './dto/create-asset-category.dto';
import { UpdateAssetCategoryDto } from './dto/update-asset-category.dto';

@Injectable()
export class AssetCategoriesService {
  constructor(private mockDb: MockDbService) {}

  create(createDto: CreateAssetCategoryDto) {
    return this.mockDb.create('categories', createDto);
  }

  findAll() {
    return this.mockDb.findAll('categories');
  }

  findOne(id: string) {
    return this.mockDb.findOne('categories', id);
  }

  update(id: string, updateDto: UpdateAssetCategoryDto) {
    return this.mockDb.update('categories', id, updateDto);
  }

  remove(id: string) {
    return this.mockDb.remove('categories', id);
  }
}
