import { Controller, Post, Body } from '@nestjs/common';
import { VoucherCodeService } from './voucherCode.service';
import { CreateVoucherDto } from './createVoucherDto.service';

@Controller('voucher-codes')
export class VoucherCodeController {
  constructor(private readonly voucherCodeService: VoucherCodeService) {}

  @Post()
  generateVoucherCode(@Body() createVoucherDto: CreateVoucherDto) {
    return this.voucherCodeService.generateVoucherCode(createVoucherDto);
  }
}