package online.diaperlicense.backend.domain.enums

/** L2: おむつ現在状態 */
enum class DiaperCurrentStatus(val value: String) {
    CLEAN_DRY("clean_dry"),
    WET("wet"),
    DIRTY("dirty"),
    /** 着用中・状態不明 */
    WEARING("wearing"),
    ;

    companion object {
        fun fromValue(value: String): DiaperCurrentStatus =
            entries.firstOrNull { it.value == value }
                ?: throw IllegalArgumentException("Unknown DiaperCurrentStatus: $value")
    }
}
