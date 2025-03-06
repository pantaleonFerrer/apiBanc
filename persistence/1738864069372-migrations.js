const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Migrations1738864069372 {
    name = 'Migrations1738864069372'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "balance"`);
        await queryRunner.query(`ALTER TABLE "account" ADD "balance" double precision NOT NULL`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "balance"`);
        await queryRunner.query(`ALTER TABLE "account" ADD "balance" integer NOT NULL`);
    }
}
