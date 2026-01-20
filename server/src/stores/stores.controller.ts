import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@ApiTags('stores')
@Controller('api/v1/stores')
export class StoresController {
    constructor(private readonly storesService: StoresService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new store' })
    @ApiResponse({ status: 201, description: 'Store created successfully' })
    create(@Body() createStoreDto: CreateStoreDto) {
        return this.storesService.create(createStoreDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all stores' })
    @ApiResponse({ status: 200, description: 'Returns all stores' })
    findAll() {
        return this.storesService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a store by ID' })
    @ApiResponse({ status: 200, description: 'Returns a store' })
    findOne(@Param('id') id: string) {
        return this.storesService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a store' })
    @ApiResponse({ status: 200, description: 'Store updated successfully' })
    update(@Param('id') id: string, @Body() updateStoreDto: UpdateStoreDto) {
        return this.storesService.update(id, updateStoreDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete a store' })
    @ApiResponse({ status: 204, description: 'Store deleted successfully' })
    remove(@Param('id') id: string) {
        return this.storesService.remove(id);
    }
}
