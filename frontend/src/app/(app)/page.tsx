// TODO: ユーザープロフィールはDBのテーブル設計完了後に実データに差し替える
const MOCK_USER = {
  nickname: "もちこ",
  icon: "🍡",
  role: "little",
  licenseNo: "JP-2026-0042",
}

export default function HomePage() {
  return (
    <div style={{ padding: "24px 16px 80px" }}>
      <div
        style={{
          background: "rgba(255,255,255,0.85)",
          borderRadius: 20,
          padding: "24px",
          textAlign: "center",
          boxShadow: "0 4px 24px rgba(180,150,220,0.12)",
        }}
      >
        <div style={{ fontSize: 52, marginBottom: 12 }}>{MOCK_USER.icon}</div>
        <div style={{ fontSize: 18, fontWeight: 900, color: "#b06abf", marginBottom: 4 }}>
          {MOCK_USER.nickname}
        </div>
        <div style={{ fontSize: 12, color: "#bbb", marginBottom: 20 }}>
          👶 リトル　{MOCK_USER.licenseNo}
        </div>
        <div
          style={{
            background: "#faf0ff",
            borderRadius: 14,
            padding: "14px",
            fontSize: 13,
            color: "#b06abf",
            fontWeight: 600,
          }}
        >
          カードをタップしてプロフィールを見る ›
        </div>
      </div>

      <div
        style={{
          marginTop: 16,
          background: "rgba(255,255,255,0.7)",
          borderRadius: 16,
          padding: "14px 16px",
          fontSize: 12,
          color: "#bbb",
          textAlign: "center",
        }}
      >
        右上の 👤 からアカウント設定へ
        <br />
        🔔 から通知モーダルが開きます
      </div>
    </div>
  )
}
