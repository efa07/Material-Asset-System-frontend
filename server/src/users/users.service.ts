import { Injectable } from '@nestjs/common';
import { MockDbService } from '../common/mock-db.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private mockDb: MockDbService) { }

  create(createUserDto: CreateUserDto) {
    return this.mockDb.create('users', createUserDto);
  }

  findAll() {
    return this.mockDb.findAll('users');
  }

  findOne(id: string) {
    return this.mockDb.findOne('users', id);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.mockDb.update('users', id, updateUserDto);
  }

  remove(id: string) {
    return this.mockDb.remove('users', id);
  }
}
