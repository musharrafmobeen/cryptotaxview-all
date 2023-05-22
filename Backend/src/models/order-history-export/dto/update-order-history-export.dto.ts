import { PartialType } from '@nestjs/swagger';
import { CreateOrderHistoryExportDto } from './create-order-history-export.dto';

export class UpdateOrderHistoryExportDto extends PartialType(
  CreateOrderHistoryExportDto,
) {}
