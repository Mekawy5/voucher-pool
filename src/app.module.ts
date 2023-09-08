import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VoucherCodeModule } from './voucher_code/voucherCodeModule';

@Module({
  imports: [VoucherCodeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
