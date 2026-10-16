-- Up Migration
CREATE TABLE users (
  user_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

  name VARCHAR(255) NOT NULL
    CHECK (char_length(btrim(name)) > 0),

  email VARCHAR(254) NOT NULL UNIQUE
    CHECK (
      email = lower(btrim(email))
      AND char_length(email) >= 3
    ),

  password_hash TEXT NOT NULL,

  role VARCHAR(20) NOT NULL DEFAULT 'user'
    CHECK (role IN ('admin', 'user')),

  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Down Migration
DROP TABLE users;