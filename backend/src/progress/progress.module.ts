import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Progress } from '../entities/progress.entity';
import { ProgressController } from './progress.controller';
import { ProgressService } from './progress.service';
import { ChallengesModule } from '../challenges/challenges.module';

@Module({
  imports: [TypeOrmModule.forFeature([Progress]), ChallengesModule],
  controllers: [ProgressController],
  providers: [ProgressService],
})
export class ProgressModule {}
