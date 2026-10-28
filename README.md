# Replacing In-Memory CRUD with Prisma — All Four Routes

This project implements persistent CRUD operations for threads using Express, Prisma, and PostgreSQL.

## Requirements

- Node.js 20 or newer
- PostgreSQL
- npm

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and set `DATABASE_URL` to your PostgreSQL database.

3. Generate the Prisma client and create the database table:

   ```bash
   npx prisma generate --schema=server/prisma/schema.prisma
   npx prisma migrate dev --schema=server/prisma/schema.prisma --name init
   ```

4. Start the server:

   ```bash
   npm start
   ```

The API listens on port 3000 by default. Set `PORT` in `.env` to change it.

## Routes

| Method | Path | Purpose | Success status |
| --- | --- | --- | --- |
| GET | `/api/threads` | List threads, newest first | 200 |
| POST | `/api/threads` | Create a thread | 201 |
| PUT | `/api/threads/:id` | Update a thread | 200 |
| DELETE | `/api/threads/:id` | Delete a thread | 200 |

### Example request bodies

Create:

```json
{ "title": "My first thread", "body": "A persisted thread body" }
```

Update:

```json
{ "title": "Updated title" }
```

All route handlers use Prisma database operations and forward unexpected errors to Express error middleware. A missing thread on update or delete returns 404.

## Persistence check

After creating a thread, restart the server and call `GET /api/threads`. The record remains because it is stored in PostgreSQL, not an in-memory array. You can also inspect the table with:

```sql
SELECT * FROM "Thread";
```

## Notes

- Never commit your real `.env` file or database credentials.
- This repository contains the implementation and setup instructions; database-backed runtime verification requires a configured PostgreSQL instance.
