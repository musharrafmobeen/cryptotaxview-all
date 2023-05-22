
  import { PartialType } from '@nestjs/mapped-types';
import { CreateAlliedaccountsDto } from './create-alliedAccounts.dto';

export class UpdateAlliedaccountsDto extends PartialType(CreateAlliedaccountsDto) {}
