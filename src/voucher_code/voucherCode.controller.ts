import { Controller, Post, Body } from '@nestjs/common';
import { VoucherCodeService } from './voucherCode.service';
import { CreateVoucherDto } from './createVoucher.dto';
import { RedeemVoucherDto } from './redeemVoucher.dto';

@Controller('voucher-codes')
export class VoucherCodeController {
  constructor(private readonly voucherCodeService: VoucherCodeService) {}

  @Post()
  generateVoucherCode(@Body() createVoucherDto: CreateVoucherDto) {
    return this.voucherCodeService.generateVoucherCode(createVoucherDto);
  }

  @Post('/redeem')
  redeemVoucherCode(@Body() redeemVoucherDto: RedeemVoucherDto) {
    return this.voucherCodeService.RedeemVoucherCode(redeemVoucherDto);
  }
}