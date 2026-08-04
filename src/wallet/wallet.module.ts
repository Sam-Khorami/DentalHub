import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Wallet } from '../entity/wallet.entity';
import { WalletTransaction } from '../entity/walletTransaction.entity';
import { ZibalPaymentModule } from '../zibal-payment/zibal-payment.module';

@Module({
  imports: [

    TypeOrmModule.forFeature([User, Wallet, WalletTransaction]),
    ZibalPaymentModule

  ],
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule {}
