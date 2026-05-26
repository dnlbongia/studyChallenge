import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from '../entities/subject.entity';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectRepository(Subject)
    private subjectsRepo: Repository<Subject>,
  ) {}

  findAll(): Promise<Subject[]> {
    return this.subjectsRepo.find({ order: { year: 'ASC', name: 'ASC' } });
  }

  findByYear(year: string): Promise<Subject[]> {
    return this.subjectsRepo.find({ where: { year }, order: { name: 'ASC' } });
  }

  findOne(id: number): Promise<Subject | null> {
    return this.subjectsRepo.findOne({
      where: { id },
      relations: { topics: true },
    });
  }
}
