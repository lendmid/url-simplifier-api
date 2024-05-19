import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as process from 'process';
import { useContainer } from 'class-validator';
import { setupSwagger } from './configs/swagger';

const { PORT } = process.env;

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

  await app.listen(PORT || 3001, '0.0.0.0');

  console.log('host: ', await app.getUrl());
  console.log(`NODE_ENV: `, process.env.NODE_ENV);
}

bootstrap();
