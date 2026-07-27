import { Controller, UseGuards } from '@nestjs/common';
import { BasketService } from './basket.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwtAuth.guard';

@ApiTags("Basket Management")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('basket')
export class BasketController {

  constructor(private readonly basketService: BasketService) {}


}
