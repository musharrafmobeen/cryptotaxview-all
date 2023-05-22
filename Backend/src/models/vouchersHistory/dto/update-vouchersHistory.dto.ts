
  import { PartialType } from '@nestjs/mapped-types';
import { CreateVouchershistoryDto } from './create-vouchersHistory.dto';

export class UpdateVouchershistoryDto extends PartialType(CreateVouchershistoryDto) {}
