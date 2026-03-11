import { Controller, Get } from '@nestjs/common';
import { FeesService } from './fees.service';

@Controller('fees')
export class FeesController {
  constructor(private readonly feesService: FeesService) {}

  @Get()
  async getFees() {
    return this.feesService.getAllFees();
  }
}
