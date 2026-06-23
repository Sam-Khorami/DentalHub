import { Body, Controller, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Permission } from '../decorators/permission.decorator';
import { JwtAuthGuard } from '../guards/jwtAuth.guard';
import { PermissionGuard } from '../guards/permission.guard';
import { CompleteProfileDto } from './dto/completeProfile.dto';
import { UpdateProfileDto } from './dto/updateProfile.dto';

@ApiTags("Profile Mangement")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('profile')
export class ProfileController {

  constructor(private readonly profileService: ProfileService) {}

  @Permission("profile:change")
  @Post("complete-profile")
  async completeProfile (@Body() data: CompleteProfileDto, @Req() request: Request) {

    await this.profileService.completeProfile(data, request);
    return { message: "Profile Completed Successfully!" }

  }

  @Permission("profile:change")
  @Put("update-profile")
  async updateProfile (@Body() data: UpdateProfileDto, @Req() request: Request) {

    await this.profileService.updateProfile(data, request);
    return { message: "Profile Updated Successfully!" }

  }

}
