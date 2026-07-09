import { Body, Controller, Get, Post, Param, Req, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AdminService } from './admin.service';
import { RequestToAdminDto } from './dto/requestToAdmin.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwtAuth.guard';
import { PermissionGuard } from '../guards/permission.guard';
import { Permission } from '../decorators/permission.decorator';
import { AcceptRequestDto } from './dto/acceptRequest.dto';

@ApiTags("Admin Management")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('admin')
export class AdminController {
  
  constructor(private readonly adminService: AdminService) {}

  @Post("request-to-admin")
  async requestToAdmin (@Body() data: RequestToAdminDto, @Req() request: Request) {

    await this.adminService.requestToAdmin(data, request);
    return { message: "Your request has sent to admins" }

  }

  @Permission("request:read")
  @Get("pending-requests")
  async getPendingRequests () {

    const requests = await this.adminService.getPendingRequests();
    return { requests }

  }

  @Permission("request:read")
  @Get("requests")
  async getRequests () {

    const requests = await this.adminService.getRequests();
    return { requests }

  }

  @Permission("request:accept")
  @Post("accept-request/:userId")
  async acceptRequest (@Param("userId", ParseIntPipe) userId: number, @Body() data: AcceptRequestDto) {

    await this.adminService.acceptRequest(userId, data.role);
    return { message: "The request accepted successfully!" }

  }

}
