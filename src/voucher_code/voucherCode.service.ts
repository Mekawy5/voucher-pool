import { BadRequestException, Injectable } from '@nestjs/common';
import { Storage } from '../storage.service';
import { CreateVoucherDto } from './createVoucher.dto';
import { init } from '@paralleldrive/cuid2';
import * as os from 'os';
import { RedeemVoucherDto } from './redeemVoucher.dto';


@Injectable()
export class VoucherCodeService {
  private createId = init({
    random: Math.random,
    length: 10,
    fingerprint: os.hostname(),
  });

  constructor(private storage: Storage) {}

  async generateVoucherCode(createVoucherDto: CreateVoucherDto) {
    const { special_offer_id, expiration_date } = createVoucherDto;

    if(new Date(expiration_date) < new Date()) {
      throw new BadRequestException('Expiration date cannot be in the past');
    }

    // Check if the Special offer exists
    const specialOffer = await this.storage.specialOffer.findUnique({
      where: { id: special_offer_id },
    });

    if (!specialOffer) {
      throw new BadRequestException('Special offer does not exist');
    }

    const expirationDate = new Date(expiration_date).toISOString();

    // Generate voucher codes for each customer 
    await this.insertCustomerVoucherCodes(special_offer_id, expirationDate);

    return {
      message: "Voucher Codes Created."
    };
  }

  async RedeemVoucherCode(redeemVoucherDto: RedeemVoucherDto) {
    const { code, email } = redeemVoucherDto;

    const voucherCode = await this.findVoucherCode(code, email);

    if (!voucherCode) {
      throw new BadRequestException('Invalid code');
    }

    await this.useVoucherCode(voucherCode.id);

    return {
      "message": "Voucher Code Redeemed",
      "discount": voucherCode.specialOffer.discount
    }
  }

  async findVoucherCode(code: string, email: string) {
    return await this.storage.voucherCode.findFirst({
      where: {
        code: code,
        customer: {
          email: email,
        },
        usedAt: null,
        expirationDate: {
          gte: new Date(),
        },
      },
      include: {
        specialOffer: true,
      },
    });
  }

  async useVoucherCode(voucherCodeId: number) {
    await this.storage.voucherCode.update({
      where: {
        id: voucherCodeId,
      },
      data: {
        usedAt: new Date(),
      },
    });
  }

  private async insertCustomerVoucherCodes(special_offer_id: number, expirationDate: string) {
    const customers = await this.storage.customer.findMany();
    for (const customer of customers) {
      await this.storage.voucherCode.create({
        data: {
          code: await this.generateUniqueCode(),
          customerId: customer.id,
          specialOfferId: special_offer_id,
          expirationDate: expirationDate
        },
      });
    }
  }

  async generateUniqueCode(retryCount = 0): Promise<string> {
    if (retryCount >= 5) {
      throw new Error('Unable to generate a unique code');
    }
  
    const code = this.createId();
    const existingCode = await this.storage.voucherCode.findUnique({ where: { code } });
  
    if (existingCode) {
      return this.generateUniqueCode(retryCount + 1);
    }
  
    return code;
  }

}
