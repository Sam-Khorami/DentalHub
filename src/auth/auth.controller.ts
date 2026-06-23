import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SigninDto } from './dto/signin.dto';
import { OtpVerificationDto } from './dto/otpVerification.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../guards/jwtAuth.guard';


@ApiTags("Authentication Management")
@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: "Signup", description: "With this api you can signin" })
  @Post("signup")
  async signup (@Body() data: SigninDto) {

    await this.authService.signup(data);
    return { message: "Otp Sent For You Successfully!" }

  }

  @ApiOperation({ summary: "Login", description: "With this api you can login to your account" })
  @Post("login")
  async login (@Body() data: LoginDto, @Req() request: Request) {

    await this.authService.login(data, request);
    return { message: "Otp Code Sent For You Successfully!" }

  }

  @ApiOperation({ summary: "Logout", description: "With this api you can logout from your account" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post("logout")
  async logout (@Req() request: Request) {

    await this.authService.logout(request);
    return { message: "User is logged out now" }

  }


  @ApiOperation({ summary: "Signin", description: "With this api you can signin" })
  @Post("verify-otp")
  async otpVerification (@Body() data: OtpVerificationDto) {

    const token = await this.authService.otpVerification(data);
    return { message: "You are login now", token };

  }


  @ApiOperation({ summary: "Getting Permissions", description: "With this api you can get permissions" })
  @Get("get-permissions/:userId")
  async getPermissions (@Param("userId", ParseIntPipe) userId: number) {

    const permissions = await this.authService.getPermissions(userId);
    return { permissions };

  }

}