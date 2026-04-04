package online.diaperlicense.backend.security

import io.jsonwebtoken.JwtException
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import online.diaperlicense.backend.config.AppProperties
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

@Component
class NextAuthJwtFilter(
    private val appProperties: AppProperties,
) : OncePerRequestFilter() {

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
            } catch (_: JwtException) {
                // 無効なトークン - 未認証のまま続行
            } catch (_: IllegalArgumentException) {
                // 不正な引数 - 未認証のまま続行
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
