import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { RequestToAdminDto } from './dto/requestToAdmin.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwtAuth.guard';

@ApiTags("Admin Management")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('admin')
export class AdminController {
  
  constructor(private readonly adminService: AdminService) {}

  @Post("request-to-admin")
  async requestToAdmin (@Body() data: RequestToAdminDto, @Req() request: Request) {

    await this.adminService.requestToAdmin(data, request);
    return { message: "Your request has sent to admins" }

  }

}
