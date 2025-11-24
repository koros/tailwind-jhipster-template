import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1763987331984 implements MigrationInterface {
  name = 'InitialSchema1763987331984';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "jhi_user" ADD "refreshToken" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "jhi_user" DROP COLUMN "refreshToken"`);
  }
}
