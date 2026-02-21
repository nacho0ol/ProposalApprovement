import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post('change-pic')
  @UseInterceptors(
    FileInterceptor('assignment_letter', {
      storage: diskStorage({
        destination: './uploads', // Masuk ke folder uploads yang sama
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
  async changePic(
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!body.user_id || !body.new_pic_name || !body.new_pic_phone) {
      throw new BadRequestException(
        'Data user_id, new_pic_name, dan new_pic_phone wajib diisi!',
      );
    }
    if (!file) {
      throw new BadRequestException('Surat Tugas (PDF) wajib diunggah!');
    }

    return this.profileService.updatePic(body, file);
  }
}
