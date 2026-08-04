import { Injectable } from '@nestjs/common';
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

}
