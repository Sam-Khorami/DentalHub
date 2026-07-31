import { Controller, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwtAuth.guard';


@ApiTags("Comments Management")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('comments')
export class CommentsController {
  
  constructor(private readonly commentsService: CommentsService) {}



}
