import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { VoucherCode, Prisma } from '@prisma/client';

@Injectable()
export class VoucherCodeService {
  constructor(private prisma: PrismaService) {}

  async VoucherCode(
    VoucherCodeWhereUniqueInput: Prisma.VoucherCodeWhereUniqueInput,
  ): Promise<VoucherCode | null> {
    return this.prisma.voucherCode.findUnique({
      where: VoucherCodeWhereUniqueInput,
    });
  }

  async VoucherCodes(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.VoucherCodeWhereUniqueInput;
    where?: Prisma.VoucherCodeWhereInput;
    orderBy?: Prisma.VoucherCodeOrderByWithRelationInput;
  }): Promise<VoucherCode[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.voucherCode.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createVoucherCode(data: Prisma.VoucherCodeCreateInput): Promise<VoucherCode> {
    return this.prisma.voucherCode.create({
      data,
    });
  }

  async updateVoucherCode(params: {
    where: Prisma.VoucherCodeWhereUniqueInput;
    data: Prisma.VoucherCodeUpdateInput;
  }): Promise<VoucherCode> {
    const { data, where } = params;
    return this.prisma.voucherCode.update({
      data,
      where,
    });
  }

  async deleteVoucherCode(where: Prisma.VoucherCodeWhereUniqueInput): Promise<VoucherCode> {
    return this.prisma.voucherCode.delete({
      where,
    });
  }
}
