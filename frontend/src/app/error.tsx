"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { logErrorAction } from "./actions/log-error"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const pathname = usePathname()

  useEffect(() => {
    logErrorAction({
      message: error.message,
      stack: error.stack,
      digest: error.digest,
      path: pathname,
    })
  }, [error, pathname])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <p className="text-sm text-gray-500">エラーが発生しました</p>
      <button
        onClick={reset}
        className="px-4 py-2 text-sm bg-gray-100 rounded hover:bg-gray-200"
      >
        再試行
      </button>
    </div>
  )
}
