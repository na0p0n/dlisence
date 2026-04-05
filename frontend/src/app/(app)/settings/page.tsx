"use client"

import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"

// TODO: ユーザープロフィールはDBのテーブル設計完了後に実データに差し替える
const MOCK_USER = {
  nickname: "もちこ",
  icon: "🍡",
  role: "little",
  licenseNo: "JP-2026-0042",
  friendAddMode: "oneclick",
}

export default function SettingsPage() {
  const router = useRouter()
  const { data: session } = useSession()

  const discordConnected = !!session?.user?.discordId

  const menuItems = [
    {
      group: "プロフィール",
      items: [
        { icon: "🪪", label: "免許証を編集する", desc: "基本情報・詳細・公開設定", action: () => {} },
        { icon: "🔒", label: "公開設定",          desc: "項目ごとの公開範囲を変更",       action: () => {} },
      ],
    },
    {
      group: "通知・連携",
      items: [
        {
          icon: "🔔",
          label: "通知設定",
          desc: "受け取る通知の種類を設定",
          action: () => router.push("/settings/notifications"),
        },
        {
          icon: "🎮",
          label: "Discord連携",
          desc: discordConnected ? "連携済み" : "未連携",
          badge: discordConnected ? null : "未連携",
          action: () => router.push("/settings/discord"),
        },
      ],
    },
    {
      group: "その他",
      items: [
        {
          icon: "👫",
          label: "友達追加の設定",
          desc: MOCK_USER.friendAddMode === "oneclick" ? "ワンクリック追加" : "申請制",
          action: () => {},
        },
        { icon: "❓", label: "ヘルプ・お問い合わせ", desc: "", action: () => {} },
        { icon: "🚪", label: "ログアウト", desc: "", action: () => signOut({ callbackUrl: "/login" }), danger: true },
      ],
    },
  ] as const

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 80px" }}>
      {/* プロフィールカード */}
      <div
        style={{
          background: "linear-gradient(135deg,#f48fb1,#ce93d8,#9fa8da)",
          borderRadius: 20,
          padding: "20px",
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          gap: 14,
          boxShadow: "0 4px 20px rgba(206,147,216,0.3)",
          marginTop: 16,
        }}
      >
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: 16,
            background: "rgba(255,255,255,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 34,
          }}
        >
          {MOCK_USER.icon}
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 900, color: "white" }}>
            {session?.user?.name ?? MOCK_USER.nickname}
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)" }}>
            👶 リトル　{MOCK_USER.licenseNo}
          </div>
        </div>
      </div>

      {/* メニューグループ */}
      {menuItems.map((group) => (
        <div key={group.group} style={{ marginBottom: 16 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 900,
              color: "#b8a0cc",
              letterSpacing: "0.12em",
              marginBottom: 6,
              paddingLeft: 4,
            }}
          >
            {group.group}
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.85)",
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "0 2px 12px rgba(180,150,220,0.1)",
            }}
          >
            {group.items.map((item, i) => (
              <button
                key={item.label}
                onClick={item.action}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "13px 16px",
                  border: "none",
                  borderBottom:
                    i < group.items.length - 1 ? "1px solid #f9f0fd" : "none",
                  background: "none",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <span style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</span>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "danger" in item && item.danger ? "#e57373" : "#555",
                    }}
                  >
                    {item.label}
                  </div>
                  {item.desc && (
                    <div style={{ fontSize: 11, color: "#bbb" }}>{item.desc}</div>
                  )}
                </div>
                {"badge" in item && item.badge && (
                  <span
                    style={{
                      fontSize: 10,
                      background: "#fce4ec",
                      color: "#e57373",
                      border: "1px solid #f48fb1",
                      borderRadius: 99,
                      padding: "2px 8px",
                      fontWeight: 700,
                    }}
                  >
                    {item.badge}
                  </span>
                )}
                {"danger" in item && !item.danger && (
                  <span style={{ color: "#ddd", fontSize: 16 }}>›</span>
                )}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
