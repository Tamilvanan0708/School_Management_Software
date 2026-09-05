import { describe, it, expect, beforeAll } from 'vitest';
import * as crypto from 'crypto';
import { FeesService } from './fees.service';

describe('FeesService signature verification', () => {
  let service: FeesService;

  beforeAll(() => {
    process.env.RAZORPAY_KEY_SECRET = 'test_secret';
    service = new FeesService(null as any);
  });

  it('accepts a valid HMAC(orderId|paymentId) signature', () => {
    const orderId = 'order_abc123';
    const paymentId = 'pay_xyz789';
    const sig = crypto.createHmac('sha256', 'test_secret').update(`${orderId}|${paymentId}`).digest('hex');
    expect(service.verifySignature(orderId, paymentId, sig)).toBe(true);
  });

  it('rejects a tampered signature', () => {
    const orderId = 'order_abc123';
    const paymentId = 'pay_xyz789';
    const badSig = crypto.createHmac('sha256', 'wrong_secret').update(`${orderId}|${paymentId}`).digest('hex');
    expect(service.verifySignature(orderId, paymentId, badSig)).toBe(false);
  });

  it('rejects a tampered order id', () => {
    const orderId = 'order_abc123';
    const paymentId = 'pay_xyz789';
    const sig = crypto.createHmac('sha256', 'test_secret').update(`${orderId}|${paymentId}`).digest('hex');
    expect(service.verifySignature('order_other', paymentId, sig)).toBe(false);
  });

  it('initializes without razorpay keys (mock mode)', () => {
    delete process.env.RAZORPAY_KEY_ID;
    const s = new FeesService(null as any);
    expect(s).toBeDefined();
  });
});