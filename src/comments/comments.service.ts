import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entity/product.entity';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { Comments } from '../entity/comments.entity';
import { SetCommentDto } from './dto/setComment.dto';
import { EditCommentDto } from './dto/editComment.dto';

@Injectable()
export class CommentsService {

    constructor (

        @InjectRepository(Product) private readonly productRepo: Repository<Product>,
        @InjectRepository(User) private readonly userRepo: Repository<User>,
        @InjectRepository(Comments) private readonly commentsRepo: Repository<Comments>,

    ) {}

    async setComment (data: SetCommentDto, request: Request, productId: number) {

        const userId = request["user"].userId;
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException("User Not Found!");

        const product = await this.productRepo.findOne({ where: { id: productId } });
        if (!product) throw new NotFoundException("Product Not Found!");

        const newComment = this.commentsRepo.create({ title: data.title, description: data.description, user, product });
        await this.commentsRepo.save(newComment);
        return;

    }

    async removeComment (request: Request, commentId: number) {

        const userId = request["user"].userId;
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException("User Not Found!");

        const comment = await this.commentsRepo.findOne({ where: { id: commentId }, relations: { user: true } });
        if (!comment) throw new NotFoundException("Comment Not Found!");
        if (comment.user.id !== userId) throw new BadRequestException("You can not delete this comment");

        await this.commentsRepo.remove(comment);
        return;

    }


    async editComment (data: EditCommentDto, commentId: number, request: Request) {

        const userId = request["user"].userId;
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException("User Not Found!");

        const comment = await this.commentsRepo.findOne({ where: { id: commentId }, relations: { user: true } });
        if (!comment) throw new NotFoundException("Comment Not Found!");
        if (comment.user.id !== userId) throw new BadRequestException("You can not delete this comment");

        comment.title = data.title;
        comment.description = data.description;
        await this.commentsRepo.save(comment);
        return;

    }

    async getComments (page: number, limit: number, productId: number) {

        const product = await this.productRepo.findOne({ where: { id: productId }, relations: { comments: true } });
        if (!product) throw new NotFoundException("Product Not Found!");
        if (product.comments.length === 0) throw new BadRequestException("No Comment Found!");

        const skip = (page - 1) * limit;

        const [ comments, totalItems ] = await this.commentsRepo.findAndCount({ where: { product: { id: productId } }, take: limit, skip });
        return { currentPage: page, pageSize: limit, totalItems, comments }

    }


}
