### Postgress example
0. Require
 - Install docker (https://docs.docker.com/compose/install/)
 - yarn version v1.22.17 or higher
 - node v14.17.0 or higher

 - Install PostgreSQL:
    - Windows:  https://www.postgresqltutorial.com/postgresql-getting-started/install-postgresql/
    - Linux: https://www.postgresqltutorial.com/postgresql-getting-started/install-postgresql-linux/
    - mac os: https://www.postgresqltutorial.com/postgresql-getting-started/install-postgresql-macos/
1. Start posgress using docker
```
yarn run start-postgress
```

2. Start example
```
yarn run start
```
3. Connect psql docker
```
docker exec -it <ID> bash
psql -U postgres
```

