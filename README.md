# PostgreSQL Master Replica

This project demonstrates a **PostgreSQL 16 primary–standby (master–replica)** setup using Docker Compose and streaming replication, with a TypeORM API for testing database operations.

---

## 📂 Project Structure

```
.
├── docker-compose.yml
├── primary/
│   ├── data/                   # Primary database volume (ignored in git)
│   └── init-replication.sh     # Script to configure primary for replication
├── replica/
│   ├── data/                   # Replica database volume (ignored in git)
│   └── replica-entrypoint.sh   # Script to bootstrap replica via pg_basebackup
├── src/                        # TypeORM API source code
└── package.json                # Node.js dependencies and scripts
```

---

## ⚙️ Setup

### 1. Clone the repo and prepare folders

```bash
git clone <your-repo-url>
cd <your-repo>

# Use npm script to setup directories and permissions
npm run setup
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the PostgreSQL containers

```bash
# Start both primary and replica containers
npm run start-postgress

# Or manually:
docker compose up -d
```

### 4. Run database migrations

After the containers are running, migrate the database:

```bash
npm run migration:run
```

### 5. Start the API server

```bash
npm start
```

The API will be available at `http://localhost:3000`

---

## ▶️ Running

### Quick start (all services):

```bash
npm run setup           # Setup directories
npm run start-postgress # Start PostgreSQL containers
npm run migration:run   # Run database migrations
npm start              # Start API server
```

### Stop everything:

```bash
docker compose down
```

### Clean up (removes all data):

```bash
npm run clean
```

---

## 🔌 API Testing

The TypeORM API provides endpoints for testing database operations across the master-replica setup.

### Create a User

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com"
  }'
```

**Expected Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john.doe@example.com",
  "createdAt": "2024-01-20T10:30:00.000Z"
}
```

### Get All Users

```bash
curl -X GET http://localhost:3000/users
```

**Expected Response:**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "createdAt": "2024-01-20T10:30:00.000Z"
  }
]
```

### Get User by ID

```bash
curl -X GET http://localhost:3000/users/1
```

---

## ✅ Verification

### 1. Check replication status on **primary**

```bash
docker exec -it pg-primary psql -U postgres -c \
"SELECT pid, usename, application_name, client_addr, state, sync_state FROM pg_stat_replication;"
```

**Expected:**
* `state = streaming`
* `sync_state = async` (or `sync` if configured)

---

### 2. Check standby mode

```bash
docker exec -it pg-replica psql -U postgres -c "SELECT pg_is_in_recovery();"
```

**Expected:** `t` (true)

---

### 3. Check WAL receiver on replica

```bash
docker exec -it pg-replica psql -U postgres -c \
"SELECT status, conninfo, last_msg_send_time, last_msg_receipt_time FROM pg_stat_wal_receiver;"
```

**Expected:** `status = streaming` with recent timestamps.

---

### 4. Check replication lag (on primary)

```bash
docker exec -it pg-primary psql -U postgres -c \
"SELECT application_name, client_addr, write_lag, flush_lag, replay_lag FROM pg_stat_replication;"
```

---

### 5. Check replay delay (on replica)

```bash
docker exec -it pg-replica psql -U postgres -c \
"SELECT now() - pg_last_xact_replay_timestamp() AS replication_delay;"
```

---

### 6. Functional test via API

Test replication by creating a user via the API (writes to primary) and then checking if it appears on the replica:

**Create user via API:**
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "email": "test@example.com"}'
```

**Check on replica directly:**
```bash
docker exec -it pg-replica psql -U postgres -c \
"SELECT * FROM users ORDER BY id DESC LIMIT 1;"
```

**Expected:** The newly created user should appear on the replica.

---

### 7. Database-level functional test

On **primary**:

```bash
docker exec -it pg-primary psql -U postgres -c \
"CREATE TABLE IF NOT EXISTS repl_test(id serial PRIMARY KEY, t text); \
 INSERT INTO repl_test(t) VALUES ('hello from primary');"
```

On **replica**:

```bash
docker exec -it pg-replica psql -U postgres -c "SELECT * FROM repl_test;"
```

**Expected:** the inserted row should appear on the replica.

---

## 🔄 Database Management Scripts

### Generate new migration

```bash
npm run migration:generate -- src/migrations/NewMigrationName
```

### Run migrations

```bash
npm run migration:run
```

### Revert last migration

```bash
npm run migration:revert
```

---

## 🚀 Promote Replica (Failover)

Promote the standby to a new primary:

```bash
docker exec -it pg-replica psql -U postgres -c "SELECT pg_promote();"
```

After promotion, you'll need to update your application's database connection to point to the new primary.

---

## 🧹 Cleanup

### Remove containers only (keep data):

```bash
docker compose down
```

### Remove containers and data volumes:

```bash
npm run clean
```

This will stop containers and remove all database data from both primary and replica.

---

## ⚠️ Notes

* This setup is for **local development/demo** only.
* The API connects to the **primary** database for both reads and writes.
* For production:
  * Use **strong passwords** and restrict replication connections in `pg_hba.conf`.
  * Consider **replication slots** to prevent WAL loss.
  * Enable **TLS** for secure connections.
  * Use HA tools like **Patroni**, **repmgr**, or **pgpool** for automated failover and management.
  * Implement read/write splitting to direct reads to replica and writes to primary.
  * Add proper error handling and connection pooling in the API.
