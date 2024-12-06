import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Audit } from 'src/common/entities/audit.entity';
import { Travel } from 'src/travels/travel.entity';
import { Passenger } from 'src/passengers/passenger.entity';
import { Payment } from 'src/payment/payment.entity';

@Entity()
@Index('reservedSeat_UNIQUE', ['travel.id', 'reservedSeat'], {
  unique: true,
})
export class Ticket extends Audit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'smallint' })
  reservedSeat: number;

  @Column({ unique: true, nullable: true })
  code?: string;

  @ManyToOne(() => Travel, (travel) => travel.tickets)
  travel: Travel;

  @ManyToOne(() => Passenger, (passenger) => passenger.tickets)
  passenger: Passenger;

  @OneToOne(() => Payment, (payment) => payment.ticket)
  payment: Payment;
}
