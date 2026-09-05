import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFeeStructureDto, AssignFeeDto, CreateOrderDto, VerifyPaymentDto } from './dto/fee.dto';
import * as crypto from 'crypto';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const RazorpaySdk = (() => { try { return require('razorpay'); } catch { return null; } })();

@Injectable()
export class FeesService {
  private razorpay: any = null;

  constructor(private readonly prisma: PrismaService) {
    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET && RazorpaySdk) {
      this.razorpay = new RazorpaySdk({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });
    }
  }

  // ── Fee structures ──
  async createStructure(dto: CreateFeeStructureDto, schoolId: string) {
    return this.prisma.feeStructure.create({
      data: {
        schoolId, name: dto.name, amount: dto.amount, classId: dto.classId,
        academicYearId: dto.academicYearId, dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        frequency: dto.frequency || 'MONTHLY', description: dto.description,
      },
      include: { school: true },
    });
  }

  async getStructures(schoolId: string) {
    return this.prisma.feeStructure.findMany({
      where: { schoolId },
      include: { _count: { select: { payments: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async assignFee(dto: AssignFeeDto) {
    const structure = await this.prisma.feeStructure.findUnique({ where: { id: dto.feeStructureId } });
    if (!structure) throw new NotFoundException('Fee structure not found');
    const students = await this.prisma.studentProfile.findMany({ where: { classId: dto.classId, status: 'ACTIVE' } });
    let created = 0;
    for (const s of students) {
      const existing = await this.prisma.feePayment.findFirst({ where: { studentId: s.id, feeStructureId: structure.id } });
      if (!existing) {
        await this.prisma.feePayment.create({ data: { studentId: s.id, feeStructureId: structure.id, amountPaid: 0, status: 'PENDING', academicYearId: structure.academicYearId } });
        created++;
      }
    }
    return { created, totalStudents: students.length };
  }

  // ── Student ledger / parent views ──
  async getStudentLedger(studentId: string) {
    const payments = await this.prisma.feePayment.findMany({
      where: { studentId },
      include: { feeStructure: { include: { school: true } } },
      orderBy: { feeStructure: { dueDate: 'asc' } },
    });
    const due = payments.filter((p) => p.status !== 'PAID').reduce((sum, p) => sum + p.feeStructure.amount, 0);
    const paid = payments.filter((p) => p.status === 'PAID').reduce((sum, p) => sum + p.amountPaid, 0);
    return { payments, due, paid };
  }

  async getChildrenForParent(parentUserId: string) {
    const parent = await this.prisma.parentProfile.findUnique({
      where: { userId: parentUserId },
      include: { children: { include: { child: { include: { user: { select: { firstName: true, lastName: true } }, class: true, section: true } } } } },
    });
    if (!parent) return [];
    return parent.children.map((c) => ({
      studentId: c.child.id,
      userId: c.child.userId,
      name: `${c.child.user.firstName} ${c.child.user.lastName}`,
      className: c.child.class?.name,
      section: c.child.section?.name,
      relationship: c.relationship,
    }));
  }

  async getPendingPaymentsForUser(parentUserId: string) {
    const children = await this.prisma.parentChild.findMany({ where: { parent: { userId: parentUserId } } });
    const studentIds = children.map((c) => c.childId);
    return this.prisma.feePayment.findMany({
      where: { studentId: { in: studentIds }, status: { not: 'PAID' } },
      include: { feeStructure: true, student: { include: { user: { select: { firstName: true, lastName: true } } } } },
      orderBy: { feeStructure: { dueDate: 'asc' } },
    });
  }

  async isChildOf(parentUserId: string, feePaymentId: string): Promise<boolean> {
    const payment = await this.prisma.feePayment.findUnique({
      where: { id: feePaymentId },
      include: { student: { include: { parentChildren: { where: { parent: { userId: parentUserId } } } } } },
    });
    return !!payment && payment.student.parentChildren.length > 0;
  }

  // ── Payments ──
  async createOrder(dto: CreateOrderDto): Promise<any> {
    const payment = await this.prisma.feePayment.findUnique({
      where: { id: dto.feePaymentId },
      include: { feeStructure: true, student: { include: { parentChildren: { include: { parent: { include: { user: { select: { id: true } } } } } } } } },
    });
    if (!payment) throw new NotFoundException('Fee payment record not found');
    if (payment.status === 'PAID') throw new BadRequestException('This fee is already paid');
    if (dto.payerUserId && !payment.student.parentChildren.some((pc) => pc.parent.userId === dto.payerUserId)) {
      throw new BadRequestException('This fee does not belong to your child');
    }
    const amountInPaise = Math.round(payment.feeStructure.amount * 100);
    if (!this.razorpay) {
      return { mock: true, feePaymentId: payment.id, amount: amountInPaise, currency: 'INR', studentId: payment.studentId, structureName: payment.feeStructure.name };
    }
    const order = await this.razorpay.orders.create({ amount: amountInPaise, currency: 'INR', notes: { feePaymentId: payment.id } });
    return { mock: false, orderId: order.id, amount: order.amount, currency: order.currency, keyId: process.env.RAZORPAY_KEY_ID, feePaymentId: payment.id };
  }

  verifySignature(orderId: string, paymentId: string, signature: string): boolean {
    const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '').update(`${orderId}|${paymentId}`).digest('hex');
    return expected === signature;
  }

  async verifyAndMarkPaid(dto: VerifyPaymentDto, payerUserId?: string) {
    if (payerUserId && !(await this.isChildOf(payerUserId, dto.feePaymentId))) {
      throw new BadRequestException('Payment does not belong to your child');
    }
    if (this.razorpay && !this.verifySignature(dto.razorpayOrderId, dto.razorpayPaymentId, dto.razorpaySignature)) {
      throw new BadRequestException('Invalid payment signature');
    }
    const payment = await this.prisma.feePayment.findUnique({ where: { id: dto.feePaymentId }, include: { feeStructure: true } });
    if (!payment) throw new NotFoundException('Fee payment record not found');
    return this.markPaid(payment.id, { transactionId: dto.razorpayPaymentId });
  }

  async markPaid(feePaymentId: string, data: { transactionId?: string; amountPaid?: number }) {
    const payment = await this.prisma.feePayment.findUnique({ where: { id: feePaymentId }, include: { feeStructure: true } });
    if (!payment) throw new NotFoundException('Fee payment record not found');
    const updated = await this.prisma.feePayment.update({
      where: { id: feePaymentId },
      data: { status: 'PAID', amountPaid: data.amountPaid ?? payment.feeStructure.amount, paidDate: new Date(), transactionId: data.transactionId ?? null, paymentMethod: 'razorpay' },
    });
    const parents = await this.prisma.parentChild.findMany({ where: { childId: payment.studentId }, include: { parent: { include: { user: { select: { id: true } } } } } });
    await this.prisma.notification.createMany({
      data: parents.map((p) => ({ userId: p.parent.userId, title: `Fee payment received: ${payment.feeStructure.name}`, body: `₹${payment.feeStructure.amount} paid successfully.`, type: 'fee' })),
    });
    return updated;
  }

  async handleWebhook(body: any, signature: string, rawBody: Buffer) {
    const expected = crypto.createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET || '').update(rawBody).digest('hex');
    if (signature && expected !== signature) throw new BadRequestException('Invalid webhook signature');

    const event = String(body?.event || '');
    const payload = body?.payload?.payment?.entity ?? body?.payload?.order?.entity;
    if (!payload) return { received: true };

    if (['payment.captured', 'order.paid'].some((k) => event.includes(k.split('.')[1]))) {
      const feePaymentId = payload.notes?.feePaymentId ?? payload.order_id;
      if (feePaymentId) {
        try {
          await this.markPaid(feePaymentId, { transactionId: payload.id });
        } catch {
          // Order unknown — ignore.
        }
      }
    }
    return { received: true };
  }

  async getPendingPayments(schoolId: string) {
    return this.prisma.feePayment.findMany({
      where: { status: { not: 'PAID' }, feeStructure: { schoolId } },
      include: { feeStructure: true, student: { include: { user: { select: { firstName: true, lastName: true } }, class: true } } },
      orderBy: { feeStructure: { dueDate: 'asc' } },
    });
  }

  async getCollectionSummary(schoolId: string) {
    const structures = await this.prisma.feeStructure.findMany({ where: { schoolId }, include: { payments: true } });
    let expectedTotal = 0, collected = 0;
    for (const st of structures) {
      for (const p of st.payments) {
        expectedTotal += st.amount;
        if (p.status === 'PAID') collected += p.amountPaid || st.amount;
      }
    }
    return { expectedTotal, collected, outstanding: expectedTotal - collected, percentage: expectedTotal > 0 ? Math.round((collected / expectedTotal) * 100) : 0 };
  }
}