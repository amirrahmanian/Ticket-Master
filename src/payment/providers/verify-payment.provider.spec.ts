import { Test, TestingModule } from '@nestjs/testing';
import { VerifyPaymentProvider } from './verify-payment.provider';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { Payment } from '../payment.entity';
import { VerifyPaymentQueryDto } from '../dtos/verify-payment-query.dto';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PaymentStatus } from '../enums/payment.enum';
import paymentConfig from '../config/payment.config';
import axios from 'axios';

jest.mock('axios');

describe('VerifyPaymentProvider', () => {
  let verifyPaymentProvider: VerifyPaymentProvider;
  let queryRunner: QueryRunner;

  const mockPaymentRepository = {
    findOneBy: jest.fn(),
    update: jest.fn(),
  };

  const mockDataSource = {
    createQueryRunner: jest.fn(),
  };

  const mockQueryRunner = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    manager: {
      update: jest.fn(),
    },
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
  };

  const mockConfig = {
    verifyUrl: 'https://payment-provider.com/verify',
    merchantId: 'test-merchant-id',
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    mockDataSource.createQueryRunner.mockReturnValue(mockQueryRunner);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VerifyPaymentProvider,
        {
          provide: paymentConfig.KEY,
          useValue: mockConfig,
        },
        {
          provide: getRepositoryToken(Payment),
          useValue: mockPaymentRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    verifyPaymentProvider = module.get<VerifyPaymentProvider>(
      VerifyPaymentProvider,
    );
    const paymentRepository = module.get<Repository<Payment>>(
      getRepositoryToken(Payment),
    );
    const dataSource = module.get<DataSource>(DataSource);
    const queryRunner = mockQueryRunner;
  });

  it('should be defined', () => {
    expect(verifyPaymentProvider).toBeDefined();
  });

  describe('verifyPayment', () => {
    const query: VerifyPaymentQueryDto = {
      trackId: '12345',
      status: 'success',
      success: 'true',
    };

    it('should throw NotFoundException if order is not found', async () => {
      mockPaymentRepository.findOneBy.mockResolvedValue(null);

      await expect(verifyPaymentProvider.verifyPayment(query)).rejects.toThrow(
        new NotFoundException('order not found'),
      );

      expect(mockPaymentRepository.findOneBy).toHaveBeenCalledWith({
        authority: query.trackId,
      });
    });

    it('should update payment to Success on successful verification', async () => {
      const order = { id: 1, amount: 1000 };
      const verifyResponse = { data: { result: 100, paidAt: new Date() } };

      mockPaymentRepository.findOneBy.mockResolvedValue(order);
      (axios.post as jest.Mock).mockResolvedValue(verifyResponse);

      const result = await verifyPaymentProvider.verifyPayment(query);

      expect(queryRunner.manager.update).toHaveBeenCalledWith(
        Payment,
        order.id,
        {
          status: PaymentStatus.Success,
          paidAt: verifyResponse.data.paidAt,
        },
      );
      expect(queryRunner.commitTransaction).toHaveBeenCalled();
      expect(result).toEqual(verifyResponse.data);
    });

    it('should update payment to Failed on verification failure', async () => {
      const order = { id: 1, amount: 1000 };
      const verifyResponse = { data: { result: 202 } };

      mockPaymentRepository.findOneBy.mockResolvedValue(order);
      (axios.post as jest.Mock).mockResolvedValue(verifyResponse);

      const result = await verifyPaymentProvider.verifyPayment(query);

      expect(queryRunner.manager.update).toHaveBeenCalledWith(
        Payment,
        order.id,
        {
          status: PaymentStatus.Failed,
        },
      );
      expect(queryRunner.commitTransaction).toHaveBeenCalled();
      expect(result).toEqual(verifyResponse.data);
    });

    it('should handle exceptions and rollback transaction', async () => {
      const order = { id: 1, amount: 1000 };

      mockPaymentRepository.findOneBy.mockResolvedValue(order);
      (axios.post as jest.Mock).mockRejectedValue(
        new Error('Payment verification failed'),
      );

      await expect(verifyPaymentProvider.verifyPayment(query)).rejects.toThrow(
        new InternalServerErrorException('Error: Payment verification failed'),
      );

      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });

    it('should call handleRefund on exception', async () => {
      const order = { id: 1, amount: 1000 };
      const refundSpy = jest
        .spyOn(verifyPaymentProvider, 'handleRefund')
        .mockResolvedValue(true);

      mockPaymentRepository.findOneBy.mockResolvedValue(order);
      (axios.post as jest.Mock).mockRejectedValue(
        new Error('Payment verification failed'),
      );

      await expect(
        verifyPaymentProvider.verifyPayment(query),
      ).rejects.toThrow();

      expect(refundSpy).toHaveBeenCalledWith(query.trackId, order.amount);
    });
  });

  describe('handleRefund', () => {
    it('should return true on successful refund', async () => {
      const result = await verifyPaymentProvider.handleRefund('12345', 1000);

      expect(result).toBe(true);
    });

    it('should throw an error on refund failure', async () => {
      jest.spyOn(axios, 'post').mockRejectedValue(new Error('Refund failed'));

      await expect(
        verifyPaymentProvider.handleRefund('12345', 1000),
      ).rejects.toThrow('Error: Refund failed');
    });
  });
});
