package online.diaperlicense.backend.domain.enums

/** L1: おむつ習慣ステータス */
enum class HabitualStatus(val value: String) {
    /** おしっこのみ */
    PEE("pee"),
    /** 両方 */
    BOTH("both"),
    /** 夜だけ */
    NIGHT("night"),
    /** 常時 */
    ALWAYS("always"),
    ;

    companion object {
        fun fromValue(value: String): HabitualStatus =
            entries.firstOrNull { it.value == value }
                ?: throw IllegalArgumentException("Unknown HabitualStatus: $value")
    }
}
