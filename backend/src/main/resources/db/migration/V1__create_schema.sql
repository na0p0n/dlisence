-- =============================================================
-- V1: 初期スキーマ
-- おむつ免許JP — 全テーブルを一括作成
-- =============================================================

-- ─────────────────────────────────────────────────────────────
-- 共通: updated_at 自動更新トリガー関数
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ─────────────────────────────────────────────────────────────
-- 免許番号自動採番: JP-YYYY-NNNN
-- ─────────────────────────────────────────────────────────────
CREATE SEQUENCE license_seq START 1;

CREATE OR REPLACE FUNCTION generate_license_no()
RETURNS TRIGGER AS $$
BEGIN
  NEW.license_no = 'JP-' || to_char(now(), 'YYYY') || '-'
                   || lpad(nextval('license_seq')::text, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================================
-- 1. users（ユーザー）
-- =============================================================
CREATE TABLE users (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Auth.js JWT の token.sub と紐づける識別子
  -- (Discord: "discord_<id>", Google: "google_<sub>", Guest: "guest_<uuid>")
  oauth_sub         text        NOT NULL UNIQUE,

  nickname          text        NOT NULL,

  -- アイコン種別: 絵文字 or 画像URL
  icon_type         text        NOT NULL DEFAULT 'emoji'
                                CHECK (icon_type IN ('emoji', 'image')),
  icon_emoji        text                 DEFAULT '🍡',
  icon_url          text,

  -- icon_type と実フィールドの整合性
  CONSTRAINT icon_consistency CHECK (
    (icon_type = 'emoji' AND icon_emoji IS NOT NULL AND icon_url IS NULL) OR
    (icon_type = 'image' AND icon_url IS NOT NULL)
  ),

  role              text        NOT NULL
                                CHECK (role IN ('little', 'caregiver', 'switch')),

  age               integer     CHECK (age > 0 AND age < 150),
  little_age        integer     CHECK (little_age >= 0),

  -- リトル専用項目
  dependency_class  text        CHECK (dependency_class IN ('F', 'D', 'P')),
  age_class         text        CHECK (age_class IN ('B', 'T', 'K')),

  -- ケアギバー専用項目
  cg_role           text        CHECK (cg_role IN ('Da', 'Mo', 'Br', 'Si')),
  cg_style          text        CHECK (cg_style IN ('1', '2', '3')),

  memo              text        CHECK (char_length(memo) <= 40),
  bio               text        CHECK (char_length(bio) <= 200),
  diaper_brand      text,

  -- SNS
  sns_x             text,
  -- sns_discord は discord_user_id / discord_username で代替するため省略

  habitual_status   text                 DEFAULT 'pee'
                                CHECK (habitual_status IN ('pee', 'both', 'night', 'always')),

  friend_add_mode   text        NOT NULL DEFAULT 'oneclick'
                                CHECK (friend_add_mode IN ('oneclick', 'request')),

  -- Discord OAuth 連携 (DM通知用)
  discord_user_id   text        UNIQUE,
  discord_username  text,

  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_users_oauth_sub       ON users (oauth_sub);
CREATE INDEX idx_users_discord_user_id ON users (discord_user_id);

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- =============================================================
-- 2. licenses（免許証）
-- =============================================================
CREATE TABLE licenses (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,

  -- INSERT トリガーで JP-YYYY-NNNN 形式に自動採番
  license_no  text        NOT NULL UNIQUE,

  issued_at   date        NOT NULL DEFAULT current_date,
  -- 演出用有効期限: 発行日から3年
  expires_at  date        NOT NULL GENERATED ALWAYS AS (issued_at + INTERVAL '3 years') STORED,

  theme       text        NOT NULL DEFAULT 'default'
                          CHECK (theme IN ('default')),   -- テーマ追加時はここを拡張

  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_licenses_no
  BEFORE INSERT ON licenses
  FOR EACH ROW EXECUTE FUNCTION generate_license_no();

CREATE TRIGGER trg_licenses_updated_at
  BEFORE UPDATE ON licenses
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- =============================================================
-- 3. privacy_settings（公開設定）
-- =============================================================
-- 公開範囲の値は 'public' / 'friends' / 'family' の3種類
CREATE DOMAIN visibility AS text
  CHECK (VALUE IN ('public', 'friends', 'family'));

CREATE TABLE privacy_settings (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid        NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,

  class_rank       visibility  NOT NULL DEFAULT 'friends',
  age              visibility  NOT NULL DEFAULT 'friends',
  little_age       visibility  NOT NULL DEFAULT 'friends',
  memo             visibility  NOT NULL DEFAULT 'public',
  bio              visibility  NOT NULL DEFAULT 'friends',
  habitual_status  visibility  NOT NULL DEFAULT 'friends',
  diaper_brand     visibility  NOT NULL DEFAULT 'friends',
  sns              visibility  NOT NULL DEFAULT 'friends',
  current_status   visibility  NOT NULL DEFAULT 'family',
  diaper_logs      visibility  NOT NULL DEFAULT 'family',

  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_privacy_settings_updated_at
  BEFORE UPDATE ON privacy_settings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- =============================================================
-- 4. relationships（友達関係）
-- =============================================================
CREATE TABLE relationships (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id  uuid        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id   uuid        NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  status        text        NOT NULL DEFAULT 'pending'
                            CHECK (status IN ('pending', 'accepted', 'rejected', 'blocked')),

  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),

  -- 同一ペアの重複申請不可
  CONSTRAINT uq_relationships UNIQUE (requester_id, receiver_id),
  -- 自分自身との友達不可
  CONSTRAINT no_self_relationship CHECK (requester_id <> receiver_id)
);

CREATE INDEX idx_relationships_receiver ON relationships (receiver_id);

CREATE TRIGGER trg_relationships_updated_at
  BEFORE UPDATE ON relationships
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- =============================================================
-- 5. family_links（親子リンク）
-- =============================================================
CREATE TABLE family_links (
  id                 uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  caregiver_id       uuid        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  little_id          uuid        NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  status             text        NOT NULL DEFAULT 'pending'
                                 CHECK (status IN ('pending', 'accepted', 'rejected', 'dissolved')),

  -- リトル側が設定: ケアギバーボタンを誰に見せるか
  button_visibility  text        NOT NULL DEFAULT 'linked_only'
                                 CHECK (button_visibility IN ('linked_only', 'public')),

  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT uq_family_links UNIQUE (caregiver_id, little_id),
  CONSTRAINT no_self_link     CHECK (caregiver_id <> little_id)
);

CREATE INDEX idx_family_links_little ON family_links (little_id);

CREATE TRIGGER trg_family_links_updated_at
  BEFORE UPDATE ON family_links
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- =============================================================
-- 6. diaper_status（おむつステータス L2）
-- =============================================================
CREATE TABLE diaper_status (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid        NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,

  current_status  text        NOT NULL DEFAULT 'wearing'
                              CHECK (current_status IN ('clean_dry', 'wet', 'dirty', 'wearing')),

  -- 本人 or リンク済みケアギバーのどちらが更新したか
  updated_by      uuid        REFERENCES users(id) ON DELETE SET NULL,

  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_diaper_status_updated_at
  BEFORE UPDATE ON diaper_status
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- =============================================================
-- 7. diaper_logs（おむつログ L3）
-- =============================================================
CREATE TABLE diaper_logs (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  little_id    uuid        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  actor_id     uuid        NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  action_type  text        NOT NULL
               CHECK (action_type IN ('check', 'change_request', 'changed', 'early_bed')),

  note         text        CHECK (char_length(note) <= 200),

  created_at   timestamptz NOT NULL DEFAULT now()
);

-- タイムライン表示の高速化
CREATE INDEX idx_diaper_logs_timeline ON diaper_logs (little_id, created_at DESC);


-- =============================================================
-- 8. notifications（通知）
-- =============================================================
CREATE TABLE notifications (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  actor_id        uuid        REFERENCES users(id) ON DELETE SET NULL,

  event_type      text        NOT NULL
                  CHECK (event_type IN (
                    'diaper_check', 'diaper_change', 'early_bed',
                    'family_request', 'family_approved',
                    'friend_request', 'friend_approved'
                  )),

  -- 関連リソースの種別と ID をセットで持つ
  reference_type  text        CHECK (reference_type IN ('family_link', 'diaper_log', 'relationship')),
  reference_id    uuid,

  -- reference_type と reference_id は必ず両方 NULL か両方 NOT NULL
  CONSTRAINT reference_consistency CHECK (
    (reference_type IS NULL) = (reference_id IS NULL)
  ),

  is_read         boolean     NOT NULL DEFAULT false,
  discord_sent    boolean     NOT NULL DEFAULT false,

  created_at      timestamptz NOT NULL DEFAULT now()
);

-- 未読通知の高速取得
CREATE INDEX idx_notifications_unread ON notifications (user_id, is_read, created_at DESC);
