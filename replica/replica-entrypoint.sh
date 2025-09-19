#!/bin/bash
set -e
PGDATA=/var/lib/postgresql/data

# Helper: wait for primary to be ready
wait_for_primary() {
  echo "Waiting for primary to be ready..."
  until pg_isready -h primary -p 5432 -U postgres >/dev/null 2>&1; do
    sleep 1
  done
  echo "Primary is ready."
}

# If PGDATA is empty, initialize by taking base backup from primary
if [ ! -s "${PGDATA}/PG_VERSION" ]; then
  wait_for_primary

  echo "Running pg_basebackup to pull base backup from primary..."
  export PGPASSWORD="${REPLICATOR_PASSWORD}"
  pg_basebackup -h primary -D "${PGDATA}" -U replicator -v -P --wal-method=stream

  # Configure the standby to connect to primary
  echo "primary_conninfo = 'host=primary port=5432 user=replicator password=${REPLICATOR_PASSWORD} application_name=pg-replica'" >> "${PGDATA}/postgresql.conf"
  # create standby.signal to tell Postgres to start in standby mode (PG12+)
  touch "${PGDATA}/standby.signal"

  # (Optional) set hot_standby on standby (already default in many images)
  echo "hot_standby = on" >> "${PGDATA}/postgresql.conf"

  echo "Replica base backup and standby config completed."
fi

# Finally exec the original entrypoint to start postgres normally
exec docker-entrypoint.sh postgres
