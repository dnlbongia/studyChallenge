import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Challenge } from '../entities/challenge.entity';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectRepository(Challenge)
    private challengesRepo: Repository<Challenge>,
  ) {}

  findByTopic(topicId: number): Promise<Challenge[]> {
    return this.challengesRepo.find({ where: { topic_id: topicId } });
  }

  findOne(id: number): Promise<Challenge | null> {
    return this.challengesRepo.findOne({ where: { id } });
  }
}
