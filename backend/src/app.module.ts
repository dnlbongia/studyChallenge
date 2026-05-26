import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import databaseConfig from './config/database.config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SubjectsModule } from './subjects/subjects.module';
import { TopicsModule } from './topics/topics.module';
import { ChallengesModule } from './challenges/challenges.module';
import { ProgressModule } from './progress/progress.module';
import { User } from './entities/user.entity';
import { Subject } from './entities/subject.entity';
import { Topic } from './entities/topic.entity';
import { Challenge } from './entities/challenge.entity';
import { Progress } from './entities/progress.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [databaseConfig] }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'content'),
      serveRoot: '/content',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('database.host'),
        port: config.get<number>('database.port'),
        username: config.get<string>('database.username'),
        password: config.get<string>('database.password'),
        database: config.get<string>('database.database'),
        entities: [User, Subject, Topic, Challenge, Progress],
        charset: 'utf8mb4',
        synchronize: true,
      }),
    }),
    AuthModule,
    UsersModule,
    SubjectsModule,
    TopicsModule,
    ChallengesModule,
    ProgressModule,
  ],
})
export class AppModule {}
