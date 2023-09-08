import { Module } from '@nestjs/common';
import { VoucherCodeController } from './voucherCode.controller';
import { VoucherCodeService } from './voucherCode.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [],
  controllers: [VoucherCodeController],
  providers: [VoucherCodeService, PrismaService],
})
export class VoucherCodeModule {}
