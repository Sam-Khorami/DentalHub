import { Body, Controller, Get, Post, Param, Req, UseGuards, ParseIntPipe, Delete, Put } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwtAuth.guard';
import { PermissionGuard } from '../guards/permission.guard';
import { Permission } from '../decorators/permission.decorator';
import { AcceptRequestDto } from './dto/acceptRequest.dto';
import { AddCategoryDto } from './dto/addCategory.dto';
import { UpdateCategoryDto } from './dto/updateCategory.dto';

@ApiTags("Admin Management")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('admin')
export class AdminController {
  
  constructor(private readonly adminService: AdminService) {}

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

  @Permission("request:reject")
  @Post("reject-request/:userId")
  async rejectRequest (@Param("userId", ParseIntPipe) userId: number) {

    await this.adminService.rejectRequest(userId);
    return { message: "The request rejected successfully!" }

  }

  @Permission("category:create")
  @Post("add-category")
  async addCategory (@Body() data: AddCategoryDto) { 

    await this.adminService.addCategory(data);
    return { message: "The category created successfully!" }

  }

  @Permission("category:delete")
  @Delete("delete-category/:categoryId")
  async deleteCategory (@Param("categoryId", ParseIntPipe) categoryId: number) {

    await this.adminService.deleteCategory(categoryId);
    return { message: "The category deleted successfully!" }

  }

  @Permission("category:update")
  @Put("update-category/:categoryId")
  async updateCategory (@Param("categoryId", ParseIntPipe) categoryId: number, @Body() data: UpdateCategoryDto) {

    await this.adminService.updateCategory(categoryId, data);
    return { message: "Category updated successfully!" }

  }

  @Permission("category:read")
  @Get("get-categories")
  async getCategory () {

    const categories = await this.adminService.getCategories();
    return { categories }

  }

}
