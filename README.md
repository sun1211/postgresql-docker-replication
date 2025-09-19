# PostgreSQL Master–Replica Example

This project demonstrates a **PostgreSQL 16 primary–standby (master–replica)** setup using Docker Compose and streaming replication.

---

## 📂 Project Structure

```

.
├── docker-compose.yml
├── primary/
│   ├── data/                   # Primary database volume (ignored in git)
│   └── init-replication.sh     # Script to configure primary for replication
└── replica/
├── data/                   # Replica database volume (ignored in git)
└── replica-entrypoint.sh   # Script to bootstrap replica via pg\_basebackup

````

---

## ⚙️ Setup

1. **Clone the repo and prepare folders**
   ```bash
   git clone <your-repo-url>
   cd <your-repo>
   mkdir -p primary/data replica/data
   chmod +x primary/init-replication.sh replica/replica-entrypoint.sh
   ```

2. **Start the primary container**

   ```bash
   docker compose up -d primary
   docker logs -f pg-primary
   ```

   Wait until the primary finishes initialization and is ready to accept connections.

3. **Start the replica**

   ```bash
   docker compose up -d replica
   docker logs -f pg-replica
   ```

   The replica will run `pg_basebackup`, configure standby mode, and begin streaming.

---

## ▶️ Running

Start both containers:

```bash
docker compose up -d
```

Stop everything:

```bash
docker compose down
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

### 6. Functional test

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

## 🚀 Promote Replica (Failover)

Promote the standby to a new primary:

```bash
docker exec -it pg-replica psql -U postgres -c "SELECT pg_promote();"
```

---

## 🧹 Cleanup

Remove containers and data volumes:

```bash
docker compose down -v
```

## ⚠️ Notes

* This setup is for **local development/demo** only.
* For production:

  * Use **strong passwords** and restrict replication connections in `pg_hba.conf`.
  * Consider **replication slots** to prevent WAL loss.
  * Enable **TLS** for secure connections.
  * Use HA tools like **Patroni**, **repmgr**, or **pgpool** for automated failover and management.

