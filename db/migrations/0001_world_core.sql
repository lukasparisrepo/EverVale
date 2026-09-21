BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE worlds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seed bigint NOT NULL,
  revision bigint NOT NULL DEFAULT 0,
  state text NOT NULL DEFAULT 'COLD' CHECK (state IN ('ACTIVE','WARM','COLD')),
  speed smallint NOT NULL DEFAULT 1 CHECK (speed IN (0,1,2,4)),
  simulation_version text NOT NULL,
  balance_version text NOT NULL,
  schema_version integer NOT NULL DEFAULT 1,
  last_simulated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE world_memberships (
  world_id uuid NOT NULL REFERENCES worlds(id) ON DELETE CASCADE,
  user_id text NOT NULL,
  role text NOT NULL CHECK (role IN ('OWNER','CO_BUILDER','VISITOR')),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (world_id, user_id)
);

CREATE UNIQUE INDEX world_single_owner_idx ON world_memberships(world_id) WHERE role = 'OWNER';

CREATE TABLE world_snapshots (
  id bigserial PRIMARY KEY,
  world_id uuid NOT NULL REFERENCES worlds(id) ON DELETE CASCADE,
  revision bigint NOT NULL,
  snapshot jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(world_id, revision)
);

CREATE INDEX world_snapshots_latest_idx ON world_snapshots(world_id, revision DESC);

CREATE TABLE world_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id uuid NOT NULL REFERENCES worlds(id) ON DELETE CASCADE,
  revision bigint NOT NULL,
  event_type text NOT NULL,
  happened_at timestamptz NOT NULL,
  severity smallint NOT NULL DEFAULT 0,
  entity_ids jsonb NOT NULL DEFAULT '[]'::jsonb,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  player_summary text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX world_events_timeline_idx ON world_events(world_id, happened_at DESC);

CREATE TABLE world_commands (
  command_id uuid PRIMARY KEY,
  world_id uuid NOT NULL REFERENCES worlds(id) ON DELETE CASCADE,
  user_id text NOT NULL,
  expected_revision bigint,
  command_type text NOT NULL,
  status text NOT NULL CHECK (status IN ('ACCEPTED','REJECTED','FAILED')),
  result jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX world_commands_world_idx ON world_commands(world_id, created_at DESC);

CREATE TABLE world_leases (
  world_id uuid PRIMARY KEY REFERENCES worlds(id) ON DELETE CASCADE,
  lease_owner text NOT NULL,
  lease_token uuid NOT NULL,
  expires_at timestamptz NOT NULL,
  heartbeat_at timestamptz NOT NULL DEFAULT now()
);

COMMIT;