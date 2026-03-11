import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { pool } from '../db';

@Injectable()
export class ProfileService {
  async updatePic(body: any) {
    try {
      const [result]: any = await pool.query(
        `UPDATE users 
         SET full_name = ?, phone_primary = ? 
         WHERE id = ?`,
        [body.new_pic_name, body.new_pic_phone, body.user_id],
      );

      if (result.affectedRows === 0) {
        throw new NotFoundException('User tidak ditemukan.');
      }

      return {
        message: 'Berhasil ganti data PIC!',
        new_pic_name: body.new_pic_name,
      };
    } catch (error: any) {
      console.error('ERROR UPDATE PIC:', error.message);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Gagal mengubah data PIC.');
    }
  }
}
