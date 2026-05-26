import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { Subject, Topic, Challenge, ChallengeType } from './entities';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const ds = app.get(DataSource);

  const subjectRepo = ds.getRepository(Subject);
  const topicRepo = ds.getRepository(Topic);
  const challengeRepo = ds.getRepository(Challenge);

  const existingSubject = await subjectRepo.findOne({ where: { name: 'Matemáticas' } });
  if (existingSubject) {
    console.log('Seed data already exists, skipping.');
    await app.close();
    return;
  }

  const math = await subjectRepo.save({
    name: 'Matemáticas',
    description: 'Contenido completo de Matemáticas para 3er año de bachillerato. Incluye álgebra, funciones, geometría y estadística.',
    image_url: '/images/math.svg',
    year: '3er Año',
  });

  const topics = await topicRepo.save([
    {
      subject_id: math.id,
      title: 'Ecuaciones de Primer Grado',
      content_url: '/content/ecuaciones-primer-grado.md',
      order: 1,
    },
    {
      subject_id: math.id,
      title: 'Sistemas de Ecuaciones Lineales',
      content_url: '/content/sistemas-ecuaciones.md',
      order: 2,
    },
    {
      subject_id: math.id,
      title: 'Funciones Lineales y Cuadráticas',
      content_url: '/content/funciones-lineales-cuadraticas.md',
      order: 3,
    },
    {
      subject_id: math.id,
      title: 'Geometría del Plano',
      content_url: '/content/geometria-plano.md',
      order: 4,
    },
    {
      subject_id: math.id,
      title: 'Estadística Descriptiva',
      content_url: '/content/estadistica-descriptiva.md',
      order: 5,
    },
  ]);

  await challengeRepo.save([
    {
      topic_id: topics[0].id,
      content_url: '/content/challenges/challenge-1.md',
      options: ['3', '5', '7', '15'],
      correct_answer: '5',
      points: 10,
      type: ChallengeType.MULTIPLE_CHOICE,
    },
    {
      topic_id: topics[0].id,
      content_url: '/content/challenges/challenge-2.md',
      options: ['7', '8', '10', '14'],
      correct_answer: '10',
      points: 10,
      type: ChallengeType.MULTIPLE_CHOICE,
    },
    {
      topic_id: topics[0].id,
      content_url: '/content/challenges/challenge-3.md',
      options: ['Verdadero', 'Falso'],
      correct_answer: 'Falso',
      points: 5,
      type: ChallengeType.TRUE_FALSE,
    },
    {
      topic_id: topics[1].id,
      content_url: '/content/challenges/challenge-4.md',
      options: ['(3, 4)', '(4, 3)', '(5, 2)', '(2, 5)'],
      correct_answer: '(4, 3)',
      points: 15,
      type: ChallengeType.MULTIPLE_CHOICE,
    },
    {
      topic_id: topics[1].id,
      content_url: '/content/challenges/challenge-5.md',
      options: ['(3, 2)', '(2, 1)', '(4, 3)', '(1, 0)'],
      correct_answer: '(3, 2)',
      points: 15,
      type: ChallengeType.MULTIPLE_CHOICE,
    },
    {
      topic_id: topics[2].id,
      content_url: '/content/challenges/challenge-6.md',
      options: ['5', '-3', '3', '-5'],
      correct_answer: '-3',
      points: 10,
      type: ChallengeType.MULTIPLE_CHOICE,
    },
    {
      topic_id: topics[2].id,
      content_url: '/content/challenges/challenge-7.md',
      options: ['Verdadero', 'Falso'],
      correct_answer: 'Verdadero',
      points: 10,
      type: ChallengeType.TRUE_FALSE,
    },
    {
      topic_id: topics[2].id,
      content_url: '/content/challenges/challenge-8.md',
      options: ['(2, -1)', '(-2, 15)', '(2, 3)', '(-2, -1)'],
      correct_answer: '(2, -1)',
      points: 15,
      type: ChallengeType.MULTIPLE_CHOICE,
    },
    {
      topic_id: topics[3].id,
      content_url: '/content/challenges/challenge-9.md',
      options: ['5 cm', '6 cm', '7 cm', '12 cm'],
      correct_answer: '5 cm',
      points: 10,
      type: ChallengeType.MULTIPLE_CHOICE,
    },
    {
      topic_id: topics[3].id,
      content_url: '/content/challenges/challenge-10.md',
      options: ['Verdadero', 'Falso'],
      correct_answer: 'Verdadero',
      points: 5,
      type: ChallengeType.TRUE_FALSE,
    },
    {
      topic_id: topics[4].id,
      content_url: '/content/challenges/challenge-11.md',
      options: ['5', '6', '7', '8'],
      correct_answer: '6',
      points: 10,
      type: ChallengeType.MULTIPLE_CHOICE,
    },
    {
      topic_id: topics[4].id,
      content_url: '/content/challenges/challenge-12.md',
      options: ['3', '5', '7', '9'],
      correct_answer: '5',
      points: 10,
      type: ChallengeType.MULTIPLE_CHOICE,
    },
  ]);

  console.log('Seed created: Matemáticas - 3er Año with topics and challenges');

  await app.close();
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
