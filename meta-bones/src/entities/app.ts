import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Advocate } from './advocate';

@Entity('app')
export class App extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  name: string;

  @Column({
    unique: true,
  })
  app_id: string;

  @ManyToMany(() => Advocate, (advocate) => advocate.apps)
  advocates: Advocate[];
}
