import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Topic } from './topic.entity';
import { Progress } from './progress.entity';

export enum ChallengeType {
  MULTIPLE_CHOICE = 'multiple_choice',
  TRUE_FALSE = 'true_false',
}

@Entity('challenges')
export class Challenge {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  content_url: string;

  @Column({ type: 'json' })
  options: string[];

  @Column({ length: 255 })
  correct_answer: string;

  @Column({ type: 'int', default: 10 })
  points: number;

  @Column({ type: 'enum', enum: ChallengeType, default: ChallengeType.MULTIPLE_CHOICE })
  type: ChallengeType;

  @Column({ name: 'topic_id' })
  topic_id: number;

  @ManyToOne(() => Topic, (topic) => topic.challenges)
  @JoinColumn({ name: 'topic_id' })
  topic: Topic;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Progress, (progress) => progress.challenge)
  progress: Progress[];
}
