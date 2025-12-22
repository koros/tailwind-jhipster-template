import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne } from 'typeorm';
import { Todo } from './Todo';
import { UserImage } from './UserImage';

@Entity('jhi_user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true, length: 50 })
  login: string;

  @Column({ type: 'varchar', length: 60 })
  password: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  firstName: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  lastName: string;

  @Column({ type: 'varchar', unique: true, length: 191 })
  email: string;

  @Column({ type: 'boolean', default: false })
  activated: boolean;

  @Column({ type: 'varchar', length: 10, default: 'en' })
  langKey: string;

  @Column({ type: 'varchar', length: 256, nullable: true })
  imageUrl: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  activationKey: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  resetKey: string | null;

  @Column({ type: 'timestamp', nullable: true })
  resetDate: Date | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  createdBy: string;

  @CreateDateColumn()
  createdDate: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  lastModifiedBy: string;

  @UpdateDateColumn()
  lastModifiedDate: Date;

  @Column({ type: 'varchar', length: 255, default: 'ROLE_USER' })
  authorities: string;

  @Column({ type: 'text', nullable: true })
  refreshToken: string | null;

  @OneToMany(() => Todo, todo => todo.user)
  todos: Todo[];

  @OneToOne(() => UserImage, userImage => userImage.user)
  userImage: any;
}
