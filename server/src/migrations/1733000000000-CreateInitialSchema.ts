import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialSchema1733000000000 implements MigrationInterface {
  name = 'CreateInitialSchema1733000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create jhi_user table
    await queryRunner.query(`
      CREATE TABLE "jhi_user" (
        "id" SERIAL NOT NULL,
        "login" character varying(50) NOT NULL,
        "password" character varying(60) NOT NULL,
        "firstName" character varying(50),
        "lastName" character varying(50),
        "email" character varying(191) NOT NULL,
        "activated" boolean NOT NULL DEFAULT false,
        "langKey" character varying(10) NOT NULL DEFAULT 'en',
        "imageUrl" character varying(256),
        "activationKey" character varying(20),
        "resetKey" character varying(20),
        "resetDate" TIMESTAMP,
        "createdBy" character varying(50),
        "createdDate" TIMESTAMP NOT NULL DEFAULT now(),
        "lastModifiedBy" character varying(50),
        "lastModifiedDate" TIMESTAMP NOT NULL DEFAULT now(),
        "authorities" character varying(255) NOT NULL DEFAULT 'ROLE_USER',
        "refreshToken" text,
        CONSTRAINT "PK_jhi_user_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_jhi_user_login" UNIQUE ("login"),
        CONSTRAINT "UQ_jhi_user_email" UNIQUE ("email")
      )
    `);

    // Create todo table
    await queryRunner.query(`
      CREATE TABLE "todo" (
        "id" SERIAL NOT NULL,
        "title" character varying(140) NOT NULL,
        "description" text,
        "status" character varying(20) NOT NULL DEFAULT 'PENDING',
        "priority" character varying(20) NOT NULL DEFAULT 'LOW',
        "dueDate" TIMESTAMP,
        "completed" boolean NOT NULL DEFAULT false,
        "createdDate" TIMESTAMP NOT NULL DEFAULT now(),
        "lastModifiedDate" TIMESTAMP NOT NULL DEFAULT now(),
        "user_id" integer,
        CONSTRAINT "PK_todo_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_todo_user" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION
      )
    `);

    // Create index on user_id
    await queryRunner.query(`
      CREATE INDEX "IDX_todo_user_id" ON "todo" ("user_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_todo_user_id"`);
    await queryRunner.query(`DROP TABLE "todo"`);
    await queryRunner.query(`DROP TABLE "jhi_user"`);
  }
}
