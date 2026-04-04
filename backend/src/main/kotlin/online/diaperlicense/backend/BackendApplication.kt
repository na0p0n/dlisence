package online.diaperlicense.backend

import online.diaperlicense.backend.config.AppProperties
import org.slf4j.LoggerFactory
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.boot.runApplication

@SpringBootApplication
@EnableConfigurationProperties(AppProperties::class)
class BackendApplication

private val log = LoggerFactory.getLogger("online.diaperlicense.backend.BackendApplication")

fun main(args: Array<String>) {
    runApplication<BackendApplication>(*args)
    log.info("おむつ免許JP backend started")
}
