import {MigrationInterface, QueryRunner} from "typeorm";

export class setup1599885617753 implements MigrationInterface {
    name = 'setup1599885617753'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "project_skill" ("projectId" integer NOT NULL, "skillId" integer NOT NULL, CONSTRAINT "PK_3fa8d58669bcdbebcf9f8f56a69" PRIMARY KEY ("projectId", "skillId"))`);
        await queryRunner.query(`CREATE TABLE "user_skill" ("userId" integer NOT NULL, "skillId" integer NOT NULL, CONSTRAINT "PK_ad35af7f2b556d0b9a67af8db8b" PRIMARY KEY ("userId", "skillId"))`);
        await queryRunner.query(`CREATE TABLE "skill" ("id" SERIAL NOT NULL, "type" character varying NOT NULL, CONSTRAINT "UQ_1a0c4a75b6e0db5207b0bf7659a" UNIQUE ("type"), CONSTRAINT "PK_a0d33334424e64fb78dc3ce7196" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "desc" character varying NOT NULL, "points" integer NOT NULL DEFAULT 0, "creatorId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project_category" ("projectId" integer NOT NULL, "categoryId" integer NOT NULL, CONSTRAINT "PK_f9ce2c2da01ed368fa7ca095f31" PRIMARY KEY ("projectId", "categoryId"))`);
        await queryRunner.query(`CREATE TABLE "category" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "project_skill" ADD CONSTRAINT "FK_960e313c4196524222f7dfd2a87" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_skill" ADD CONSTRAINT "FK_97af292ff0eaa431e132d507649" FOREIGN KEY ("skillId") REFERENCES "skill"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_skill" ADD CONSTRAINT "FK_03260daf2df95f4492cc8eb00e6" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_skill" ADD CONSTRAINT "FK_49db81d31fc330a905af3c01205" FOREIGN KEY ("skillId") REFERENCES "skill"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_cfb02dac45e9dec5b82f960b3e3" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_category" ADD CONSTRAINT "FK_1d5cb5254bc78e09cb3cbde123d" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_category" ADD CONSTRAINT "FK_37ecc11e0897c93df535771a9de" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_category" DROP CONSTRAINT "FK_37ecc11e0897c93df535771a9de"`);
        await queryRunner.query(`ALTER TABLE "project_category" DROP CONSTRAINT "FK_1d5cb5254bc78e09cb3cbde123d"`);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_cfb02dac45e9dec5b82f960b3e3"`);
        await queryRunner.query(`ALTER TABLE "user_skill" DROP CONSTRAINT "FK_49db81d31fc330a905af3c01205"`);
        await queryRunner.query(`ALTER TABLE "user_skill" DROP CONSTRAINT "FK_03260daf2df95f4492cc8eb00e6"`);
        await queryRunner.query(`ALTER TABLE "project_skill" DROP CONSTRAINT "FK_97af292ff0eaa431e132d507649"`);
        await queryRunner.query(`ALTER TABLE "project_skill" DROP CONSTRAINT "FK_960e313c4196524222f7dfd2a87"`);
        await queryRunner.query(`DROP TABLE "category"`);
        await queryRunner.query(`DROP TABLE "project_category"`);
        await queryRunner.query(`DROP TABLE "project"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "skill"`);
        await queryRunner.query(`DROP TABLE "user_skill"`);
        await queryRunner.query(`DROP TABLE "project_skill"`);
    }

}
