"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { NotifModal } from "./NotifModal"
import { type AppNotif, MOCK_NOTIFS } from "@/lib/notifications"

// ─── ページタイトル ──────────────────────────────────────────────
const PAGE_TITLES: Record<string, string> = {
  "/license":                  "免許証",
  "/friends":                  "友達",
  "/settings":                 "アカウント設定",
  "/settings/notifications":   "通知設定",
  "/settings/discord":         "Discord連携",
}

// ─── ボトムナビタブ ─────────────────────────────────────────────
const TABS = [
  { href: "/",         icon: "🏠", label: "ホーム"  },
  { href: "/license",  icon: "🪪", label: "免許証"  },
  { href: "/friends",  icon: "👫", label: "友達"    },
  { href: "/settings", icon: "👤", label: "設定"    },
] as const

// ─── バック先の決定 ─────────────────────────────────────────────
function getBackPath(pathname: string): string | null {
  if (pathname === "/") return null
  if (pathname.startsWith("/settings/")) return "/settings"
  return "/"
}

// ─── AppShell ───────────────────────────────────────────────────
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()

  const [notifOpen, setNotifOpen] = useState(false)
  const [notifs, setNotifs] = useState<AppNotif[]>(MOCK_NOTIFS)

  const unreadCount = notifs.filter((n) => !n.read).length
  const backPath = getBackPath(pathname)
  const pageTitle = PAGE_TITLES[pathname]

  const handleRead = (id: number) =>
    setNotifs((ns) => ns.map((n) => (n.id === id ? { ...n, read: true } : n)))
  const handleReadAll = () => setNotifs((ns) => ns.map((n) => ({ ...n, read: true })))

  // ユーザーアイコン: セッションに画像があれば使用、なければデフォルト絵文字
  // TODO: DBのプロフィールアイコン実装後に差し替える
  const userIcon = session?.user?.image ? null : "👤"

  return (
    <div
      style={{
        minHeight: "100vh",
        maxWidth: 420,
        margin: "0 auto",
        background: "linear-gradient(135deg,#fce4ec 0%,#f3e5f5 40%,#e8eaf6 100%)",
        fontFamily: "'Hiragino Maru Gothic Pro','Noto Sans JP',sans-serif",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* ── ヘッダー ── */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(180,150,220,0.15)",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* 左: 戻るボタン or ロゴ */}
        {backPath !== null ? (
          <button
            onClick={() => router.push(backPath)}
            style={{
              background: "none",
              border: "none",
              fontSize: 22,
              cursor: "pointer",
              color: "#b06abf",
              padding: "0 4px",
              lineHeight: 1,
            }}
          >
            ‹
          </button>
        ) : (
          <div
            style={{
              fontSize: 17,
              fontWeight: 900,
              color: "#b06abf",
              letterSpacing: "0.05em",
            }}
          >
            🍼 おむつ免許JP
          </div>
        )}

        {/* 中央: サブページタイトル */}
        {pageTitle && (
          <div
            style={{
              fontSize: 15,
              fontWeight: 900,
              color: "#b06abf",
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            {pageTitle}
          </div>
        )}

        {/* 右: 通知ベル + アカウントアイコン */}
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <button
            onClick={() => setNotifOpen((v) => !v)}
            style={{
              position: "relative",
              background: "none",
              border: "none",
              fontSize: 22,
              cursor: "pointer",
              padding: "4px 6px",
              lineHeight: 1,
            }}
          >
            🔔
            {unreadCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: 2,
                  right: 2,
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: "#f48fb1",
                  color: "white",
                  fontSize: 9,
                  fontWeight: 900,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => { router.push("/settings"); setNotifOpen(false) }}
            style={{
              background: "linear-gradient(135deg,#f48fb1,#ce93d8)",
              border: "none",
              borderRadius: "50%",
              width: 34,
              height: 34,
              fontSize: session?.user?.image ? undefined : 18,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(244,143,177,0.35)",
              overflow: "hidden",
              padding: 0,
            }}
          >
            {session?.user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={session.user.image}
                alt="アカウント"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              userIcon
            )}
          </button>
        </div>
      </div>

      {/* ── 通知モーダル ── */}
      {notifOpen && (
        <NotifModal
          notifs={notifs}
          onRead={handleRead}
          onReadAll={handleReadAll}
          onClose={() => setNotifOpen(false)}
        />
      )}

      {/* ── メインコンテンツ ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto" }}>
        {children}
      </div>

      {/* ── ボトムナビ ── */}
      <div
        style={{
          position: "sticky",
          bottom: 0,
          zIndex: 30,
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(12px)",
          borderTop: "1px solid rgba(180,150,220,0.15)",
          display: "flex",
        }}
      >
        {TABS.map((tab) => {
          const isActive = pathname === tab.href
          return (
            <button
              key={tab.href}
              onClick={() => { router.push(tab.href); setNotifOpen(false) }}
              style={{
                flex: 1,
                padding: "10px 4px 12px",
                border: "none",
                background: "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                cursor: "pointer",
              }}
            >
              <span style={{ fontSize: 20 }}>{tab.icon}</span>
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  color: isActive ? "#b06abf" : "#ccc",
                }}
              >
                {tab.label}
              </span>
              {isActive && (
                <div
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: "#f48fb1",
                  }}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
