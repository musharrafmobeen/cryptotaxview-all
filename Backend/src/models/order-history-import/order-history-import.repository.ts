import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateOrderHistoryImportDto } from './dto/create-order-history-import.dto';
import { UpdateOrderHistoryImportDto } from './dto/update-order-history-import.dto';
import { OrderHistoryImport } from './entities/order-history-import.entity';

@Injectable()
export class OrderHistoryImportRepository {
  constructor(
    @Inject('ORDERHISTORYIMPORT_REPOSITORY')
    private orderHistoryImportRepository: Repository<OrderHistoryImport>,
  ) {}

  async createOrderHistoryImports(
    createOrderHistoryImportDto: CreateOrderHistoryImportDto,
  ) {
    return await this.orderHistoryImportRepository.save({
      ...createOrderHistoryImportDto,
    });
  }

  async lookUpOrderHistoryImport(orderId: string) {
    const order = await this.orderHistoryImportRepository.findOne({
      id: orderId,
    });
    return order;
  }

  async importOrderhistoryCsv(orderRecords: [CreateOrderHistoryImportDto]) {
    // return await this.orderHistoryImportRepository.save(orderRecords);
    // return await this.transactionService.create();
  }

  async getCsvData(userID: string) {
    return await this.orderHistoryImportRepository.find({ where: { userID } });
  }

  async updateOrderHistoryImport(
    orderId: string,
    updateOrderHistoryImportDto: UpdateOrderHistoryImportDto,
  ) {
    const orderHistoryImport = await this.lookUpOrderHistoryImport(orderId);
    if (!orderHistoryImport)
      throw new NotFoundException('No Order with given ID exists.');
    const result = await this.orderHistoryImportRepository.save({
      ...orderHistoryImport,
      ...updateOrderHistoryImportDto,
    });
    return result;
  }

  async getOrderHistoryImports() {
    const orderHistoryImports = await this.orderHistoryImportRepository.find();
    return orderHistoryImports;
  }

  async removeTransactions(ids: string[]) {
    const entities = await this.orderHistoryImportRepository.findByIds(ids);
    if (!entities) {
      throw new NotFoundException(
        `Some Entities not found, no changes applied!`,
      );
    }
    return this.orderHistoryImportRepository.remove(entities);
  }
}
