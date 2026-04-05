package online.diaperlicense.backend.domain.enums

/** プロフィール項目の公開範囲 */
enum class Visibility(val value: String) {
    /** 誰でも */
    PUBLIC("public"),
    /** 友達以上 */
    FRIENDS("friends"),
    /** 親子リンク済みのみ */
    FAMILY("family"),
    ;

    companion object {
        fun fromValue(value: String): Visibility =
            entries.firstOrNull { it.value == value }
                ?: throw IllegalArgumentException("Unknown Visibility: $value")
    }
}
