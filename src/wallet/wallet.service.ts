import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { Wallet } from '../entity/wallet.entity';
import { WalletTransaction } from '../entity/walletTransaction.entity';

@Injectable()
export class WalletService {

    constructor (

        @InjectRepository(User) private readonly userRepo: Repository<User>,
        @InjectRepository(Wallet) private readonly walletRepo: Repository<Wallet>,
        @InjectRepository(WalletTransaction) private readonly transactionsRepo: Repository<WalletTransaction>

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

}
