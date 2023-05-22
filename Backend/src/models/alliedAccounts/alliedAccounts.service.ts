import { Injectable } from '@nestjs/common';
import { AlliedaccountsRepository } from './alliedAccounts.repository';
import { CreateAlliedaccountsDto } from './dto/create-alliedAccounts.dto';
import { UpdateAlliedaccountsDto } from './dto/update-alliedAccounts.dto';

@Injectable()
export class AlliedaccountsService {
  constructor(
    private readonly alliedAccountsRepository: AlliedaccountsRepository,
  ) {}

  create(createAlliedaccountsDto: CreateAlliedaccountsDto) {
    return this.alliedAccountsRepository.create(createAlliedaccountsDto);
  }

  findAll(userID: string) {
    return this.alliedAccountsRepository.findAll(userID);
  }

  findOne(userID: string, accountAddress: string) {
    return this.alliedAccountsRepository.findOne(userID, accountAddress);
  }

  update(
    userID: string,
    id: string,
    updateAlliedaccountsDto: UpdateAlliedaccountsDto,
  ) {
    return this.alliedAccountsRepository.update(
      userID,
      id,
      updateAlliedaccountsDto,
    );
  }

  remove(id: string) {
    return this.alliedAccountsRepository.remove(id);
  }
}
