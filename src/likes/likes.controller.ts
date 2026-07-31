import { Controller, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { LikesService } from './likes.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwtAuth.guard';

@ApiTags("Likes Management")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('likes')
export class LikesController {
  
  constructor(private readonly likesService: LikesService) {}

  @Post("like-comment/:commentId")
  async likeComment (@Req() request: Request, @Param("commentId", ParseIntPipe) commentId: number) {

    await this.likesService.likeComment(request, commentId);
    return { message: "Your like set successfully" }

  }

}
