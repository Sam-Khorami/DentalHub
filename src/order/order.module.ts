import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { User } from '../entity/user.entity';
import { Orders } from '../entity/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../entity/product.entity';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [

    TypeOrmModule.forFeature([User, Product, Orders]),
    RedisModule

  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
