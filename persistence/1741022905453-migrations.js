const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Migrations1741022905453 {
    name = 'Migrations1741022905453'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "card" ADD CONSTRAINT "UQ_8d1341cc81db9cdb37b2fef66fe" UNIQUE ("linkedAccount")`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "card" DROP CONSTRAINT "UQ_8d1341cc81db9cdb37b2fef66fe"`);
    }
}
