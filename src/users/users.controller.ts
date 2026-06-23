import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwtAuth.guard';
import { Permission } from '../decorators/permission.decorator';
import { PermissionGuard } from '../guards/permission.guard';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';

@ApiTags("User Management")
@UseGuards(JwtAuthGuard, PermissionGuard)
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  
  constructor(private readonly usersService: UsersService) {}


  @ApiOperation({summary: "Getting Users", description: "With this api you can get the users"})
  @Permission("user:read")
  @Get("get-users")
  async getUsers () {

    const users = await this.usersService.getUsers();
    return { users }

  }

  @ApiOperation({summary: "Create User", description: "With this api you can create a user"})
  @Permission("user:create")
  @Post("create-user")
  async createUser (@Body() data: CreateUserDto) {

    await this.usersService.createUser(data);
    return { message: "User created successfully!" }

  }

  @ApiOperation({summary: "Update User", description: "With this api you can update a user"})
  @Permission("user:update")
  @Put("update-user/:userId")
  async updateUser (@Param("userId", ParseIntPipe) userId: number, @Body() data: UpdateUserDto, @Req() request: Request) {

    await this.usersService.updateUser(userId, data, request);
    return { message: "User updated successfully!" }

  }

  @ApiOperation({summary: "Delete User", description: "With this api you can delete a user"})
  @Permission("user:delete")
  @Delete("delete-user/:userId")
  async deleteUser (@Param("userId", ParseIntPipe) userId: number, @Req() request: Request) {

    await this.usersService.deleteUser(userId, request);
    return { message: "User deleted successfully!" }

  }

}
