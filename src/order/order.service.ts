import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { Orders, OrderStatusEnum } from '../entity/order.entity';
import { RedisService } from '../redis/redis.service';
import { CartItem } from '../types/interfaces.type';
import { Product } from '../entity/product.entity';
import { ZibalPaymentService } from '../zibal-payment/zibal-payment.service';

@Injectable()
export class OrderService {

    constructor (

        @InjectRepository(User) private readonly userRepo: Repository<User>,
        @InjectRepository(Orders) private readonly orderRepo: Repository<Orders>,
        @InjectRepository(Product) private readonly productRepo: Repository<Product>,
        private readonly zibalPaymentService: ZibalPaymentService,
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

    async startPayment (request: Request) {

        const userId = request["user"].userId;
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException("User Not Found!");

        const order = await this.orderRepo.findOne({ where: { user: { id: userId }, status: OrderStatusEnum.Pending } });
        if (!order) throw new NotFoundException("Order Not Found!");

        const data = await this.zibalPaymentService.requestPayment(order.totalPrice);
        return data;

    }

}
