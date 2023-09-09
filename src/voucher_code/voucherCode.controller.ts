import { Controller, Post, Body, Get, HttpCode, Param, Query } from '@nestjs/common';
import { VoucherCodeService } from './voucherCode.service';
import { CreateVoucherDto } from './createVoucher.dto';
import { RedeemVoucherDto } from './redeemVoucher.dto';

@Controller('/voucher-codes')
export class VoucherCodeController {
  constructor(private readonly voucherCodeService: VoucherCodeService) {}

  @Get('')
  getVoucherCodes(@Query('email') email: any) {
    return this.voucherCodeService.GetVoucherCodes(email);
  }
  @Post()
  generateVoucherCode(@Body() createVoucherDto: CreateVoucherDto) {
    return this.voucherCodeService.generateVoucherCode(createVoucherDto);
  }

  @Post('/redeem')
  @HttpCode(200)
  redeemVoucherCode(@Body() redeemVoucherDto: RedeemVoucherDto) {
    return this.voucherCodeService.RedeemVoucherCode(redeemVoucherDto);
  }
}