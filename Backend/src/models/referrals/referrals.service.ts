import { Injectable } from '@nestjs/common';
import { CreateReferralDto } from './dto/create-referral.dto';
import { UpdateReferralDto } from './dto/update-referral.dto';
import { ReferralsRepository } from './referrals.repository';

@Injectable()
export class ReferralsService {
  constructor(private readonly referralRepository: ReferralsRepository) {}

  async create(createReferralDto: CreateReferralDto) {
    return await this.referralRepository.create(createReferralDto);
  }

  async findAll(userId: string) {
    return await this.referralRepository.findAll(userId);
  }

  async findAllByReferralCode(code: string) {
    return await this.referralRepository.findAllByReferralCode(code);
  }
  findOne(id: number) {
    return `This action returns a #${id} referral`;
  }

  update(email: string) {
    return this.referralRepository.updateReferral(email);
  }

  remove(id: number) {
    return `This action removes a #${id} referral`;
  }
}
