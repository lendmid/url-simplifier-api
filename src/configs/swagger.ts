import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Url`s simplifier API')
    .setDescription(
      'Simple web server with a local database that can perform basic operations with users',
    )
    .setVersion('1.0')
    .addTag('Urls')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}
