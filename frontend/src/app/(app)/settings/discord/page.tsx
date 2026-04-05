"use client"

import { useSession } from "next-auth/react"

export default function DiscordSettingsPage() {
  const { data: session } = useSession()
  const connected = !!session?.user?.discordId

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 80px" }}>
      <div style={{ fontSize: 13, color: "#bbb", marginBottom: 24 }}>
        DiscordアカウントとリンクするとDMで通知を受け取れます
      </div>

      {connected ? (
        <div
          style={{
            background: "linear-gradient(135deg,#5865f220,#7289da15)",
            border: "1.5px solid #5865f240",
            borderRadius: 16,
            padding: "18px",
            marginBottom: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "#5865f2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
              }}
            >
              🎮
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 900, color: "#5865f2" }}>連携済み</div>
              <div style={{ fontSize: 12, color: "#888" }}>
                Discord ID: {session?.user?.discordId}
              </div>
            </div>
          </div>
          <p style={{ fontSize: 11, color: "#bbb", margin: "0 0 12px" }}>
            連携を解除するには、Discordアカウントの設定から認証を取り消してください。
          </p>
        </div>
      ) : (
        <div
          style={{
            background: "white",
            borderRadius: 16,
            padding: "24px",
            boxShadow: "0 2px 12px rgba(180,150,220,0.1)",
            textAlign: "center",
            marginBottom: 16,
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎮</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#555", marginBottom: 6 }}>
            Discordと連携しよう
          </div>
          <div
            style={{
              fontSize: 12,
              color: "#aaa",
              marginBottom: 20,
              lineHeight: 1.6,
            }}
          >
            OAuthで認証するだけ。
            <br />
            サーバーへの参加は不要です。
          </div>
          {/* TODO: Discord再連携フローはAuth.js のlink account実装後に対応 */}
          <div
            style={{
              background: "#5865f2",
              color: "white",
              borderRadius: 12,
              padding: "12px 24px",
              fontSize: 14,
              fontWeight: 900,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              boxShadow: "0 4px 14px rgba(88,101,242,0.4)",
              opacity: 0.5,
              cursor: "not-allowed",
            }}
          >
            <span>🎮</span> Discordで連携する（準備中）
          </div>
        </div>
      )}

      <div style={{ fontSize: 11, color: "#ccc", textAlign: "center", lineHeight: 1.8 }}>
        連携情報はDiscord IDのみ保存されます
        <br />
        いつでも解除できます
      </div>
    </div>
  )
}
