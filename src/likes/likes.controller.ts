import { Controller, UseGuards } from '@nestjs/common';
import { LikesService } from './likes.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwtAuth.guard';

@ApiTags("Likes Management")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('likes')
export class LikesController {
  
  constructor(private readonly likesService: LikesService) {}


}
