import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { pool } from '../db';

@Injectable()
export class InvoicesService {
  async getFeeCatalog() {
    try {
      const [rows]: any = await pool.query('SELECT * FROM fee_catalog');
      return rows;
    } catch (error) {
      throw new InternalServerErrorException(
        'Gagal mengambil data katalog harga',
      );
    }
  }

  async createInvoice(data: {
    institution_id: number;
    items: { fee_catalog_id: number; quantity: number }[];
  }) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const randomStr = Math.floor(1000 + Math.random() * 9000);
      const invoiceNumber = `INV-${dateStr}-${randomStr}`;

      
      const [invoiceResult]: any = await connection.query(
        `INSERT INTO invoices (institution_id, invoice_number, total_amount, status, due_date) 
         VALUES (?, ?, ?, 'UNPAID', DATE_ADD(NOW(), INTERVAL 40 DAY))`,
        [data.institution_id, invoiceNumber, 0],
      );

      const newInvoiceId = invoiceResult.insertId;
      let grandTotal = 0;

      for (const item of data.items) {
        const [feeRows]: any = await connection.query(
          `SELECT price_idr FROM fee_catalog WHERE id = ? LIMIT 1`,
          [item.fee_catalog_id],
        );

        if (feeRows.length === 0) {
          throw new BadRequestException(
            `Item dengan ID ${item.fee_catalog_id} tidak ditemukan di katalog`,
          );
        }

        const price = feeRows[0].price_idr;
        const subtotal = price * item.quantity;
        grandTotal += subtotal;

        await connection.query(
          `INSERT INTO invoice_items (invoice_id, fee_catalog_id, quantity, subtotal) 
           VALUES (?, ?, ?, ?)`,
          [newInvoiceId, item.fee_catalog_id, item.quantity, subtotal],
        );
      }

      await connection.query(
        `UPDATE invoices SET total_amount = ? WHERE id = ?`,
        [grandTotal, newInvoiceId],
      );

      await connection.commit();

      return {
        message: 'Invoice berhasil dibuat!',
        invoice_number: invoiceNumber,
        total_amount_idr: grandTotal,
        due_date_info: 'Batas waktu pembayaran adalah 40 hari dari sekarang.',
      };
    } catch (error: any) {
      await connection.rollback();
      console.error('ERROR INVOICE:', error.message);
      throw new BadRequestException(
        error.message || 'Gagal membuat tagihan. Pastikan data valid.',
      );
    } finally {
      connection.release();
    }
  }
}
