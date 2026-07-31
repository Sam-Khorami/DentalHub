import { Body, Controller, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwtAuth.guard';
import { SetCommentDto } from './dto/setComment.dto';


@ApiTags("Comments Management")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('comments')
export class CommentsController {
  
  constructor(private readonly commentsService: CommentsService) {}

  @Post("set-comment/:productId")
  async setComment (@Body() data: SetCommentDto, @Param("productId", ParseIntPipe) productId: number, @Req() request: Request) {

    await this.commentsService.setComment(data, request, productId);
    return { message: "Your comment set successfully!" }

  }

}
