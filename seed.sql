-- Resets and sets up the database schema for the Lynix application.
-- WARNING: This will delete all existing data in the tables below.

-- Drop existing tables in reverse order of dependency to avoid errors.
DROP TABLE IF EXISTS "contacts";
DROP TABLE IF EXISTS "chat_messages";
DROP TABLE IF EXISTS "mails";
DROP TABLE IF EXISTS "notes";
DROP TABLE IF EXISTS "users";

-- Create Users Table: Stores user accounts and permissions
CREATE TABLE "users" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR(255) UNIQUE NOT NULL,
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "sipTalkId" VARCHAR(255) UNIQUE NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" VARCHAR(50) NOT NULL,
    "billingStatus" VARCHAR(50) NOT NULL,
    "features" JSONB NOT NULL
);

-- Create Notes Table: Stores user-specific notes
CREATE TABLE "notes" (
    "id" SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "lastModified" BIGINT NOT NULL
);

-- Create Mails Table: Stores messages for the LocalMail app
CREATE TABLE "mails" (
    "id" SERIAL PRIMARY KEY,
    "from" JSONB NOT NULL,
    "to" VARCHAR(255) NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT,
    "timestamp" BIGINT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT FALSE
);

-- Create Chat Messages Table: Stores all chat messages between users
CREATE TABLE "chat_messages" (
    "id" SERIAL PRIMARY KEY,
    "senderId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "timestamp" BIGINT NOT NULL
);

-- Create Contacts Table: Stores user-specific contacts
CREATE TABLE "contacts" (
    "id" SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255),
    "phone" VARCHAR(50)
);

-- --- Initial Data Seeding ---

-- Seed the single admin user as requested
INSERT INTO "users" ("username", "email", "sipTalkId", "password", "role", "billingStatus", "features") VALUES
('daradmin', 'admin@lynixity.x10.bz', '0470000000', 'DJTeam2013', 'Admin', 'On Time', '{"dialer": true, "ai": true, "mail": true, "chat": true}');
