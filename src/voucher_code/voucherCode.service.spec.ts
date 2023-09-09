import { Test, TestingModule } from '@nestjs/testing';
import { VoucherCodeService } from './voucherCode.service';
import { Storage } from '../storage.service';
import { CreateVoucherDto } from './createVoucher.dto';

describe('VoucherCodeService', () => {
  let service: VoucherCodeService;
  let storage: Storage;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VoucherCodeService,
        Storage,
      ],
    }).compile();

    service = module.get<VoucherCodeService>(VoucherCodeService);
    storage = module.get<Storage>(Storage);
  });

  describe('generateVoucherCode', () => {
    it('should throw an error if the expiration date is in the past', async () => {
      const createVoucherDto: CreateVoucherDto = {
        special_offer_id: 1,
        expiration_date: '2022-01-01',
      };

      await expect(
        service.generateVoucherCode(createVoucherDto),
      ).rejects.toThrow('Expiration date cannot be in the past');
    });

    it('should throw an error if the special offer does not exist', async () => {
      const createVoucherDto: CreateVoucherDto = {
        special_offer_id: 1,
        expiration_date: '2024-01-01',
      };

      jest
        .spyOn(storage.specialOffer, 'findUnique')
        .mockResolvedValue(null);

      await expect(
        service.generateVoucherCode(createVoucherDto),
      ).rejects.toThrow('Special offer does not exist');
    });

    it('should generate voucher codes of a specific length', async () => {
      jest
        .spyOn(storage.voucherCode, 'findUnique')
        .mockResolvedValue(null);

      const voucherCode = await service.generateUniqueCode();

      expect(voucherCode.length).toBe(10);
    });

    it('should generate unique voucher codes', async () => {
      jest
        .spyOn(storage.voucherCode, 'findUnique')
        .mockResolvedValue(null);

      const generatedCodes = new Set<string>();

      for (let i = 0; i < 100; i++) {
        const voucherCode = await service.generateUniqueCode();
        generatedCodes.add(voucherCode);
      }

      expect(generatedCodes.size).toBe(100);
    });

    it('should generate a unique code after a few retries', async () => {
      const existingCode = jest
        .fn()
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ code: 'ABC123' });
      jest
        .spyOn(storage.voucherCode, 'findUnique')
        .mockImplementation(existingCode);

      const result = await service.generateUniqueCode();

      expect(typeof result).toBe('string');
      expect(result).not.toBe('ABC123');
    });

    it('should throw an error after 5 retries', async () => {
      const existingCode = {
        id: 1,
        specialOfferId: 1,
        customerId: 1,
        usedAt: new Date(),
        code: 'ABC123',
        expirationDate: new Date(),
        createdAt: new Date(),
      };
      jest.spyOn(storage.voucherCode, 'findUnique').mockResolvedValue(existingCode);

      await expect(service.generateUniqueCode()).rejects.toThrowError(
        'Unable to generate a unique code',
      );
    });
  });
});
