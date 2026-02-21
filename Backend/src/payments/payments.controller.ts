import {
  Controller,
  Post,
  Body,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('upload')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'proof_of_transfer', maxCount: 1 },
        { name: 'assignment_letter', maxCount: 1 },
      ],
      {
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
      },
    ),
  )
  async uploadPayment(
    @Body() body: any,
    @UploadedFiles()
    files: {
      proof_of_transfer?: Express.Multer.File[];
      assignment_letter?: Express.Multer.File[];
    },
  ) {
    if (!body.invoice_number) {
      throw new BadRequestException('Nomor Invoice wajib diisi!');
    }
    if (!files.proof_of_transfer || !files.assignment_letter) {
      throw new BadRequestException(
        'Bukti transfer dan Surat Tugas wajib diunggah!',
      );
    }

    return this.paymentsService.processPayment(body, files);
  }
  @Post('validate')
  async validatePayment(@Body() body: any) {
    if (!body.invoice_number || !body.status) {
      throw new BadRequestException('Nomor Invoice dan Status wajib diisi!');
    }
    return this.paymentsService.validatePayment(body);
  }
}
