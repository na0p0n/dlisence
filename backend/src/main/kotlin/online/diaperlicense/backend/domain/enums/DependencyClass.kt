package online.diaperlicense.backend.domain.enums

/** リトルの依存度クラス */
enum class DependencyClass(val value: String) {
    /** F: 常時 */
    FULL("F"),
    /** D: 日常 */
    DAILY("D"),
    /** P: 特定シーン */
    PARTIAL("P"),
    ;

    companion object {
        fun fromValue(value: String): DependencyClass =
            entries.firstOrNull { it.value == value }
                ?: throw IllegalArgumentException("Unknown DependencyClass: $value")
    }
}
