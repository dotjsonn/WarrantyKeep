-- Up Migration
CREATE TABLE warranties (
  warranty_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

  user_id BIGINT NOT NULL
    REFERENCES users(user_id),

  name VARCHAR(255) NOT NULL
    CHECK (name = btrim(name) AND char_length(name) >= 1),

  purchase_date DATE NOT NULL
    CHECK (isfinite(purchase_date)),

  warranty_months INTEGER NOT NULL
    CHECK (warranty_months BETWEEN 1 AND 120),

  receipt_url TEXT NULL
    CHECK (receipt_url = btrim(receipt_url) AND char_length(receipt_url) >= 1),

  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_warranties_user_id
ON warranties(user_id);

-- Down Migration
DROP TABLE warranties;