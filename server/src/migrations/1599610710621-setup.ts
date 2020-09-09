import { MigrationInterface, QueryRunner } from 'typeorm';

export class setup1599610710621 implements MigrationInterface {
  name = 'setup1599610710621';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "skill" ("type" character varying NOT NULL, "id" SERIAL NOT NULL, "userId" integer, "projectId" integer, CONSTRAINT "UQ_1a0c4a75b6e0db5207b0bf7659a" UNIQUE ("type"), CONSTRAINT "PK_a0d33334424e64fb78dc3ce7196" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "project" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "desc" character varying NOT NULL, "points" integer NOT NULL DEFAULT 0, "creatorId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "category" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "project_categories_category" ("projectId" integer NOT NULL, "categoryId" integer NOT NULL, CONSTRAINT "PK_284bdc821ce5aa065f75fd92ebb" PRIMARY KEY ("projectId", "categoryId"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c69602ecc23990f6c11b1ed470" ON "project_categories_category" ("projectId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9b47f8b749484ae8bcb6b2550b" ON "project_categories_category" ("categoryId") `
    );
    await queryRunner.query(
      `ALTER TABLE "skill" ADD CONSTRAINT "FK_c08612011a88745a32784544b28" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "skill" ADD CONSTRAINT "FK_402ed37bff0d3134f6e782455ed" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD CONSTRAINT "FK_cfb02dac45e9dec5b82f960b3e3" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "project_categories_category" ADD CONSTRAINT "FK_c69602ecc23990f6c11b1ed4700" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "project_categories_category" ADD CONSTRAINT "FK_9b47f8b749484ae8bcb6b2550b7" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_categories_category" DROP CONSTRAINT "FK_9b47f8b749484ae8bcb6b2550b7"`
    );
    await queryRunner.query(
      `ALTER TABLE "project_categories_category" DROP CONSTRAINT "FK_c69602ecc23990f6c11b1ed4700"`
    );
    await queryRunner.query(
      `ALTER TABLE "project" DROP CONSTRAINT "FK_cfb02dac45e9dec5b82f960b3e3"`
    );
    await queryRunner.query(
      `ALTER TABLE "skill" DROP CONSTRAINT "FK_402ed37bff0d3134f6e782455ed"`
    );
    await queryRunner.query(
      `ALTER TABLE "skill" DROP CONSTRAINT "FK_c08612011a88745a32784544b28"`
    );
    await queryRunner.query(`DROP INDEX "IDX_9b47f8b749484ae8bcb6b2550b"`);
    await queryRunner.query(`DROP INDEX "IDX_c69602ecc23990f6c11b1ed470"`);
    await queryRunner.query(`DROP TABLE "project_categories_category"`);
    await queryRunner.query(`DROP TABLE "category"`);
    await queryRunner.query(`DROP TABLE "project"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "skill"`);
  }
}
