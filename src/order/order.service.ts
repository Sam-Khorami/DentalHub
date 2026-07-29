import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { Orders, OrderStatusEnum } from '../entity/order.entity';
import { RedisService } from '../redis/redis.service';
import { CartItem } from '../types/interfaces.type';
import { Product } from '../entity/product.entity';
import { ZibalPaymentService } from '../zibal-payment/zibal-payment.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class OrderService {

    constructor (

        @InjectRepository(User) private readonly userRepo: Repository<User>,
        @InjectRepository(Orders) private readonly orderRepo: Repository<Orders>,
        @InjectRepository(Product) private readonly productRepo: Repository<Product>,
        private readonly zibalPaymentService: ZibalPaymentService,
        private readonly redisService: RedisService,
        private readonly mailService: MailService

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

    async verifyPayment (request: Request, trackId: number) {

        const userId = request["user"].userId;
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException("User Not Found!");

        const order = await this.orderRepo.findOne({ where: { user: { id: userId }, status: OrderStatusEnum.Pending } });
        if (!order) throw new NotFoundException("Order Not Found!");

        const cart = await this.redisService.get(`cart:${userId}`) as CartItem[] ?? [];
        if (cart.length === 0 || !cart) {

            await this.orderRepo.remove(order);
            throw new BadRequestException("Basket Is Empty");

        }

        const data = await this.zibalPaymentService.verifyPayment(trackId);
        
        cart.forEach(async (item) => {

            const product = await this.productRepo.findOne({ where: { id: item.productId } });
            if (product!.quantity < item.quantity) throw new BadRequestException("Not enough quantity for this item");
            product!.quantity -= item.quantity;
            await this.productRepo.save(product!);

        });
        
        const now = new Date();
        order.status = OrderStatusEnum.Payed;
        order.payedAt = now;
        await this.orderRepo.save(order);

        await this.redisService.delete(`cart:${userId}`);
        await this.mailService.sendEmailToUser(user.email, `Hi dear ${user.username} thanks for your purchase\nYour order will arrive in three days.`);
        return data;

    }

}
