import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { Wallet } from '../entity/wallet.entity';
import { WalletTransaction } from '../entity/walletTransaction.entity';
import { IncreaseBalanceDto } from './dto/IncreaseBalance.dto';
import { ZibalPaymentService } from '../zibal-payment/zibal-payment.service';

@Injectable()
export class WalletService {

    constructor (

        @InjectRepository(User) private readonly userRepo: Repository<User>,
        @InjectRepository(Wallet) private readonly walletRepo: Repository<Wallet>,
        @InjectRepository(WalletTransaction) private readonly transactionsRepo: Repository<WalletTransaction>,
        private readonly zibalPaymentService: ZibalPaymentService

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

}
