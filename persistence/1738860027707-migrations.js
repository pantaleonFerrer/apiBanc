const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Migrations1738860027707 {
    name = 'Migrations1738860027707'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "conversionRates" DROP COLUMN "rate"`);
        await queryRunner.query(`ALTER TABLE "conversionRates" ADD "rate" numeric NOT NULL`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "conversionRates" DROP COLUMN "rate"`);
        await queryRunner.query(`ALTER TABLE "conversionRates" ADD "rate" integer NOT NULL`);
    }
}
