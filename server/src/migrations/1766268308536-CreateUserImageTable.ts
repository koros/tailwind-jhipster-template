import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserImageTable1766268308536 implements MigrationInterface {
  name = 'CreateUserImageTable1766268308536';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "todo" DROP CONSTRAINT "FK_todo_user"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_todo_user_id"`);
    await queryRunner.query(
      `CREATE TABLE "jhi_user_image" ("id" SERIAL NOT NULL, "image" bytea NOT NULL, "contentType" character varying(50) NOT NULL, "userId" integer, CONSTRAINT "REL_b09727289c79649dbb8aba336d" UNIQUE ("userId"), CONSTRAINT "PK_ad28f237dc8f75a5ca17f6d1260" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "todo" ADD CONSTRAINT "FK_9cb7989853c4cb7fe427db4b260" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "jhi_user_image" ADD CONSTRAINT "FK_b09727289c79649dbb8aba336de" FOREIGN KEY ("userId") REFERENCES "jhi_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "jhi_user_image" DROP CONSTRAINT "FK_b09727289c79649dbb8aba336de"`);
    await queryRunner.query(`ALTER TABLE "todo" DROP CONSTRAINT "FK_9cb7989853c4cb7fe427db4b260"`);
    await queryRunner.query(`DROP TABLE "jhi_user_image"`);
    await queryRunner.query(`CREATE INDEX "IDX_todo_user_id" ON "todo" ("user_id") `);
    await queryRunner.query(
      `ALTER TABLE "todo" ADD CONSTRAINT "FK_todo_user" FOREIGN KEY ("user_id") REFERENCES "jhi_user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }
}
