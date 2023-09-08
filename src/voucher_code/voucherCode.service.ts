import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateVoucherDto } from './createVoucherDto.service';
import { init } from '@paralleldrive/cuid2';
import * as os from 'os';


@Injectable()
export class VoucherCodeService {
  private createId = init({
    random: Math.random,
    length: 10,
    fingerprint: os.hostname(),
  });

  constructor(private prisma: PrismaService) {}

  async generateVoucherCode(createVoucherDto: CreateVoucherDto) {
    const { special_offer_id, expiration_date } = createVoucherDto;

    if(new Date(expiration_date) < new Date()) {
      throw new BadRequestException('Expiration date cannot be in the past');
    }

    // Check if the Special offer exists
    const specialOffer = await this.prisma.specialOffer.findUnique({
      where: { id: special_offer_id },
    });

    if (!specialOffer) {
      throw new BadRequestException('Special offer does not exist');
    }

    const expirationDate = new Date(expiration_date).toISOString();

    // Generate voucher codes for each customer 
    const customers = await this.prisma.customer.findMany();
    for (const customer of customers) {
      await this.prisma.voucherCode.create({
        data: {
          code: await this.generateUniqueCode(),
          customerId: customer.id,
          specialOfferId: special_offer_id,
          expirationDate: expirationDate
        },
      });
    }

    return {
      message: "Voucher Codes Created."
    };
  }
  async generateUniqueCode(retryCount = 0): Promise<string> {
    if (retryCount >= 5) {
      throw new Error('Unable to generate a unique code');
    }
  
    const code = this.createId();
    const existingCode = await this.prisma.voucherCode.findUnique({ where: { code } });
  
    if (existingCode) {
      return this.generateUniqueCode(retryCount + 1);
    }
  
    return code;
  }

}
