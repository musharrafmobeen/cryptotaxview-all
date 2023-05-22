import { PartialType } from '@nestjs/swagger';
import { CreateOrderHistoryImportDto } from './create-order-history-import.dto';

export class UpdateOrderHistoryImportDto extends PartialType(
  CreateOrderHistoryImportDto,
) {}
