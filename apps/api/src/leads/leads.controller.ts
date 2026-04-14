import { Controller, Get, Post, Body, Param, Query, Req } from '@nestjs/common';
import { PagesService } from '../pages/pages.service';
import { CreateLeadDto } from './dto/create-lead.dto';

@Controller('leads')
export class LeadsController {
  // NOTE: uses PagesService directly for lead operations
  // LeadsService still exists but is not used by this controller
  constructor(private readonly pagesService: PagesService) {}

  @Get()
  findAll(@Query('brandId') brandId?: string, @Query('pageId') pageId?: string) {
    return this.pagesService.getLeads({ brandId, pageId });
  }

  @Get('stats/:brandId')
  getStats(@Param('brandId') brandId: string) {
    return this.pagesService.getLeadStats(brandId);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.pagesService.getLeadById(id);
  }

  @Post()
  create(@Body() dto: CreateLeadDto, @Query() query: Record<string, string>) {
    return this.pagesService.submitLead(dto, query);
  }
}
