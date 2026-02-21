import { Controller, Get, Post, Body } from '@nestjs/common';
import { InvoicesService } from './invoices.service';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get('fees')
  async getFeeCatalog() {
    return this.invoicesService.getFeeCatalog();
  }

  @Post('create')
  async createInvoice(@Body() body: any) {
    return this.invoicesService.createInvoice(body);
  }
}
