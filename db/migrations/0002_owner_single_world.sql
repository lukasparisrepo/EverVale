BEGIN;

-- M1 API exposes one implicit world per owner (findByOwner / no world picker).
-- Prevent two server instances racing first-load from creating two owned worlds
-- for the same user. Remove/replace this invariant only when multi-world UX/API
-- is introduced explicitly.
CREATE UNIQUE INDEX IF NOT EXISTS world_owner_user_unique_idx
  ON world_memberships(user_id)
  WHERE role = 'OWNER';

COMMIT;
