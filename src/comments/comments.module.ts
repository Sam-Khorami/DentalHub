import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Comments } from '../entity/comments.entity';
import { Product } from '../entity/product.entity';

@Module({
  imports: [

    TypeOrmModule.forFeature([Product, User, Comments])

  ],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
