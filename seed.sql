-- Resets and sets up the database schema for the Lynix application.
-- WARNING: This will delete all existing data in the tables below.

-- Drop existing tables in reverse order of dependency to avoid errors.
DROP TABLE IF EXISTS "contacts";
DROP TABLE IF EXISTS "chat_messages";
DROP TABLE IF EXISTS "mails";
DROP TABLE IF EXISTS "notes";
DROP TABLE IF EXISTS "users";

-- Create the "users" table first, as other tables depend on it.
CREATE TABLE "users" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR(255) NOT NULL UNIQUE,
    "email" VARCHAR(255) UNIQUE,
    "sipTalkId" VARCHAR(50) UNIQUE,
    "password" VARCHAR(255) NOT NULL,
    "role" VARCHAR(50) NOT NULL,
    "billingStatus" VARCHAR(50) NOT NULL,
    "features" JSONB NOT NULL
);

-- Create the "contacts" table
CREATE TABLE "contacts" (
    "id" SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255),
    "phone" VARCHAR(50)
);

-- Create the "notes" table
CREATE TABLE "notes" (
    "id" SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT,
    "lastModified" BIGINT NOT NULL
);

-- Create the "chat_messages" table
CREATE TABLE "chat_messages" (
    "id" SERIAL PRIMARY KEY,
    "senderId" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "receiverId" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "text" TEXT NOT NULL,
    "timestamp" BIGINT NOT NULL
);

-- Create the "mails" table (for the demo mail feature)
CREATE TABLE "mails" (
    "id" SERIAL PRIMARY KEY,
    "from" JSONB NOT NULL,
    "to" VARCHAR(255) NOT NULL,
    "subject" VARCHAR(255) NOT NULL,
    "body" TEXT,
    "timestamp" BIGINT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT FALSE
);


-- ========== INITIAL DATA SEEDING ==========

-- Seed your admin user (ID will be 1)
INSERT INTO "users" ("username", "email", "sipTalkId", "password", "role", "billingStatus", "features") VALUES
('daradmin', 'djteam.me.joshua@gmail.com', '+14162099973', 'DJTeam2013', 'Admin', 'On Time', '{"dialer": true, "ai": true, "mail": true, "chat": true}');

-- Seed a standard user for testing chat (ID will be 2)
INSERT INTO "users" ("username", "email", "sipTalkId", "password", "role", "billingStatus", "features") VALUES
('demo', 'demo@lynixity.x10.bz', '0470000002', 'password', 'Standard', 'On Time', '{"dialer": false, "ai": true, "mail": true, "chat": true}');

-- Seed a demo contact for the admin user
INSERT INTO "contacts" ("userId", "name", "email", "phone") VALUES
(1, 'Demo User', 'demo@lynixity.x10.bz', '555-1234');

-- Seed a demo note for the admin user
INSERT INTO "notes" ("userId", "title", "content", "lastModified") VALUES
(1, 'Welcome to Notepad!', 'This is your first note. You can edit or delete this and create new ones.', EXTRACT(EPOCH FROM NOW()) * 1000);

-- Seed demo mail for the admin user
INSERT INTO "mails" ("from", "to", "subject", "body", "timestamp", "read") VALUES
('{"name": "Lynix Support", "email": "support@lynixity.x10.bz"}', 'djteam.me.joshua@gmail.com', 'Welcome to LocalMail!', 'Hello and welcome to the new LocalMail feature!\n\nThis is a demonstration of the mail client interface. You can browse, read, and compose messages.\n\nEnjoy exploring!\n\nThe Lynix Team', (EXTRACT(EPOCH FROM NOW()) * 1000)::bigint - 300000, false),
('{"name": "Project Updates", "email": "updates@lynix.dev"}', 'djteam.me.joshua@gmail.com', 'Q3 Project Roadmap', 'Hi team,\n\nPlease find the attached roadmap for our projects in the third quarter. We have some exciting updates coming up for the Notepad and Dialer apps.\n\nBest,\nManagement', (EXTRACT(EPOCH FROM NOW()) * 1000)::bigint - 7200000, true);

-- Seed a demo chat between admin (ID 1) and demo user (ID 2)
INSERT INTO "chat_messages" ("senderId", "receiverId", "text", "timestamp") VALUES
(2, 1, 'Hey Admin, just testing out the new chat feature!', (EXTRACT(EPOCH FROM NOW()) * 1000)::bigint - 60000);
