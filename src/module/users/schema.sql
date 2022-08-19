-- https://www.postgresql.org/docs/current/datatype-uuid.html
-- https://www.postgresql.org/docs/current/uuid-ossp.html
-- https://www.postgresqltutorial.com/postgresql-uuid/
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users
(
  id uuid DEFAULT uuid_generate_v4(),
  username VARCHAR(20),
  password VARCHAR(255),
  role  VARCHAR(255),
  created_at TIMESTAMP WITHOUT TIME ZONE,
  updated_at TIMESTAMP WITHOUT TIME ZONE,
  deleted_at TIMESTAMP WITHOUT TIME ZONE
);

INSERT INTO users (username, password, role)
VALUES
    ('root', 'password-hash', 'owner'),
    ('user-a', 'password-hash', 'user'),
    ('user-b', 'password-hash', 'guest');

INSERT INTO users (id, username, password, role)
VALUES
    ('2c36e3f9-55cb-4aae-a642-5409c3a7dc17', 'well-known-user', '$2a$12$YZsJbasFj9b5NC5gHX/MVe94wruM6UVCJi40FNgvMhhGEXZlaTYCu', 'ADMIN');
