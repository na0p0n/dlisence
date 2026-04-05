"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Toggle } from "@/components/shell/Toggle"
import {
  NOTIFICATION_EVENTS,
  DEFAULT_NOTIF_SETTINGS,
  type NotifSettings,
} from "@/lib/notifications"

export default function NotificationsSettingsPage() {
  const { data: session } = useSession()
  const discordConnected = !!session?.user?.discordId

  const [settings, setSettings] = useState<NotifSettings>(DEFAULT_NOTIF_SETTINGS)

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 80px" }}>
      <div style={{ fontSize: 14, color: "#bbb", marginBottom: 20 }}>
        受け取る通知の種類をON/OFFで設定できます
      </div>

      {!discordConnected && (
        <div
          style={{
            background: "#faf5ff",
            border: "1.5px dashed #ce93d8",
            borderRadius: 12,
            padding: "10px 14px",
            marginBottom: 20,
            fontSize: 11,
            color: "#b06abf",
          }}
        >
          💬 Discord連携するとDMトグルが有効になります
        </div>
      )}

      {NOTIFICATION_EVENTS.map((group) => (
        <div key={group.group} style={{ marginBottom: 20 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 900,
              color: group.color,
              letterSpacing: "0.1em",
              marginBottom: 8,
              paddingBottom: 5,
              borderBottom: `2px solid ${group.color}30`,
            }}
          >
            {group.group}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: 4,
              paddingRight: 4,
            }}
          >
            <div style={{ fontSize: 9, color: "#bbb", width: 52, textAlign: "center" }}>
              アプリ内
            </div>
            <div
              style={{
                fontSize: 9,
                color: discordConnected ? "#5865f2" : "#ccc",
                width: 52,
                textAlign: "center",
              }}
            >
              Discord
            </div>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.9)",
              borderRadius: 14,
              overflow: "hidden",
            }}
          >
            {group.items.map((item, i) => (
              <div
                key={item.key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "11px 14px",
                  gap: 8,
                  borderBottom:
                    i < group.items.length - 1 ? "1px solid #f9f0fd" : "none",
                }}
              >
                <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#555" }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: 10, color: "#bbb" }}>{item.desc}</div>
                </div>
                <div style={{ width: 52, display: "flex", justifyContent: "center" }}>
                  <Toggle
                    value={settings[item.key]?.inApp ?? true}
                    onChange={(v) =>
                      setSettings((s) => ({
                        ...s,
                        [item.key]: { ...s[item.key], inApp: v },
                      }))
                    }
                  />
                </div>
                <div style={{ width: 52, display: "flex", justifyContent: "center" }}>
                  <Toggle
                    value={settings[item.key]?.discord ?? true}
                    onChange={(v) =>
                      setSettings((s) => ({
                        ...s,
                        [item.key]: { ...s[item.key], discord: v },
                      }))
                    }
                    disabled={!discordConnected}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
