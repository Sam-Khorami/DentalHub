import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entity/product.entity';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { Comments } from '../entity/comments.entity';
import { SetCommentDto } from './dto/setComment.dto';

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

}
