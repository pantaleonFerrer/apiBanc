const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Migrations1738864596178 {
    name = 'Migrations1738864596178'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "amount"`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "amount" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "operation" DROP COLUMN "amount"`);
        await queryRunner.query(`ALTER TABLE "operation" ADD "amount" double precision NOT NULL`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "operation" DROP COLUMN "amount"`);
        await queryRunner.query(`ALTER TABLE "operation" ADD "amount" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "amount"`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "amount" integer NOT NULL`);
    }
}
