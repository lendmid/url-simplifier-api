import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UrlModule } from './url/url.module';
import * as dotenv from 'dotenv';
import { DatabaseModule } from './database/database.module';

const environment = process.env.NODE_ENV || 'development';
dotenv.config({ path: `.env.${environment}` });

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UrlModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
