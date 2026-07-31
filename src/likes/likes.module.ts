import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from '../entity/user.entity';
import { Product } from '../entity/product.entity';
import { Comments } from '../entity/comments.entity';
import { CommentLikes } from '../entity/commentLikes.entity';

@Module({
  imports: [

    TypeOrmModule.forFeature([User, Product, Comments, CommentLikes])

  ],
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}
