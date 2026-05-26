import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';
import { existsSync } from 'fs';
import type { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  if (process.env.NODE_ENV === 'production') {
    const distPath = join(__dirname, '..', '..', 'frontend', 'dist');
    if (existsSync(distPath)) {
      app.useStaticAssets(distPath);
      app.use((req: Request, res: Response, next: NextFunction) => {
        if (!req.path.startsWith('/api') && !req.path.startsWith('/content')) {
          res.sendFile(join(distPath, 'index.html'));
        } else {
          next();
        }
      });
    }
  }

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Backend running on http://0.0.0.0:${port}`);
}
bootstrap();
