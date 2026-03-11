import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { pool } from '../db';

@Injectable()
export class PaymentsService {
  async processPayment(body: any, file: any) {
    try {
      const proofUrl = file.filename;

      const [result]: any = await pool.query(
        `UPDATE invoices 
        SET status = 'PENDING', proof_of_transfer = ? 
        WHERE invoice_number = ? AND status = 'UNPAID'`,
        [proofUrl, body.invoice_number],
      );

      if (result.affectedRows === 0) {
        throw new NotFoundException(
          'Invoice tidak ditemukan atau sudah dibayar/kadaluarsa.',
        );
      }

      return {
        message:
          'Pembayaran berhasil dikirim! Silakan tunggu validasi dari admin RJI.',
        invoice_number: body.invoice_number,
        file_struk: proofUrl,
      };
    } catch (error: any) {
      console.error('ERROR PAYMENT:', error.message);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Gagal memproses pembayaran.');
    }
  }

  async validatePayment(body: any) {
    try {
      const [result]: any = await pool.query(
        `UPDATE invoices SET status = ? WHERE invoice_number = ?`,
        [body.status, body.invoice_number],
      );

      if (result.affectedRows === 0) {
        throw new NotFoundException('Invoice tidak ditemukan.');
      }

      return {
        message: `Status tagihan ${body.invoice_number} sukses diubah menjadi ${body.status}!`,
      };
    } catch (error: any) {
      console.error('ERROR VALIDATION:', error.message);
      throw new InternalServerErrorException('Gagal memvalidasi pembayaran.');
    }
  }
}
