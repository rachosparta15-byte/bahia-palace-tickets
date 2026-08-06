-- One access code per paid seat, bound to the first device that opens it.
--
-- Replaces the signed-token-plus-device-cap arrangement in GuideActivation.
-- That table is intentionally NOT dropped: it holds the activation history of
-- every customer who bought under the old system, which is the record you need
-- if one of them writes in months later.
--
-- Mirrored in src/lib/db/ensure-columns.ts, because this project deploys by
-- pushing the schema rather than running migrations and a missing table here
-- would 500 both payment confirmation and every redemption.

CREATE TABLE IF NOT EXISTS "GuideCode" (
    "id"          TEXT     NOT NULL PRIMARY KEY,
    "code"        TEXT     NOT NULL,
    "bookingId"   TEXT     NOT NULL,
    "reference"   TEXT     NOT NULL,
    "seat"        INTEGER  NOT NULL,
    -- NULL until first use. Once set, the only device this code will admit.
    "deviceId"    TEXT,
    "claimedAt"   DATETIME,
    "lastSeenAt"  DATETIME,
    -- Set when support releases a binding; the count is how a stale phone is
    -- told apart from a link doing the rounds.
    "unlockedAt"  DATETIME,
    "unlockCount" INTEGER  NOT NULL DEFAULT 0,
    "createdAt"   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- A collision would hand one customer another booking's guide. The issuer
-- retries against this constraint rather than trusting eighty bits blindly.
CREATE UNIQUE INDEX IF NOT EXISTS "GuideCode_code_key"       ON "GuideCode"("code");
CREATE INDEX        IF NOT EXISTS "GuideCode_bookingId_idx"  ON "GuideCode"("bookingId");
CREATE INDEX        IF NOT EXISTS "GuideCode_reference_idx"  ON "GuideCode"("reference");
CREATE INDEX        IF NOT EXISTS "GuideCode_deviceId_idx"   ON "GuideCode"("deviceId");
