import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Invoice } from './entities/invoice.entity';

@Injectable()
export class InvoiceRepository {
  constructor(
    @Inject('INVOICE_REPOSITORY')
    private invoiceRepository: Repository<Invoice>,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto) {
    return await this.invoiceRepository.save(createInvoiceDto);
  }

  async findAll() {
    return await this.invoiceRepository.find();
  }

  async findOne(id: string) {
    return await this.invoiceRepository.findOne({ where: { id } });
  }

  async findByUserId(id: string) {
    return await this.invoiceRepository.find({ where: { user: id } });
  }

  async findOneByUserIdAndFiscalYear(id: string) {
    return await this.invoiceRepository.findOne({ where: { user: id } });
  }

  async update(id: string, updateInvoiceDto: UpdateInvoiceDto) {
    const invoice = await this.invoiceRepository.findOne({ where: { id } });

    if (!invoice) {
      throw new HttpException('invoice not found', HttpStatus.NOT_FOUND);
    }

    return this.invoiceRepository.save({
      ...invoice, // existing fields
      ...updateInvoiceDto, // updated fields
    });
  }

  async remove(id: string) {
    return await this.invoiceRepository.delete({ id });
  }
}
