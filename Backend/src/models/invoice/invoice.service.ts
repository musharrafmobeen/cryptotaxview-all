import { Injectable } from '@nestjs/common';
import { InvoiceRepository } from './invoice.repository';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Injectable()
export class InvoiceService {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  create(createInvoiceDto: CreateInvoiceDto) {
    return this.invoiceRepository.create(createInvoiceDto);
  }

  findAll() {
    return this.invoiceRepository.findAll();
  }

  findOne(id: string) {
    return this.invoiceRepository.findOne(id);
  }

  findByUserID(id: string) {
    return this.invoiceRepository.findByUserId(id);
  }

  findOneByUserIdAndFiscalYear(id: string) {
    return this.invoiceRepository.findOneByUserIdAndFiscalYear(id);
  }

  update(id: string, updateInvoiceDto: UpdateInvoiceDto) {
    return this.invoiceRepository.update(id, updateInvoiceDto);
  }

  remove(id: string) {
    return this.invoiceRepository.remove(id);
  }
}
