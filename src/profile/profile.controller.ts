import { BadRequestException, Body, Controller, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
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

    if (!image) throw new BadRequestException("Image didn't uploaded successfully!");
    await this.profileService.uploadProfile(image, request);
    return { message: "Profile uploaded successfully", profilePath: `http://localhost:${process.env.HOST_POST}/uploads/${image.filename}` }

  }


  @ApiOperation({summary: "Upload Licence", description: "With this api you can upload your Licences"})
  @ApiConsumes("multipart/form-data")
  @ApiBody({

    schema: {

      type: "object",
      properties: {

        licence: {

          type: "string",
          format: "binary"

        }

      }

    }

  })
  @UseInterceptors(

    FileInterceptor(

      "licence", {

        storage: diskStorage({ destination: "./uploads", filename(req, file, cb) {
          
          const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1000)}${extname(file.originalname)}`;
          cb (null, uniqueName);

        }, }),

        limits: { fileSize: 10 * 1024 * 1024 },
        fileFilter: (req, file, cb) => {

        const allowMimeTypes = ["image/png", "image/jpg", "image/jpeg", "application/pdf"];

        if (allowMimeTypes.includes(file.mimetype)) cb (null, true);
        else cb (new BadRequestException("Bad File Format"), false);

        }

      }

    )

  )
  @Permission("profile:change", "profile:upload", "profile:upload:licence")
  @Post("upload-licence")
  async uploadLicence (@UploadedFile() licence: Express.Multer.File, @Req() request: Request) {

    if (!licence) throw new BadRequestException("Licence didn't uploaded successfully!");
    await this.profileService.uploadLicence(licence, request);
    return { message: "The licence uploaded successfully!", licencePath: `http://localhost:${process.env.HOST_POST}/uploads/${licence.filename}` }

  }


  @ApiOperation({summary: "Upload Portfolio", description: "With this api you can upload your Portfolios"})
  @ApiConsumes("multipart/form-data")
  @ApiBody({

    schema: {

      type: "object",
      properties: {

        licence: {

          type: "string",
          format: "binary"

        }

      }

    }

  })
  @UseInterceptors(

    FileInterceptor(

      "portfolio", {

        storage: diskStorage({ destination: "./uploads", filename(req, file, cb) {
          
          const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1000)}${extname(file.originalname)}`;
          cb (null, uniqueName);

        }, }),

        limits: { fileSize: 10 * 1024 * 1024 },
        fileFilter: (req, file, cb) => {

        const allowMimeTypes = ["image/png", "image/jpg", "image/jpeg", "application/pdf"];

        if (allowMimeTypes.includes(file.mimetype)) cb (null, true);
        else cb (new BadRequestException("Bad File Format"), false);

        }

      }

    )

  )
  @Permission("profile:change", "profile:upload", "profile:upload:portfolio")
  @Post("upload-portfolio")
  async uploadPortfolio (@UploadedFile() portfolio: Express.Multer.File, @Req() request: Request) {

    if (!portfolio) throw new BadRequestException("Portfolio didn't uploaded successfully!");
    await this.profileService.uploadPortfolio(portfolio, request);
    return { message: "The portfolio uploaded successfully!", licencePath: `http://localhost:${process.env.HOST_POST}/uploads/${portfolio.filename}` }

  }


}
