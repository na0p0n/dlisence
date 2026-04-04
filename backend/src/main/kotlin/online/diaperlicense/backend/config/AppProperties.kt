package online.diaperlicense.backend.config

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "app")
data class AppProperties(
    val nextauthSecret: String,
    val supabaseUrl: String = "",
    val supabaseAnonKey: String = "",
    val discordBotToken: String = "",
)
