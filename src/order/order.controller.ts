import { Body, Controller, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwtAuth.guard';

@ApiTags("Order Management")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('order')
export class OrderController {

  constructor(private readonly orderService: OrderService) {}

  @Post("set-order")
  async setOrder (@Req() request: Request) {

    await this.orderService.setOrder(request);
    return { message: "The order setted successfully!" }

  }

  @Post("start-payment")
  async startPayment (@Req() request: Request) {

    const data = await this.orderService.startPayment(request);
    return { data, paymentUrl: `https://gateway.zibal.ir/start/${data.trackId}` }

  }

  @Post("verify-payment/:trackId")
  async verifyPayment (@Req() request: Request, @Param("trackId", ParseIntPipe) trackId: number) {

    const data = await this.orderService.verifyPayment(request, trackId);
    return { data }

  }

}
