import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { pool } from '../db';

@Injectable()
export class FeesService {
  async getAllFees() {
    try {
      const [rows]: any = await pool.query(
        'SELECT * FROM fee_catalog ORDER BY id ASC',
      );
      return rows;
    } catch (error) {
      console.error('Error get fees:', error);
      throw new InternalServerErrorException(
        'Gagal mengambil data katalog harga.',
      );
    }
  }
}
