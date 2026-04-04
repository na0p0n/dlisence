package online.diaperlicense.backend

import online.diaperlicense.backend.config.AppProperties
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.boot.runApplication

@SpringBootApplication
@EnableConfigurationProperties(AppProperties::class)
class BackendApplication

fun main(args: Array<String>) {
    runApplication<BackendApplication>(*args)
}
