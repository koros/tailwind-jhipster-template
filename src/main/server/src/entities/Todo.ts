import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

export enum TodoStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

@Entity('todo')
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 140 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'PENDING',
  })
  status: TodoStatus;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'LOW',
  })
  priority: Priority;

  @Column({ type: 'timestamp', nullable: true })
  dueDate: Date;

  @Column({ type: 'boolean', default: false })
  completed: boolean;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  lastModifiedDate: Date;

  @ManyToOne(() => User, user => user.todos, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
