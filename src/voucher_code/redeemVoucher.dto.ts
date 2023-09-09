import { IsString, IsEmail } from 'class-validator';

export class RedeemVoucherDto {
  @IsString()
  code: string;

  @IsEmail()
  email: string;
}
