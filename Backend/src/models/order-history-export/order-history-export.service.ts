import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
import { CreateOrderHistoryExportDto } from './dto/create-order-history-export.dto';
import { UpdateOrderHistoryExportDto } from './dto/update-order-history-export.dto';
// import { OrderHistoryExport } from './entities/order-history-export.entity';
import { OrderHistoryExportRepository } from './order-history-export.repository';

@Injectable()
export class OrderHistoryExportService {
  constructor(
    private readonly orderHistoryExportRepository: OrderHistoryExportRepository,
  ) {}

  createOrderHistoryExport(
    createOrderHistoryExportDto: CreateOrderHistoryExportDto,
  ) {
    return this.orderHistoryExportRepository.createOrderHistoryExports(
      createOrderHistoryExportDto,
    );
  }

  updateOrderHistoryExport(
    orderId: string,
    updateOrderHistoryExportDto: UpdateOrderHistoryExportDto,
  ) {
    return this.orderHistoryExportRepository.updateOrderHistoryExport(
      orderId,
      updateOrderHistoryExportDto,
    );
  }

  getOrderHistoryExports() {
    return this.orderHistoryExportRepository.getOrderHistoryExports();
  }
}
