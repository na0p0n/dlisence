"use client"

interface ToggleProps {
  value: boolean
  onChange: (v: boolean) => void
  disabled?: boolean
}

export function Toggle({ value, onChange, disabled = false }: ToggleProps) {
  return (
    <div
      role="switch"
      aria-checked={value}
      onClick={() => !disabled && onChange(!value)}
      style={{
        width: 42,
        height: 24,
        borderRadius: 99,
        background:
          value && !disabled
            ? "linear-gradient(135deg,#f48fb1,#ce93d8)"
            : "#e0e0e0",
        position: "relative",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "background 0.25s",
        flexShrink: 0,
        opacity: disabled ? 0.4 : 1,
        boxShadow:
          value && !disabled ? "0 2px 8px rgba(244,143,177,0.4)" : "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 3,
          left: value ? 21 : 3,
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: "white",
          boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
          transition: "left 0.25s",
        }}
      />
    </div>
  )
}
