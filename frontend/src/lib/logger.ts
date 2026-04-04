import pino from "pino"

const isDev = process.env.NODE_ENV === "development"

const logger = pino({
  level: process.env.LOG_LEVEL ?? (isDev ? "debug" : "info"),
  ...(isDev && {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:yyyy-mm-dd HH:MM:ss",
        ignore: "pid,hostname",
      },
    },
  }),
  ...(!isDev && {
    // 本番: JSON 構造化ログ（コンテナ / ログ収集ツール向け）
    formatters: {
      level(label) {
        return { level: label }
      },
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  }),
})

export default logger

/**
 * モジュール別の子ロガーを生成する
 * 使い方: const log = createLogger("auth")
 */
export function createLogger(module: string) {
  return logger.child({ module })
}
