import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { Product } from '../entity/product.entity';
import { RedisService } from '../redis/redis.service';
import { CartItem } from '../types/interfaces.type';

@Injectable()
export class BasketService {

    constructor (

        @InjectRepository(User) private readonly userRepo: Repository<User>,
        @InjectRepository(Product) private readonly productRepo: Repository<Product>,
        private readonly redisService: RedisService

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

        const cart = await this.redisService.get(`cart:${userId}`) as CartItem[] ?? [];
        const exists = cart.find((item) => item.productId === productId)

        if (exists) {

            exists.quantity += quantity;
            exists.totalPrice = exists.quantity * product.price;

        }

        else cart.push({ productId, quantity, totalPrice });


        await this.redisService.setProduct(`cart:${userId}`, cart, 86400000);
        return;

    }

    async removeFromBasket (request: Request, productId: number) {
        
        const userId = request["user"].userId;
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException("User Not Found!");

        const product = await this.productRepo.findOne({ where: { id: productId } });
        if (!product) throw new NotFoundException("Product Not Found!");

        let cart = await this.redisService.get(`cart:${userId}`) as CartItem[] ?? [];
        const exists = cart.find((item) => item.productId === productId);
        if (!exists) throw new NotFoundException("Product Not Found");

        cart = cart.filter((item) => item.productId !== productId);
        await this.redisService.setProduct(`cart:${userId}`, cart, 86400000);
        return;

    }

}
