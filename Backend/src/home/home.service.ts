import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { pool } from '../db'; // Import koneksi database kita

@Injectable()
export class HomeService {
  // 1. Endpoint Summary Global
  async getSummary() {
    try {
      const [[publisherCount]]: any = await pool.query(
        'SELECT COUNT(*) as total FROM institutions',
      );

      const [[journalData]]: any = await pool.query(`
        SELECT 
          COUNT(*) as total_journals, 
          SUM(CASE WHEN is_accredited = 1 THEN 1 ELSE 0 END) as accredited_journals 
        FROM journals
      `);

      return {
        publisher_totals: publisherCount.total,
        journal_totals: journalData.total_journals || 0,
        accredited_journals: journalData.accredited_journals || 0,
        waive_totals: 5, // Data statis dari proposal
        similarity: 318, // Data statis dari proposal
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Gagal mengambil data summary');
    }
  }

  // 2. Endpoint Tipe Institusi
  async getInstitutionTypes() {
    try {
      const [rows]: any = await pool.query(`
        SELECT institution_type as name, COUNT(*) as value 
        FROM institutions 
        GROUP BY institution_type
        ORDER BY value DESC
      `);
      return rows;
    } catch (error) {
      throw new InternalServerErrorException(
        'Gagal mengambil data tipe institusi',
      );
    }
  }

  // 3. Endpoint Persebaran Peta (Region)
  async getRegionStats() {
    try {
      // Query ini akan me-return format JSON yang siap dibaca oleh library peta di Next.js (react-simple-maps)
      const [rows]: any = await pool.query(`
        SELECT r.name, r.iso_code as id, COUNT(i.id) as value
        FROM regions r
        LEFT JOIN institutions i ON r.id = i.region_id
        GROUP BY r.id, r.name, r.iso_code
        HAVING value > 0
        ORDER BY value DESC
      `);
      return rows;
    } catch (error) {
      throw new InternalServerErrorException(
        'Gagal mengambil data peta wilayah',
      );
    }
  }
}
