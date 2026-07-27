import { Module } from '@nestjs/common';
import { BasketService } from './basket.service';
import { BasketController } from './basket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Product } from '../entity/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Product])],
  controllers: [BasketController],
  providers: [BasketService],
})
export class BasketModule {}
