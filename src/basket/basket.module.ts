import { Module } from '@nestjs/common';
import { BasketService } from './basket.service';
import { BasketController } from './basket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Product } from '../entity/product.entity';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
  
    TypeOrmModule.forFeature([User, Product]),
    RedisModule
  
  ],
  controllers: [BasketController],
  providers: [BasketService],
})
export class BasketModule {}
