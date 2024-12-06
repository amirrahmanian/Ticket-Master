import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Gender } from 'src/common/enums/common.enum';
import { Audit } from 'src/common/entities/audit.entity';
import { Ticket } from 'src/tickets/ticket.entity';

@Entity()
@Index('UNIQUE_CODES', ['phoneNumber', 'nationalCode'], {
  unique: true,
})
export class Passenger extends Audit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  family: string;

  @Column()
  nationalCode: string;

  @Column()
  phoneNumber: string;

  @Column({ type: 'date' })
  birthDate: Date;

  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @OneToMany(() => Ticket, (ticket) => ticket.passenger)
  tickets: Ticket[];
}
