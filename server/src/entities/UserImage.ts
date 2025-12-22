import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity('jhi_user_image')
export class UserImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bytea' })
  image: Buffer;

  @Column({ type: 'varchar', length: 50 })
  contentType: string;

  @OneToOne(() => User, user => user.userImage)
  @JoinColumn()
  user: User;
}
