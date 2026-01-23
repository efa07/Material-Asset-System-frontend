import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ShelvesService } from './shelves.service';
import { CreateShelfDto } from './dto/create-shelf.dto';
import { UpdateShelfDto } from './dto/update-shelf.dto';

@ApiTags('shelves')
@Controller('api/v1/shelves')
export class ShelvesController {
  constructor(private readonly shelvesService: ShelvesService) {}

  @Post()
  @ApiOperation({ summary: 'Create shelf' })
  create(@Body() createShelfDto: CreateShelfDto) {
    return this.shelvesService.create(createShelfDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all shelves' })
  findAll() {
    return this.shelvesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get shelf by ID' })
  findOne(@Param('id') id: string) {
    return this.shelvesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update shelf' })
  update(@Param('id') id: string, @Body() updateShelfDto: UpdateShelfDto) {
    return this.shelvesService.update(id, updateShelfDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete shelf' })
  remove(@Param('id') id: string) {
    return this.shelvesService.remove(id);
  }
}
