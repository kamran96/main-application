import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { Authenticate } from '@invyce/auth-middleware';
import { MQ_HOST } from '@invyce/global-constants';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'EMAIL_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [MQ_HOST()],
          queue: 'email_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService],
})
export class InvoiceModule {
  configure(route) {
    route.apply(Authenticate).forRoutes(InvoiceController);
  }
}
