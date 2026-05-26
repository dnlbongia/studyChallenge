import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Topic } from '../entities/topic.entity';

@Injectable()
export class TopicsService {
  constructor(
    @InjectRepository(Topic)
    private topicsRepo: Repository<Topic>,
  ) {}

  findBySubject(subjectId: number): Promise<Topic[]> {
    return this.topicsRepo.find({
      where: { subject_id: subjectId },
      order: { order: 'ASC' },
    });
  }

  findOne(id: number): Promise<Topic | null> {
    return this.topicsRepo.findOne({
      where: { id },
      relations: { challenges: true },
    });
  }
}
