"use server"

import { createLogger } from "@/lib/logger"

const log = createLogger("error-boundary")

export async function logErrorAction(params: {
  message: string
  stack?: string
  digest?: string
  path: string
}) {
  log.error(params, "Client-side error caught by error boundary")
}
