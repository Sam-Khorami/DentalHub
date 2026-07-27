import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { Product } from '../entity/product.entity';

@Injectable()
export class BasketService {

    constructor (

        @InjectRepository(User) private readonly userRepo: Repository<User>,
        @InjectRepository(Product) private readonly productRepo: Repository<Product>

    ) {}

}
