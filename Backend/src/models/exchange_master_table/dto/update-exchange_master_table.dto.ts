import { PartialType } from '@nestjs/swagger';
import { CreateExchangeMasterTableDto } from './create-exchange_master_table.dto';

export class UpdateExchangeMasterTableDto extends PartialType(CreateExchangeMasterTableDto) {}
