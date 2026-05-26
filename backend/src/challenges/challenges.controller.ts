import { Controller, Get, Param, UseGuards, Req } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';

@Controller('challenges')
export class ChallengesController {
  constructor(private challengesService: ChallengesService) {}

  @Get('topic/:topicId')
  findByTopic(@Param('topicId') topicId: string) {
    return this.challengesService.findByTopic(+topicId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.challengesService.findOne(+id);
  }
}
