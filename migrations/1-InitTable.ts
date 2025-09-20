import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersTable1737446400000 implements MigrationInterface {
    name = 'CreateUsersTable1737446400000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Enable UUID extension
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
        
        // Create users table
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "first_name" character varying(255) NOT NULL,
                "last_name" character varying(255) NOT NULL,
                "email" character varying(255) NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_users_email" UNIQUE ("email"),
                CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
            )
        `);

        // Create index for email lookups
        await queryRunner.query(`
            CREATE INDEX "IDX_users_email" ON "users" ("email")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop users table
        await queryRunner.query(`DROP TABLE "users"`);
    }
}