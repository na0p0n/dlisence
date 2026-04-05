package online.diaperlicense.backend.domain.enums

/** 友達追加モード */
enum class FriendAddMode(val value: String) {
    /** ワンクリック追加 */
    ONECLICK("oneclick"),
    /** 承認制 */
    REQUEST("request"),
    ;

    companion object {
        fun fromValue(value: String): FriendAddMode =
            entries.firstOrNull { it.value == value }
                ?: throw IllegalArgumentException("Unknown FriendAddMode: $value")
    }
}
