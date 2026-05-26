import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { User } from './user.entity';
import { Challenge } from './challenge.entity';

@Entity('progress')
@Unique(['user_id', 'challenge_id'])
export class Progress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  user_id: number;

  @Column({ name: 'challenge_id' })
  challenge_id: number;

  @Column({ type: 'boolean', default: false })
  completed: boolean;

  @Column({ type: 'int', default: 0 })
  score: number;

  @ManyToOne(() => User, (user) => user.progress)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Challenge, (challenge) => challenge.progress)
  @JoinColumn({ name: 'challenge_id' })
  challenge: Challenge;

  @CreateDateColumn()
  completed_at: Date;
}
