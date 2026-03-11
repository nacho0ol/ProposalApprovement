import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { pool } from '../db';
@Injectable()
export class StatisticsService {
  async getRegionsData() {
    try {
      const [rows]: any = await pool.query(`
        SELECT r.name as region, COUNT(i.id) as total
        FROM regions r
        LEFT JOIN institutions i ON r.id = i.region_id
        GROUP BY r.id
        HAVING total > 0
        ORDER BY total DESC
      `);

      if (rows.length === 0) return [];

      const maxTotal = rows[0].total;

      const formattedData = rows.map((row: any) => ({
        region: row.region,
        total: row.total,
        percentage: parseFloat(((row.total / maxTotal) * 100).toFixed(2)),
      }));

      return formattedData;
    } catch (error) {
      console.error('Error get statistics:', error);
      throw new InternalServerErrorException(
        'Gagal mengambil data statistik wilayah.',
      );
    }
  }
}
