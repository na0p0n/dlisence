package online.diaperlicense.backend.domain.enums

/** リトルの精神年齢クラス */
enum class AgeClass(val value: String) {
    /** B: Baby */
    BABY("B"),
    /** T: Toddler */
    TODDLER("T"),
    /** K: Kids */
    KIDS("K"),
    ;

    companion object {
        fun fromValue(value: String): AgeClass =
            entries.firstOrNull { it.value == value }
                ?: throw IllegalArgumentException("Unknown AgeClass: $value")
    }
}
