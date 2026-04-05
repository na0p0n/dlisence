package online.diaperlicense.backend.domain.enums

enum class UserRole(val value: String) {
    LITTLE("little"),
    CAREGIVER("caregiver"),
    SWITCH("switch"),
    ;

    companion object {
        fun fromValue(value: String): UserRole =
            entries.firstOrNull { it.value == value }
                ?: throw IllegalArgumentException("Unknown UserRole: $value")
    }
}
