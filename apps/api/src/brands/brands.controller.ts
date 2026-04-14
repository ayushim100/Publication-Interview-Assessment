import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { Brand } from '@publication/shared';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Get()
  findAll() {
    return this.brandsService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.brandsService.findById(id);
  }

  @Post()
  create(@Body() dto: CreateBrandDto) {
    return this.brandsService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updates: Partial<Brand>) {
    return this.brandsService.update(id, updates);
  }

  @Delete(':id')
  @HttpCode(201)
  delete(@Param('id') id: string) {
    return this.brandsService.delete(id);
  }
}
