import { PartialType } from '@nestjs/swagger';
import { CreateMetamaskDto } from './create-metamask.dto';

export class UpdateMetamaskDto extends PartialType(CreateMetamaskDto) {}
