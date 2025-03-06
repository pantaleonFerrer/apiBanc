const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Migrations1738855728113 {
    name = 'Migrations1738855728113'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "surname"`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user" ADD "surname" character varying NOT NULL`);
    }
}
