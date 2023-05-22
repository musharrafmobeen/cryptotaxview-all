
  import { PartialType } from '@nestjs/mapped-types';
import { CreateLedgersDto } from './create-ledgers.dto';

export class UpdateLedgersDto extends PartialType(CreateLedgersDto) {}
