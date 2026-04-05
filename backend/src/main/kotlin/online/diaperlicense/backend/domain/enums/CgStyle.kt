package online.diaperlicense.backend.domain.enums

/** ケアギバーのスタイル */
enum class CgStyle(val value: String) {
    /** 1: 甘々 */
    SWEET("1"),
    /** 2: バランス */
    BALANCE("2"),
    /** 3: スパルタ */
    STRICT("3"),
    ;

    companion object {
        fun fromValue(value: String): CgStyle =
            entries.firstOrNull { it.value == value }
                ?: throw IllegalArgumentException("Unknown CgStyle: $value")
    }
}
