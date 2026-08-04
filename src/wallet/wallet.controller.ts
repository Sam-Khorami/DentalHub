import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwtAuth.guard';
import { IncreaseBalanceDto } from './dto/IncreaseBalance.dto';

@ApiTags("Wallet Management")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wallet')
export class WalletController {

  constructor(private readonly walletService: WalletService) {}

  @Get("get-balance")
  async getBalance (@Req() request: Request) {

    const balance = await this.walletService.getBalance(request);
    return { balance }

  }

  @Post("start-Increase-balance")
  async startIncreaseBalance (@Req() request: Request, @Body() data: IncreaseBalanceDto) {

    const paymentData = await this.walletService.startIncreaseBalance(request, data);
    return { data, paymentUrl: `https://gateway.zibal.ir/start/${paymentData.trackId}` }

  }

}
