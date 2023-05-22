import { PartialType } from '@nestjs/swagger';
import { CreateBitcoinDto } from './create-bitcoin.dto';

export class UpdateBitcoinDto extends PartialType(CreateBitcoinDto) {}
