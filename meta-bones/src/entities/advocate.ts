import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { App } from './app';

@Entity('advocate')
export class Advocate extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  advocate_id: string;

  @ManyToMany(() => App, (app) => app.advocates)
  @JoinTable()
  apps: App[];
}
