"use client"

import type { AppNotif } from "@/lib/notifications"

interface NotifModalProps {
  notifs: AppNotif[]
  onRead: (id: number) => void
  onReadAll: () => void
  onClose: () => void
}

export function NotifModal({ notifs, onRead, onReadAll, onClose }: NotifModalProps) {
  const unread = notifs.filter((n) => !n.read).length

  return (
    <>
      {/* オーバーレイ */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.25)",
          zIndex: 40,
          backdropFilter: "blur(2px)",
        }}
      />

      {/* モーダル本体 */}
      <div
        style={{
          position: "fixed",
          top: 64,
          right: 12,
          left: 12,
          maxWidth: 400,
          margin: "0 auto",
          background: "white",
          borderRadius: 20,
          boxShadow: "0 8px 40px rgba(180,150,220,0.25)",
          zIndex: 50,
          overflow: "hidden",
          maxHeight: "70vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* モーダルヘッダー */}
        <div
          style={{
            padding: "14px 16px",
            borderBottom: "1px solid #f3e8f5",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "linear-gradient(135deg,#fce4ec,#f3e5f5)",
            flexShrink: 0,
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 900, color: "#b06abf" }}>
            🔔 通知
            {unread > 0 && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#f48fb1",
                  color: "white",
                  borderRadius: 99,
                  fontSize: 10,
                  fontWeight: 900,
                  minWidth: 18,
                  height: 18,
                  padding: "0 4px",
                  marginLeft: 6,
                  verticalAlign: "middle",
                }}
              >
                {unread}
              </span>
            )}
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {unread > 0 && (
              <button
                onClick={onReadAll}
                style={{
                  fontSize: 11,
                  color: "#b06abf",
                  background: "none",
                  border: "1px solid #e8d5f5",
                  borderRadius: 8,
                  padding: "3px 9px",
                  cursor: "pointer",
                }}
              >
                すべて既読
              </button>
            )}
            <button
              onClick={onClose}
              style={{
                fontSize: 18,
                color: "#bbb",
                background: "none",
                border: "none",
                cursor: "pointer",
                lineHeight: 1,
                padding: "0 4px",
              }}
            >
              ×
            </button>
          </div>
        </div>

        {/* 通知リスト */}
        <div style={{ overflowY: "auto", padding: "10px 12px", flex: 1 }}>
          {notifs.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "32px 0",
                color: "#ccc",
                fontSize: 13,
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>🔔</div>
              通知はまだありません
            </div>
          ) : (
            notifs.map((n) => (
              <div
                key={n.id}
                onClick={() => onRead(n.id)}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  padding: "10px 8px",
                  borderRadius: 12,
                  marginBottom: 4,
                  background: n.read ? "transparent" : "#faf0ff",
                  border: n.read ? "1px solid transparent" : "1px solid #e8d5f5",
                  cursor: "pointer",
                  transition: "background 0.15s",
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    flexShrink: 0,
                    background: n.read
                      ? "#f3e8f5"
                      : "linear-gradient(135deg,#f48fb1,#ce93d8)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                  }}
                >
                  {n.icon}
                </div>

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: n.read ? 500 : 800,
                      color: n.read ? "#999" : "#555",
                    }}
                  >
                    {n.title}
                    {!n.read && (
                      <span
                        style={{
                          display: "inline-block",
                          width: 5,
                          height: 5,
                          borderRadius: "50%",
                          background: "#f48fb1",
                          marginLeft: 5,
                          verticalAlign: "middle",
                        }}
                      />
                    )}
                  </div>
                  <div style={{ fontSize: 11, color: "#bbb" }}>{n.body}</div>
                </div>

                <div style={{ fontSize: 10, color: "#ccc", whiteSpace: "nowrap" }}>
                  {n.time}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}
