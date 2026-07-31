import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entity/product.entity';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { Comments } from '../entity/comments.entity';

@Injectable()
export class CommentsService {

    constructor (

        @InjectRepository(Product) private readonly productRepo: Repository<Product>,
        @InjectRepository(User) private readonly userRepo: Repository<User>,
        @InjectRepository(Comments) private readonly commentsRepo: Repository<Comments>,

    ) {}

}
