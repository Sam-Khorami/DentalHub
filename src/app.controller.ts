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


  @ApiOperation({summary: "Upload File", description: "With this api you can upload files"})
  @ApiBearerAuth()
  @ApiConsumes("multipart/form-data")
  @ApiBody({

    schema: {

      type: "object",
      properties: {

        file: {

          type: "string",
          format: "binary"

        }

      }

    }

  })
  @UseInterceptors(

    FileInterceptor("file", {

      storage: diskStorage({ destination: "./uploads", filename(req, file, cb) {
        
        const now = Date.now();

        const uniqueName = `${now}-${Math.round(Math.random() * 1000)}${extname(file.originalname)}`;
        cb(null, uniqueName);

      }
    
    }),
    fileFilter:  (req, file, cb) => {

      const allowMimeTypes = ["image/png", "image/jpg", "image/jpeg", "application/pdf"]

      if (allowMimeTypes.includes(file.mimetype)) cb(null, true);
      else cb(new BadRequestException("Bad File Format Entered"), false);

    },
    limits: { fileSize: 10 * 1024 * 1024 }
      
    })

  )
  @Post("upload-file")
  async uploadFile (@UploadedFile() file: any) {

    if (!file) throw new BadRequestException("File didn't uploaded successfully!");

    return { filename: file.filename, originalName: file.originalname, mimetype: file.mimetype, size: file.size, path: `/uploads/${file.filename}` }

  }


}
