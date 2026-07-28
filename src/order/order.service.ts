import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { Orders } from '../entity/order.entity';
import { RedisService } from '../redis/redis.service';
import { CartItem } from '../types/interfaces.type';
import { Product } from '../entity/product.entity';

@Injectable()
export class OrderService {

    constructor (

        @InjectRepository(User) private readonly userRepo: Repository<User>,
        @InjectRepository(Orders) private readonly orderRepo: Repository<Orders>,
        @InjectRepository(Product) private readonly productRepo: Repository<Product>,
        private readonly redisService: RedisService

    ) {}

    async setOrder (request: Request) {

        const userId = request["user"].userId;
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException("User Not Found!");

        const order = await this.orderRepo.findOne({ where: { user: { id: userId } } });
        if (order) throw new ConflictException("Order already exists please pay your order first!")

        let price = 0;

        const cart = await this.redisService.get(`cart:${userId}`) as CartItem[] ?? [];
        if (cart.length === 0) throw new BadRequestException("Basket Is Empty");
        cart.forEach((item) => { price += item.totalPrice });

        const newOrder = this.orderRepo.create({ totalPrice: price, user });
        await this.orderRepo.save(newOrder);
        return;

    }

}
