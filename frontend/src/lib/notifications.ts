export type NotifKey =
  | "diaper_check"
  | "diaper_change"
  | "early_bed"
  | "family_request"
  | "family_approved"
  | "friend_request"
  | "friend_approved"

export interface NotifEvent {
  key: NotifKey
  label: string
  desc: string
  icon: string
}

export interface NotifGroup {
  group: string
  color: string
  items: NotifEvent[]
}

export const NOTIFICATION_EVENTS: NotifGroup[] = [
  {
    group: "🍼 おむつ関連",
    color: "#f48fb1",
    items: [
      { key: "diaper_check",  label: "おむつチェック", desc: "ケアギバーがチェックボタンを押したとき",   icon: "🔍" },
      { key: "diaper_change", label: "交換指示",       desc: "ケアギバーが交換してねボタンを押したとき", icon: "🍼" },
      { key: "early_bed",     label: "早寝催促",       desc: "ケアギバーが早寝ボタンを押したとき",       icon: "🌙" },
    ],
  },
  {
    group: "👶 親子リンク",
    color: "#ce93d8",
    items: [
      { key: "family_request",  label: "親子リンク申請", desc: "誰かから親子リンク申請が届いたとき", icon: "📩" },
      { key: "family_approved", label: "親子リンク承認", desc: "申請が承認されたとき",               icon: "✅" },
    ],
  },
  {
    group: "👫 友達",
    color: "#81d4fa",
    items: [
      { key: "friend_request",  label: "友達申請", desc: "友達追加申請が届いたとき",   icon: "📩" },
      { key: "friend_approved", label: "友達承認", desc: "友達申請が承認されたとき",   icon: "✅" },
    ],
  },
]

export type NotifSettings = Record<NotifKey, { inApp: boolean; discord: boolean }>

export const DEFAULT_NOTIF_SETTINGS: NotifSettings = Object.fromEntries(
  NOTIFICATION_EVENTS.flatMap((g) => g.items).map((i) => [
    i.key,
    { inApp: true, discord: true },
  ]),
) as NotifSettings

// ─── アプリ内通知 (モック) ─────────────────────────────────────
export interface AppNotif {
  id: number
  icon: string
  title: string
  body: string
  time: string
  read: boolean
}

export const MOCK_NOTIFS: AppNotif[] = [
  { id: 1, icon: "🔍", title: "おむつチェック",   body: "パパちゃんがチェックしたよ♡",          time: "3分前",   read: false },
  { id: 2, icon: "📩", title: "親子リンク申請",   body: "Mochi-DaddyさんからLinkリクエスト",     time: "1時間前", read: false },
  { id: 3, icon: "✅", title: "友達申請を承認",   body: "さくらちゃんと友達になったよ🌸",       time: "昨日",    read: true  },
  { id: 4, icon: "🍼", title: "おむつ交換してね", body: "パパちゃん：そろそろ交換の時間だよ〜", time: "昨日",    read: true  },
]
