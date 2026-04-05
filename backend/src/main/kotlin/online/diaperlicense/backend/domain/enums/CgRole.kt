package online.diaperlicense.backend.domain.enums

/** ケアギバーのロール */
enum class CgRole(val value: String) {
    DADDY("Da"),
    MOMMY("Mo"),
    BROTHER("Br"),
    SISTER("Si"),
    ;

    companion object {
        fun fromValue(value: String): CgRole =
            entries.firstOrNull { it.value == value }
                ?: throw IllegalArgumentException("Unknown CgRole: $value")
    }
}
