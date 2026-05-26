import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Progress } from '../entities/progress.entity';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(Progress)
    private progressRepo: Repository<Progress>,
  ) {}

  async submitAnswer(userId: number, challengeId: number, answer: string, correctAnswer: string, points: number) {
    const isCorrect = answer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();

    const existing = await this.progressRepo.findOne({
      where: { user_id: userId, challenge_id: challengeId },
    });

    if (existing) {
      if (!existing.completed && isCorrect) {
        existing.completed = true;
        existing.score = points;
        existing.completed_at = new Date();
        await this.progressRepo.save(existing);
      }
      return { progress: existing, correct: isCorrect };
    }

    const progress = this.progressRepo.create({
      user_id: userId,
      challenge_id: challengeId,
      completed: isCorrect,
      score: isCorrect ? points : 0,
    });
    await this.progressRepo.save(progress);
    return { progress, correct: isCorrect };
  }

  async getUserProgress(userId: number, topicId?: number) {
    const where: any = { user_id: userId };
    if (topicId) where.challenge = { topic_id: topicId };

    const progress = await this.progressRepo.find({
      where,
      relations: { challenge: true },
    });

    const total = progress.length;
    const completed = progress.filter((p) => p.completed).length;
    const totalScore = progress.reduce((sum, p) => sum + p.score, 0);

    return { total, completed, totalScore, progress };
  }
}
