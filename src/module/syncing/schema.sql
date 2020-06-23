CREATE TABLE IF NOT EXISTS item
(
  id serial,
  name VARCHAR(20),
  created_at TIMESTAMP WITHOUT TIME ZONE,
  updated_at TIMESTAMP WITHOUT TIME ZONE,
  deleted_at TIMESTAMP WITHOUT TIME ZONE
);

INSERT INTO item (name, created_at)
VALUES 
  ('A', now()),
  ('B', now()),
  ('C', now());

INSERT INTO item (name, created_at, updated_at)
VALUES 
  ('1', now(), now());

INSERT INTO item (name, created_at, updated_at, deleted_at)
VALUES 
  ('z', now(), now(), now());

CREATE TABLE IF NOT EXISTS client_sync
(
  id_client VARCHAR(20),
  updated_at TIMESTAMP WITHOUT TIME ZONE
);