import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ReferralsService } from './referrals.service';
import { CreateReferralDto } from './dto/create-referral.dto';
import { UpdateReferralDto } from './dto/update-referral.dto';

@Controller('referrals')
export class ReferralsController {
  constructor(private readonly referralsService: ReferralsService) {}

  @Post()
  create(@Body() createReferralDto: CreateReferralDto) {
    // console.log('test')
    return this.referralsService.create(createReferralDto);
  }

  @Get()
  findAll(@Body('userID') userID: string) {
    return this.referralsService.findAll(userID);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.referralsService.findOne(+id);
  }

  @Patch()
  update(@Body('email') email: string) {
    return this.referralsService.update(email);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.referralsService.remove(+id);
  }
}
