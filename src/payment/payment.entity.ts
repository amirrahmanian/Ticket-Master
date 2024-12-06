import { Audit } from 'src/common/entities/audit.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PaymentStatus } from './enums/payment.enum';
import { Ticket } from 'src/tickets/ticket.entity';

@Entity()
export class Payment extends Audit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  authority: string;

  @Column()
  amount: number;

  @Column({ type: 'enum', enum: PaymentStatus, nullable: true })
  status?: PaymentStatus;

  @Column({ nullable: true })
  paidAt?: Date;

  @OneToOne(() => Ticket, (ticket) => ticket.payment)
  @JoinColumn()
  ticket: Ticket;
}
