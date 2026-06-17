import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SigninDto } from './dto/signin.dto';
import { OtpVerificationDto } from './dto/otpVerification.dto';


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


  @ApiOperation({ summary: "Signin", description: "With this api you can signin" })
  @Post("verify-otp")
  async otpVerification (@Body() data: OtpVerificationDto) {

    const token = await this.authService.otpVerification(data);
    return { message: "You are login now", token };

  }


}