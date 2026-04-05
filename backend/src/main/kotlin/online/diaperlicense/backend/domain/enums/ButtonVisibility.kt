package online.diaperlicense.backend.domain.enums

/** ケアギバーボタンの公開範囲 (リトル側が設定) */
enum class ButtonVisibility(val value: String) {
    LINKED_ONLY("linked_only"),
    PUBLIC("public"),
    ;

    companion object {
        fun fromValue(value: String): ButtonVisibility =
            entries.firstOrNull { it.value == value }
                ?: throw IllegalArgumentException("Unknown ButtonVisibility: $value")
    }
}
