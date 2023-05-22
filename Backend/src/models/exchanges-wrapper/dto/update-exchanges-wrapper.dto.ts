import { PartialType } from '@nestjs/swagger';
import { CreateExchangesWrapperDto } from './create-exchanges-wrapper.dto';

export class UpdateExchangesWrapperDto extends PartialType(CreateExchangesWrapperDto) {}
