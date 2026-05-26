import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Topic } from './topic.entity';

@Entity('subjects')
export class Subject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 255, nullable: true })
  image_url: string;

  @Column({ length: 50 })
  year: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Topic, (topic) => topic.subject)
  topics: Topic[];
}
