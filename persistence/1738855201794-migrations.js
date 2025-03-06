const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Migrations1738855201794 {
    name = 'Migrations1738855201794'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "user" ("id" character varying NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "surname" character varying NOT NULL, "isAdmin" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "transaction" ("id" character varying NOT NULL, "accountNumber" character varying NOT NULL, "type" character varying NOT NULL, "amount" integer NOT NULL, "currency" character varying(3) NOT NULL, "date" TIMESTAMP NOT NULL DEFAULT now(), "desc" character varying, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "operation" ("id" character varying NOT NULL, "cardNumber" character varying NOT NULL, "type" character varying NOT NULL, "amount" integer NOT NULL, "date" TIMESTAMP NOT NULL DEFAULT now(), "desc" character varying, CONSTRAINT "PK_18556ee6e49c005fc108078f3ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "conversionRates" ("id" character varying NOT NULL, "fromCurrency" character varying NOT NULL, "toCurrency" character varying NOT NULL, "rate" integer NOT NULL, CONSTRAINT "PK_9f8f3d9673c7ef864dcfc7892eb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "card" ("cardNumber" character varying NOT NULL, "linkedAccount" character varying NOT NULL, "cardType" character varying NOT NULL, "cardLimit" integer NOT NULL, "credit" integer NOT NULL, "pin" character varying NOT NULL, "userId" character varying NOT NULL, "monthlyInterest" integer NOT NULL, CONSTRAINT "PK_8ebe167503f779123f14c35dd43" PRIMARY KEY ("cardNumber"))`);
        await queryRunner.query(`CREATE TABLE "account" ("accountNumber" character varying NOT NULL, "currency" character varying NOT NULL, "balance" integer NOT NULL, "accountType" character varying NOT NULL, "dailyLimit" integer NOT NULL, "userId" character varying NOT NULL, CONSTRAINT "PK_ee66d482ebdf84a768a7da36b08" PRIMARY KEY ("accountNumber"))`);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "account"`);
        await queryRunner.query(`DROP TABLE "card"`);
        await queryRunner.query(`DROP TABLE "conversionRates"`);
        await queryRunner.query(`DROP TABLE "operation"`);
        await queryRunner.query(`DROP TABLE "transaction"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }
}
