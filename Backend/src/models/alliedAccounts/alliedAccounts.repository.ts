import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateAlliedaccountsDto } from './dto/create-alliedAccounts.dto';
import { UpdateAlliedaccountsDto } from './dto/update-alliedAccounts.dto';
import { Alliedaccounts } from './entities/alliedAccounts.entity';

@Injectable()
export class AlliedaccountsRepository {
  constructor(
    @Inject('ALLIEDACCOUNTS_REPOSITORY')
    private alliedAccountsRepository: Repository<Alliedaccounts>,
  ) {}

  async create(createAlliedaccountsDto: CreateAlliedaccountsDto) {
    return await this.alliedAccountsRepository.save(createAlliedaccountsDto);
  }

  async findAll(userID: string) {
    const accounts = await this.alliedAccountsRepository.find({
      where: { userID, active: true },
    });

    return accounts;
  }

  async findAllAccounts(userID: string, alliedAccountRepository) {
    console.log('userID', userID, alliedAccountRepository);
    const accounts = await alliedAccountRepository.find({
      where: { userID, active: true },
    });

    console.log('length', accounts.length);
    return accounts;
  }

  async findOne(userID: string, accountAddress: string) {
    return await this.alliedAccountsRepository.findOne({
      where: { userID, accountAddress },
    });
  }

  async update(
    userID: string,
    id: string,
    updateAlliedaccountsDto: UpdateAlliedaccountsDto,
  ) {
    const alliedAccounts = await this.alliedAccountsRepository.findOne({
      where: { id, userID },
    });

    if (!alliedAccounts) {
      throw new HttpException('alliedAccounts not found', HttpStatus.NOT_FOUND);
    }

    return this.alliedAccountsRepository.save({
      ...alliedAccounts, // existing fields
      ...updateAlliedaccountsDto, // updated fields
    });
  }

  async remove(id: string) {
    return await this.alliedAccountsRepository.delete({ id });
  }
}
