import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { Authenticate } from '@invyce/auth-middleware';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'EMAIL_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
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
