package online.diaperlicense.backend.domain.enums

/** L3: ケアギバーの操作種別 */
enum class DiaperActionType(val value: String) {
    CHECK("check"),
    CHANGE_REQUEST("change_request"),
    CHANGED("changed"),
    EARLY_BED("early_bed"),
    ;

    companion object {
        fun fromValue(value: String): DiaperActionType =
            entries.firstOrNull { it.value == value }
                ?: throw IllegalArgumentException("Unknown DiaperActionType: $value")
    }
}
