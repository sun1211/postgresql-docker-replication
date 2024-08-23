# PostgreSQL Example

## Single PostgreSQL Instance

### Requirements

- **Docker**: [Install Docker](https://docs.docker.com/compose/install/)
- **Yarn**: Version `v1.22.17` or higher
- **Node.js**: Version `v14.17.0` or higher
- **PostgreSQL**:
  - **Windows**: [Install PostgreSQL](https://www.postgresqltutorial.com/postgresql-getting-started/install-postgresql/)
  - **Linux**: [Install PostgreSQL](https://www.postgresqltutorial.com/postgresql-getting-started/install-postgresql-linux/)
  - **macOS**: [Install PostgreSQL](https://www.postgresqltutorial.com/postgresql-getting-started/install-postgresql-macos/)

### Steps to Start PostgreSQL

1. **Start PostgreSQL using Docker**:
   ```bash
   yarn run start-postgress
   ```

2. **Run the Example**:
   ```bash
   yarn run start
   ```

3. **Connect to the PostgreSQL Docker Container**:
   ```bash
   docker exec -it <container_id> bash
   psql -U postgres
   ```

### Basic PostgreSQL Queries

- **SELECT Statement**:
  ```sql
  SELECT
     select_list
  FROM
     table_name;
  ```
  - **Explanation**:
    - **select_list**: A column or list of columns from which to retrieve data. Use `*` to select all columns.
    - **table_name**: The table from which to query data.

- **Column Alias**:
  ```sql
  SELECT column_name AS alias_name
  FROM table_name;
  ```

  Or:

  ```sql
  SELECT column_name alias_name
  FROM table_name;
  ```

  Or:

  ```sql
  SELECT expression AS alias_name
  FROM table_name;
  ```

- **ORDER BY Clause**:
  ```sql
  SELECT
     select_list
  FROM
     table_name
  ORDER BY
     sort_expression1 [ASC | DESC],
     sort_expressionN [ASC | DESC];
  ```

- **DISTINCT Clause**:
  ```sql
  SELECT
     DISTINCT column1, column2
  FROM
     table_name;
  ```
  - The `DISTINCT` clause is used to remove duplicate rows from the result set.

## PostgreSQL Replication

### Steps to Set Up Replication

1. **Create and Grant Access to Slave User on Master**:
   After starting the Docker container, access the master PostgreSQL instance:

   ```bash
   docker exec -it <master_id> bash
   psql -U postgres -d development_database
   CREATE TABLE test (id SERIAL PRIMARY KEY, data VARCHAR(50));
   INSERT INTO test (data) VALUES ('replication test');
   GRANT SELECT ON TABLE test TO repl_user;
   ```

2. **Read Data from Slave User**:
   Access the slave PostgreSQL instance:

   ```bash
   docker exec -it <slave_id> bash
   psql -U repl_user -d development_database
   SELECT * FROM test;
   ```