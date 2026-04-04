package online.diaperlicense.backend.exception

import jakarta.servlet.http.HttpServletRequest
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ProblemDetail
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice

@RestControllerAdvice
class GlobalExceptionHandler {

    private val log = LoggerFactory.getLogger(GlobalExceptionHandler::class.java)

    /** バリデーションエラー (400) */
    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleValidation(
        ex: MethodArgumentNotValidException,
        request: HttpServletRequest,
    ): ProblemDetail {
        val errors = ex.bindingResult.fieldErrors.map { "${it.field}: ${it.defaultMessage}" }
        log.warn("Validation failed [{}] {}: {}", request.method, request.requestURI, errors)
        return ProblemDetail.forStatus(HttpStatus.BAD_REQUEST).also {
            it.detail = errors.joinToString(", ")
        }
    }

    /** 未処理の例外 (500) */
    @ExceptionHandler(Exception::class)
    fun handleUnexpected(
        ex: Exception,
        request: HttpServletRequest,
    ): ProblemDetail {
        log.error("Unhandled exception [{}] {}", request.method, request.requestURI, ex)
        return ProblemDetail.forStatus(HttpStatus.INTERNAL_SERVER_ERROR).also {
            it.detail = "Internal server error"
        }
    }
}
