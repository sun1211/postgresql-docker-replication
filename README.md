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
   yarn run start-postgres
   ```

2. **Run the Example Application**:
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
    - **select_list**: The columns to retrieve data from; use `*` to select all columns.
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
  - Removes duplicate rows from the result set.

## PostgreSQL Replication

### Steps to Set Up Replication

1. **Create and Grant Access to Slave User on Master**:

   After starting the Docker container, connect to the master PostgreSQL instance:

   ```bash
   docker exec -it <master_id> bash
   psql -U postgres -d development_database
   ```

   Then, create the table and grant access:

   ```sql
   CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     first_name VARCHAR(255) NOT NULL,
     last_name VARCHAR(255) NOT NULL,
     email VARCHAR(255) NOT NULL
   );

   INSERT INTO users (first_name, last_name, email)
   VALUES ('John', 'Doe', 'john.doe@example.com');

   GRANT SELECT ON users TO repl_user;
   ```

2. **Read Data from Slave User**:

   Access the slave PostgreSQL instance:

   ```bash
   docker exec -it <slave_id> bash
   psql -U repl_user -d development_database
   ```

   Execute the following query:

   ```sql
   SELECT * FROM users;
   ```

### Notes

- **Delete Table if it Exists**:
  ```sql
  DROP TABLE IF EXISTS users;
  ```

### Example API Endpoints

#### Create a User (Write to Database)

```javascript
// Create user endpoint
app.post('/users', async (req, res) => {
    console.log(req.body);
    try {
        const { firstName, lastName, email } = req.body;
        const user = await createUser(firstName, lastName, email);
        res.status(201).json(user);
    } catch (error) {
        console.error('Failed to create user:', error);
        res.status(500).json({ message: 'Failed to create user' });
    }
});
```

Test the endpoint using `curl`:

```bash
curl -X POST \
  'http://localhost:4000/users' \
  --header 'Accept: */*' \
  --header 'User-Agent: Thunder Client (https://www.thunderclient.com)' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "firstName": "test",
    "lastName" : "demo",
    "email": "demo@gmail.com"
}'
```

#### Get All Users (Read from Database)

```javascript
// Get users endpoint
app.get('/users', async (req, res) => {
    try {
        const users = await getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        console.error('Failed to retrieve users:', error);
        res.status(500).json({ message: 'Failed to retrieve users' });
    }
});
```

Test the endpoint using `curl`:

```bash
curl -X GET \
  'http://localhost:4000/users' \
  --header 'Accept: */*' \
  --header 'User-Agent: Thunder Client (https://www.thunderclient.com)'
```

### Summary

- Use Docker to start and manage your PostgreSQL instances.
- Set up master-slave replication for PostgreSQL.
- Perform basic read and write operations using Node.js with TypeORM.
- Test the API endpoints using `curl` commands.