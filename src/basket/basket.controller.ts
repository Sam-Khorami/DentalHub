import { Controller, Delete, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { BasketService } from './basket.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwtAuth.guard';

@ApiTags("Basket Management")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('basket')
export class BasketController {

  constructor(private readonly basketService: BasketService) {}

  @Get("get-products")
  async getProducts () {

    const products = await this.basketService.getProducts();
    return { products }

  }

  @Post("add-to-basket/:productId/:quantity")
  async addToBasket (@Param("productId", ParseIntPipe) productId: number, @Param("quantity", ParseIntPipe) quantity: number, @Req() request: Request) {

    await this.basketService.addToBasket(productId, quantity, request);
    return { message: "Product added to your basket successfully!" }

  }

  @Delete("remove-from-basket/:productId")
  async removeFromBasket (@Param("productId", ParseIntPipe) productId: number, @Req() request: Request) {

    await this.basketService.removeFromBasket(request, productId);
    return { message: "Product removed from your basket successfully!" }

  }

}
