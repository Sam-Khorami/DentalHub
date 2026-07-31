import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { Product } from '../entity/product.entity';
import { Comments } from '../entity/comments.entity';
import { CommentLikes } from '../entity/commentLikes.entity';

@Injectable()
export class LikesService {

    constructor (

        @InjectRepository(User) private readonly userRepo: Repository<User>,
        @InjectRepository(Product) private readonly productRepo: Repository<Product>,
        @InjectRepository(Comments) private readonly commentRepo: Repository<Comments>,
        @InjectRepository(CommentLikes) private readonly commentLikesRepo: Repository<CommentLikes>,

    ) {}


    async likeComment (request: Request, commentId: number) {

        const userId = request["user"].userId;
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException("User Not Found!");

        const comment = await this.commentRepo.findOne({ where: { id: commentId } });
        if (!comment) throw new NotFoundException("Comment Not Found!");

        const checkLike = await this.commentLikesRepo.findOne({ where: { user: { id: userId }, comment: { id: commentId } } });
        if (checkLike) throw new ConflictException("You already liked this comment");

        const newLike = this.commentLikesRepo.create({ user, comment });
        await this.commentLikesRepo.save(newLike);
        return;

    }

    async unlikeComment (request: Request, commentId: number) {

        const userId = request["user"].userId;
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException("User Not Found!");

        const comment = await this.commentRepo.findOne({ where: { id: commentId } });
        if (!comment) throw new NotFoundException("Comment Not Found!");

        const checkLike = await this.commentLikesRepo.findOne({ where: { user: { id: userId }, comment: { id: commentId } } });
        if (!checkLike) throw new NotFoundException("Like Not Found");

        await this.commentLikesRepo.remove(checkLike);
        return;

    }

}
