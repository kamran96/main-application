import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { Authenticate } from '@invyce/auth-middleware';

@Module({
  imports: [],
  controllers: [PaymentController],
  providers: [PaymentService, Authenticate],
})
export class PaymentModule {}
