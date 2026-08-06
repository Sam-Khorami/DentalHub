import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { Wallet } from '../entity/wallet.entity';
import { WalletTransaction } from '../entity/walletTransaction.entity';
import { OrderStatusEnum, TransactionType } from "../enums/entity.enums";
import { IncreaseBalanceDto } from './dto/IncreaseBalance.dto';
import { ZibalPaymentService } from '../zibal-payment/zibal-payment.service';
import { CurrencyEnum } from '../enums/entity.enums';
import { Orders } from '../entity/order.entity';
import { RedisService } from '../redis/redis.service';
import { CartItem } from '../types/interfaces.type';
import { Product } from '../entity/product.entity';

@Injectable()
export class WalletService {

    constructor (

        @InjectRepository(User) private readonly userRepo: Repository<User>,
        @InjectRepository(Wallet) private readonly walletRepo: Repository<Wallet>,
        @InjectRepository(Product) private readonly productRepo: Repository<Product>,
        @InjectRepository(WalletTransaction) private readonly transactionsRepo: Repository<WalletTransaction>,
        @InjectRepository(Orders) private readonly ordersRepo: Repository<Orders>,
        private readonly zibalPaymentService: ZibalPaymentService,
        private readonly redisService: RedisService

    ) {}

    async getBalance (request: Request) {

        // Getting User Info
        const userId = request["user"].userId;
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException("User Not Found!");

        // Getting The Target Wallet
        const wallet = await this.walletRepo.findOne({ where: { user: { id: userId } }, select: { id: true, balance: true, currency: true } });
        if (!wallet) throw new NotFoundException("Wallet Not Found!");

        return wallet;

    }

    async startIncreaseBalance (request: Request, data: IncreaseBalanceDto) {

        // Getting User Info
        const userId = request["user"].userId;
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException("User Not Found!");

        //Checking Wallet
        const wallet = await this.walletRepo.findOne({ where: { user: { id: userId } } });
        if (!wallet) throw new NotFoundException("Wallet Not Found!");

        // Sending Request To Zibal Service
        const paymentData = await this.zibalPaymentService.requestPayment(data.amount);
        return paymentData; 

    }

    async verifyIncreaseBalance (request: Request, trackId: number) {

        // Getting User Info
        const userId = request["user"].userId;
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException("User Not Found!");

        //Checking Wallet
        const wallet = await this.walletRepo.findOne({ where: { user: { id: userId } } });
        if (!wallet) throw new NotFoundException("Wallet Not Found!");

        // Sending Request To Zibal For Verify Payment
        const result = await this.zibalPaymentService.verifyPayment(trackId);

        let balanceBefore: number = 0;
        let balanceAfter: number = 0;

        if (wallet.currency === CurrencyEnum.IRR) {
            
            balanceBefore += Number(wallet.balance);
            balanceAfter += Number(wallet.balance) + result.amount;
            
        } 
        
        else {
            
            balanceBefore += Number(wallet.balance);
            balanceAfter += Number(wallet.balance) + (result.amount / 10);
            
        }
        
        const newTransaction = this.transactionsRepo.create({ amount: (result.amount / 10), balanceBefore, balanceAfter, type: TransactionType.Deposit, wallet });
        await this.transactionsRepo.save(newTransaction);
        
        wallet.balance = balanceAfter;
        await this.walletRepo.save(wallet);

        return;

    }


    async purchase (amount: number, userId: number) {

        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException("User Not Found!");

        const wallet = await this.walletRepo.findOne({ where: { user: { id: userId } } });
        if (!wallet) throw new NotFoundException("Wallet Not Found!");
        if (Number(wallet.balance) < amount) throw new BadRequestException("You do not have enough balance in your wallet");

        const order = await this.ordersRepo.findOne({ where: { user: { id: userId }, status: OrderStatusEnum.Pending } });
        if (!order) throw new NotFoundException("Order Not Found!");

        const cart = await this.redisService.get(`cart:${userId}`) as CartItem[] ?? [];
        if (cart.length === 0 || !cart) {

        await this.ordersRepo.remove(order);
        throw new BadRequestException("Basket Is Empty");

        }

        const balanceBefore = Number(wallet.balance);
        const balanceAfter = Number(wallet.balance) - amount;

        wallet.balance = balanceAfter;
        order.status = OrderStatusEnum.Payed;

        const newTransaction = this.transactionsRepo.create({ amount, balanceBefore, balanceAfter, type: TransactionType.Purchase, wallet })
        await this.transactionsRepo.save(newTransaction);
        await this.walletRepo.save(wallet);
        await this.ordersRepo.save(order);

        cart.forEach(async (item) => {

            const product = await this.productRepo.findOne({ where: { id: item.productId } });
            if (product!.quantity < item.quantity) throw new BadRequestException("Not enough quantity for this item");
            product!.quantity -= item.quantity;
            await this.productRepo.save(product!);

        });
        await this.redisService.delete(`cart:${userId}`);

        return;

    }

}
