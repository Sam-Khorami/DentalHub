import { Module } from '@nestjs/common';
import { ZibalPaymentService } from './zibal-payment.service';

@Module({
  providers: [ZibalPaymentService],
  exports: [ZibalPaymentService]
})
export class ZibalPaymentModule {}
