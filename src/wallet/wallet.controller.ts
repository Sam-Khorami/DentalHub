import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwtAuth.guard';

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

}
