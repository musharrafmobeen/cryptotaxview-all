
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserplanService } from './userPlan.service';
import { CreateUserplanDto } from './dto/create-userPlan.dto';
import { UpdateUserplanDto } from './dto/update-userPlan.dto';

@Controller('userPlan')
export class UserplanController {
  constructor(private readonly userPlanService: UserplanService) {}

  @Post()
  create(@Body() createUserplanDto: CreateUserplanDto) {
    return this.userPlanService.create(createUserplanDto);
  }

  @Get()
  findAll() {
    return this.userPlanService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userPlanService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserplanDto: UpdateUserplanDto) {
    return this.userPlanService.update(id, updateUserplanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userPlanService.remove(id);
  }
} 
