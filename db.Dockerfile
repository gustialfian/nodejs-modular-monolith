FROM postgres:13-alpine
COPY src/module/syncing/schema.sql /docker-entrypoint-initdb.d/schema_1.sql
COPY src/module/users/schema.sql /docker-entrypoint-initdb.d/schema_2.sql
CMD ls -la docker-entrypoint-initdb.d

