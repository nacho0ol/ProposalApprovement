import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { pool } from '../db'; // Pastikan file src/db.ts sudah kamu buat ya!

@Injectable()
export class AuthService {
  // Fungsi bikin password random 8 karakter
  private generateRandomPassword(): string {
    const chars =
      'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  async register(data: any) {
    try {
      // 1. Generate Password Asli & Versi Hash
      const plainPassword = this.generateRandomPassword();
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(plainPassword, salt);

      // 2. Insert ke tabel institutions (RAW SQL)
      const [instResult]: any = await pool.query(
        `INSERT INTO institutions (name, institution_type, address, region_id, coffee_contribution) 
         VALUES (?, ?, ?, ?, ?)`,
        [
          data.institution_name,
          data.institution_type,
          data.institution_address,
          data.region_id || null,
          data.coffee_contribution || '0',
        ],
      );

      // Ambil ID institusi yang baru saja terbuat
      const newInstitutionId = instResult.insertId;

      // 3. Insert ke tabel users (RAW SQL)
      await pool.query(
        `INSERT INTO users 
         (institution_id, full_name, email_primary, email_other, email_institution, phone_primary, phone_other, password_hash, know_rji_from, is_rji_member) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          newInstitutionId,
          data.full_name,
          data.email_primary,
          data.email_other || null,
          data.email_institution,
          data.phone_primary,
          data.phone_other || null,
          hashedPassword,
          data.know_rji_from || null,
          data.is_rji_member || false,
        ],
      );

      // 4. SIMULASI KIRIM EMAIL KE TERMINAL
      console.log('\n=========================================');
      console.log(`📧 MENGIRIM EMAIL KE: ${data.email_primary}`);
      console.log(`Subject: Account Register Verification`);
      console.log(`Halo ${data.full_name},`);
      console.log(`Registrasi berhasil! Berikut adalah akses login kamu:`);
      console.log(`Username: ${data.email_primary}`);
      console.log(`Password: ${plainPassword}`);
      console.log('=========================================\n');

      return {
        message:
          'Registrasi berhasil! Silakan cek email untuk melihat password login.',
        password_sementara_buat_testing: plainPassword,
      };
    } catch (error: any) {
      console.error('ERROR DB:', error.message);
      throw new BadRequestException(
        'Gagal registrasi. Pastikan data sesuai dengan constraint database!',
      );
    }
  }

  async login(email: string, pass: string) {
    // Cari user berdasarkan email (RAW SQL)
    const [rows]: any = await pool.query(
      `SELECT * FROM users WHERE email_primary = ? LIMIT 1`,
      [email],
    );

    const user = rows[0];

    if (!user) {
      throw new UnauthorizedException('Email tidak ditemukan');
    }

    // Bandingkan password teks dengan hash di database
    const isMatch = await bcrypt.compare(pass, user.password_hash);
    if (!isMatch) {
      throw new UnauthorizedException('Password salah');
    }

    return {
      message: 'Login sukses!',
      userId: user.id,
      institutionId: user.institution_id,
    };
  }
}
