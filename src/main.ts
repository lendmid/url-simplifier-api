import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as process from 'process';
import { useContainer } from 'class-validator';
import { setupSwagger } from './configs/swagger';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

const { PORT } = process.env;

const origins = ['3-n.in'];
if (process.env.NODE_ENV === 'development')
  origins.push('http://localhost:5173');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');
  app.use(helmet());
  app.enableCors({ origin: origins });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  if (process.env.NODE_ENV !== 'development') {
    app.use(
      rateLimit({
        windowMs: 10 * 60 * 1000, // 10 minutes
        max: 100, // Limit each IP to 100 requests per `window`
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers,
        skipSuccessfulRequests: false,
        message: { message: 'Too many requests', statusCode: 403 },
      }),
    );
  }

  setupSwagger(app);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(PORT || 3001, '0.0.0.0');

  console.log('host: ', await app.getUrl());
  console.log(`NODE_ENV: `, process.env.NODE_ENV);
}

bootstrap();
