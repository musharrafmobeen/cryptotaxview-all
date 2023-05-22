import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../config/database/database.module';
import { InvoiceService } from './invoice.service';
import { InvoiceRepository } from './invoice.repository';
import { invoiceProviders } from './invoice.providers';
import { InvoiceController } from './invoice.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [InvoiceController],
  providers: [InvoiceService, InvoiceRepository, ...invoiceProviders],
  exports: [InvoiceService, InvoiceRepository, ...invoiceProviders],
})
export class InvoiceModule {}
