import { PartialType } from '@nestjs/swagger';
import { CreateExchangePairDto } from './create-exchange-pair.dto';

export class UpdateExchangePairDto extends PartialType(CreateExchangePairDto) {}
