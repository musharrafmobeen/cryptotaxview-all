import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateOrderHistoryExportDto } from './dto/create-order-history-export.dto';
import { UpdateOrderHistoryExportDto } from './dto/update-order-history-export.dto';
import { OrderHistoryExport } from './entities/order-history-export.entity';

@Injectable()
export class OrderHistoryExportRepository {
  constructor(
    @Inject('ORDERHISTORYEXPORT_REPOSITORY')
    private orderHistoryExportRepository: Repository<OrderHistoryExport>,
  ) {}

  async createOrderHistoryExports(
    createOrderHistoryExportDto: CreateOrderHistoryExportDto,
  ) {
    const orderHistoryExport = new OrderHistoryExport();
    orderHistoryExport.transactionDate =
      createOrderHistoryExportDto.transactionDate;
    orderHistoryExport.orderNo = createOrderHistoryExportDto.orderNo;
    orderHistoryExport.pair = createOrderHistoryExportDto.pair;
    orderHistoryExport.type = createOrderHistoryExportDto.type;
    orderHistoryExport.side = createOrderHistoryExportDto.side;
    orderHistoryExport.orderPrice = createOrderHistoryExportDto.orderPrice;
    orderHistoryExport.orderAmount = createOrderHistoryExportDto.orderAmount;
    orderHistoryExport.time = createOrderHistoryExportDto.time;
    orderHistoryExport.executed = createOrderHistoryExportDto.executed;
    orderHistoryExport.averagePrice = createOrderHistoryExportDto.averagePrice;
    orderHistoryExport.tradingTotal = createOrderHistoryExportDto.tradingTotal;
    orderHistoryExport.status = createOrderHistoryExportDto.status;
    return await this.orderHistoryExportRepository.save(orderHistoryExport);
  }

  async lookUpOrderHistoryExport(orderId: string) {
    const order = await this.orderHistoryExportRepository.findOne({
      id: orderId,
    });
    return order;
  }

  async updateOrderHistoryExport(
    orderId: string,
    updateOrderHistoryExportDto: UpdateOrderHistoryExportDto,
  ) {
    const orderHistoryExport = await this.lookUpOrderHistoryExport(orderId);
    if (!orderHistoryExport)
      throw new NotFoundException('No Order with given ID exists.');
    const result = await this.orderHistoryExportRepository.save({
      ...orderHistoryExport,
      ...updateOrderHistoryExportDto,
    });
    return result;
  }

  async getOrderHistoryExports() {
    const orderHistoryExports = await this.orderHistoryExportRepository.find();
    return orderHistoryExports;
  }
}
