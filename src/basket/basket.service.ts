import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { Product } from '../entity/product.entity';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class BasketService {

    constructor (

        @InjectRepository(User) private readonly userRepo: Repository<User>,
        @InjectRepository(Product) private readonly productRepo: Repository<Product>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache

    ) {}

    async getProducts () {

        const products = await this.productRepo.find();
        if (!products) throw new NotFoundException("Products Not Found!");
        
        return products;

    }

    async addToBasket (productId: number, quantity: number, request: Request) {

        const userId = request["user"].userId;
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException("User Not Found!");

        const product = await this.productRepo.findOne({ where: { id: productId } });
        if (!product) throw new NotFoundException("Product Not Found!");
        if (product.quantity < quantity) throw new BadRequestException("Quantity is not enough!");

        const totalPrice = quantity * product.price;

        await this.cacheManager.set(`cart:${userId}`, [ { productId, quantity, totalPrice } ], 86400000);
        return;

    }

}
