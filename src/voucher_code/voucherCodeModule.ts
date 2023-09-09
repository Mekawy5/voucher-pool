import { Module } from '@nestjs/common';
import { VoucherCodeController } from './voucherCode.controller';
import { VoucherCodeService } from './voucherCode.service';
import { Storage } from 'src/storage.service';

@Module({
  imports: [],
  controllers: [VoucherCodeController],
  providers: [VoucherCodeService, Storage],
})
export class VoucherCodeModule {}
