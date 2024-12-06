import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CompanyName, Level, ServiceTypes, Towns } from './enums/travels.enum';
import { Audit } from 'src/common/entities/audit.entity';
import { Ticket } from 'src/tickets/ticket.entity';

@Entity()
export class Travel extends Audit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ServiceTypes })
  serviceType: ServiceTypes;

  @Column({ type: 'enum', enum: CompanyName })
  companyName: CompanyName;

  @Column({ type: 'enum', enum: Level })
  level: Level;

  @Column()
  note: string;

  @Column({ type: 'smallint' })
  totalSeats: number;

  @Column({ type: 'smallint' })
  emptySeats: number;

  @Column({ type: 'timestamp without time zone' })
  date: Date;

  @Column({ type: 'enum', enum: Towns })
  origin: Towns;

  @Column({ type: 'enum', enum: Towns })
  destination: Towns;

  @Column({ type: 'int' })
  price: number;

  @OneToMany(() => Ticket, (ticket) => ticket.travel)
  tickets: Ticket[];
}
