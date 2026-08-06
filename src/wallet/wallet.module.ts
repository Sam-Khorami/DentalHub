import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Wallet } from '../entity/wallet.entity';
import { WalletTransaction } from '../entity/walletTransaction.entity';
import { ZibalPaymentModule } from '../zibal-payment/zibal-payment.module';
import { Orders } from '../entity/order.entity';
import { RedisModule } from '../redis/redis.module';
import { Product } from '../entity/product.entity';

@Module({
  imports: [

    TypeOrmModule.forFeature([User, Wallet, WalletTransaction, Orders, Product]),
    ZibalPaymentModule,
    RedisModule

  ],
  controllers: [WalletController],
  providers: [WalletService],
  exports: [WalletService]
})
export class WalletModule {}
