import { IsInt, IsDateString } from 'class-validator';

export class CreateVoucherDto {
  @IsInt()
  special_offer_id: number;

  @IsDateString()
  expiration_date: string;
}
