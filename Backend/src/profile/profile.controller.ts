import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post('change-pic')
  async changePic(@Body() body: any) {
    if (!body.user_id || !body.new_pic_name || !body.new_pic_phone) {
      throw new BadRequestException(
        'Data user_id, new_pic_name, dan new_pic_phone wajib diisi!',
      );
    }

    return this.profileService.updatePic(body);
  }
}
