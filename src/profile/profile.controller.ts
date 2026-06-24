import { BadRequestException, Body, Controller, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Permission } from '../decorators/permission.decorator';
import { JwtAuthGuard } from '../guards/jwtAuth.guard';
import { PermissionGuard } from '../guards/permission.guard';
import { CompleteProfileDto } from './dto/completeProfile.dto';
import { UpdateProfileDto } from './dto/updateProfile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from "multer";
import { extname } from 'path';
import { Express } from "express";
import { existsSync, mkdirSync } from 'fs';

@ApiTags("Profile Mangement")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('profile')
export class ProfileController {

  constructor(private readonly profileService: ProfileService) {

    if (!existsSync("./uploads")) {

      mkdirSync("./uploads", { recursive: true });

    }

  }

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

  @ApiConsumes("multipart/form-data")
  @ApiBody({

    schema: {

      type: "object",
      properties: {

        image: {

          type: "string",
          format: "binary"

        }

      }

    }

  })
  @UseInterceptors(
    
    FileInterceptor(

      "image", {

        storage: diskStorage({ destination: "./uploads", filename(req, file, cb) {
          
          const uniqueFileName = `${Date.now()}-${Math.round(Math.random() * 1000)}${extname(file.originalname)}`;
          cb(null, uniqueFileName);

        }, }),
        limits: { fileSize: 10 * 1024 * 1024 },
        fileFilter: (req, file, cb) => {

          const allowMimeTypes = ["image/png", "image/jpg", "image/jpeg"];

          if (allowMimeTypes.includes(file.mimetype)) cb (null, true);
          else cb(new BadRequestException("Bad File Format Entered"), false);

        }

      }

    )
  
  
  )
  @Permission("profile:change", "profile:upload")
  @Post("upload-profile")
  async uploadProfile (@UploadedFile() image: Express.Multer.File, @Req() request: Request) {

    if (!image) throw new BadRequestException("File didn't uploaded successfully!");
    await this.profileService.uploadProfile(image, request);
    return { message: "Profile uploaded successfully", profilePath: `http://localhost:${process.env.HOST_POST}/uploads/${image.filename}` }

  }


}
