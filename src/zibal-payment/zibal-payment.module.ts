import { Module } from '@nestjs/common';
import { ZibalPaymentService } from './zibal-payment.service';

@Module({
  providers: [ZibalPaymentService]
})
export class ZibalPaymentModule {}
