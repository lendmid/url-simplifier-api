import { MigrationInterface, QueryRunner } from 'typeorm';

export class Base1716229849895 implements MigrationInterface {
  name = 'Base1716229849895';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "url" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "longUrl" varchar NOT NULL, "shortUrl" varchar NOT NULL, "hash" varchar NOT NULL, "visited" integer NOT NULL)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "url"`);
  }
}
