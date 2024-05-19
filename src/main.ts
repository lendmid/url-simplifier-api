import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as process from 'process';
import { useContainer } from 'class-validator';
import { setupSwagger } from './configs/swagger';

const { BASE_URL, PORT } = process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  setupSwagger(app);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(PORT || 3001, BASE_URL || '0.0.0.0', () => {
    console.log(`Listening on ${BASE_URL}:${PORT || 3001}`);
  });
}

bootstrap();
