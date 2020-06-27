-- https://www.postgresql.org/docs/current/datatype-uuid.html
-- https://www.postgresql.org/docs/current/uuid-ossp.html
-- https://www.postgresqltutorial.com/postgresql-uuid/
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users
(
  id uuid DEFAULT uuid_generate_v4(),
  username VARCHAR(20),
  password VARCHAR(255),
  created_by uuid,
  updated_by uuid,
  deleted_by uuid,
  created_at TIMESTAMP WITHOUT TIME ZONE,
  updated_at TIMESTAMP WITHOUT TIME ZONE,
  deleted_at TIMESTAMP WITHOUT TIME ZONE
);
