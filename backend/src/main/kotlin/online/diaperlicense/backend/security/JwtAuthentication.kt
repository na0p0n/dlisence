package online.diaperlicense.backend.security

import org.springframework.security.authentication.AbstractAuthenticationToken

class JwtAuthentication(
    private val userId: String,
) : AbstractAuthenticationToken(emptyList()) {

    init {
        isAuthenticated = true
    }

    override fun getCredentials(): Any = ""
    override fun getPrincipal(): String = userId
}
