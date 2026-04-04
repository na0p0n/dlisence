package online.diaperlicense.backend.security

import io.jsonwebtoken.JwtException
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import online.diaperlicense.backend.config.AppProperties
import org.slf4j.LoggerFactory
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

@Component
class NextAuthJwtFilter(
    private val appProperties: AppProperties,
) : OncePerRequestFilter() {

    private val log = LoggerFactory.getLogger(NextAuthJwtFilter::class.java)

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain,
    ) {
        val token = extractBearerToken(request)

        if (token != null) {
            try {
                val key = Keys.hmacShaKeyFor(
                    appProperties.nextauthSecret.toByteArray(Charsets.UTF_8),
                )
                val claims = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .payload

                val userId = claims.subject
                if (userId != null) {
                    SecurityContextHolder.getContext().authentication =
                        JwtAuthentication(userId)
                }
            } catch (e: JwtException) {
                log.warn("Invalid JWT token: {}", e.message)
            } catch (e: IllegalArgumentException) {
                log.warn("Invalid JWT argument: {}", e.message)
            }
        }

        filterChain.doFilter(request, response)
    }

    private fun extractBearerToken(request: HttpServletRequest): String? {
        val header = request.getHeader("Authorization") ?: return null
        if (!header.startsWith("Bearer ")) return null
        return header.removePrefix("Bearer ")
    }
}
