import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
// import {
//   createOrderHistoryExportSchema,
//   updateOrderHistoryExportSchema,
// } from 'src/common/contants/joi-validation-schemas';
// import { JoiValidationPipe } from 'src/common/pipes/validation.pipe';
import { CreateOrderHistoryExportDto } from './dto/create-order-history-export.dto';
import { UpdateOrderHistoryExportDto } from './dto/update-order-history-export.dto';
import { OrderHistoryExportService } from './order-history-export.service';

@Controller('order-history-export')
export class OrderHistoryExportController {
  constructor(
    private readonly orderHistoryExportsService: OrderHistoryExportService,
  ) {}

  @Post()
  createOrderHistoryExport(
    @Body()
    createOrderHistoryExportDto: CreateOrderHistoryExportDto,
  ) {
    return this.orderHistoryExportsService.createOrderHistoryExport(
      createOrderHistoryExportDto,
    );
  }

  @Patch(':id')
  updateOrderHistoryExport(
    @Param('id') orderId: string,
    @Body()
    updateOrderHistoryExportDto: UpdateOrderHistoryExportDto,
  ) {
    return this.orderHistoryExportsService.updateOrderHistoryExport(
      orderId,
      updateOrderHistoryExportDto,
    );
  }

  @Get()
  getOrderHistoryExports() {
    return this.orderHistoryExportsService.getOrderHistoryExports();
  }
}
