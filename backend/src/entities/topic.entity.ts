import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Subject } from './subject.entity';
import { Challenge } from './challenge.entity';

@Entity('topics')
export class Topic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  title: string;

  @Column({ length: 255 })
  content_url: string;

  @Column({ type: 'int', default: 0 })
  order: number;

  @Column({ name: 'subject_id' })
  subject_id: number;

  @ManyToOne(() => Subject, (subject) => subject.topics)
  @JoinColumn({ name: 'subject_id' })
  subject: Subject;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Challenge, (challenge) => challenge.topic)
  challenges: Challenge[];
}
