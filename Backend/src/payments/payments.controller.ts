import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'; // <-- Pake FileInterceptor biasa
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('proof_of_transfer', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            file.fieldname + '-' + uniqueSuffix + extname(file.originalname),
          );
        },
      }),
    }),
  )
  async uploadPayment(
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File, 
  ) {
    if (!body.invoice_number) {
      throw new BadRequestException('Nomor Invoice wajib diisi!');
    }

    if (!file) {
      throw new BadRequestException('Bukti transfer wajib diunggah!');
    }

    return this.paymentsService.processPayment(body, file);
  }

  @Post('validate')
  async validatePayment(@Body() body: any) {
    if (!body.invoice_number || !body.status) {
      throw new BadRequestException('Nomor Invoice dan Status wajib diisi!');
    }
    return this.paymentsService.validatePayment(body);
  }
}
