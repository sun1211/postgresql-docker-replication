#!/bin/bash
set -e

# This script runs at first init (docker-entrypoint-initdb.d)
# It sets minimal replication settings and creates a replication role.

PGDATA=/var/lib/postgresql/data

# Append recommended replication settings (persist via ALTER SYSTEM)
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-SQL
  ALTER SYSTEM SET wal_level = 'replica';
  ALTER SYSTEM SET max_wal_senders = 10;
  ALTER SYSTEM SET max_replication_slots = 5;
  ALTER SYSTEM SET wal_keep_size = '128MB';
  ALTER SYSTEM SET hot_standby = 'on';
  SELECT pg_reload_conf();
SQL

# Allow local connections + simple replication rule (for demo only)
cat >> ${PGDATA}/pg_hba.conf <<'CONF'
# allow replication connections from any container (dev demo only)
host replication replicator 0.0.0.0/0 md5
# (optional) allow app connections from anywhere (dev only)
host all all 0.0.0.0/0 md5
CONF

# Create replication role
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-SQL
  CREATE ROLE replicator WITH REPLICATION LOGIN ENCRYPTED PASSWORD 'replicator_password';
SQL

echo "Primary init script finished."
