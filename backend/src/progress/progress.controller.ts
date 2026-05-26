import { Controller, Post, Get, Body, Param, UseGuards, Req, NotFoundException } from '@nestjs/common';
import type { Request } from 'express';
import { ProgressService } from './progress.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { ChallengesService } from '../challenges/challenges.service';

@UseGuards(JwtAuthGuard)
@Controller('progress')
export class ProgressController {
  constructor(
    private progressService: ProgressService,
    private challengesService: ChallengesService,
  ) {}

  @Post('submit')
  async submitAnswer(
    @Req() req: Request,
    @Body() body: { challengeId: number; answer: string },
  ) {
    const challenge = await this.challengesService.findOne(body.challengeId);
    if (!challenge) throw new NotFoundException('Challenge not found');
    return this.progressService.submitAnswer(
      (req as any).user.id,
      body.challengeId,
      body.answer,
      challenge.correct_answer,
      challenge.points,
    );
  }

  @Get('me')
  getMyProgress(@Req() req: Request) {
    return this.progressService.getUserProgress((req as any).user.id);
  }

  @Get('me/topic/:topicId')
  getTopicProgress(@Req() req: Request, @Param('topicId') topicId: string) {
    return this.progressService.getUserProgress((req as any).user.id, +topicId);
  }
}
