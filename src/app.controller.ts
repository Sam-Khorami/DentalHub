import { BadRequestException, Controller, Get, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from "multer";
import { extname } from 'path';
import { JwtAuthGuard } from './guards/jwtAuth.guard';
import { existsSync, mkdirSync } from 'fs';

@ApiTags("App Management")
@UseGuards(JwtAuthGuard)
@Controller()
export class AppController {
  
  constructor(private readonly appService: AppService) {

    if (!existsSync("./uploads")) {

      mkdirSync("./uploads", { recursive: true });

    }

  }

  
  @Get()
  getHello(): string {
  
    return this.appService.getHello();
  
  }


}
