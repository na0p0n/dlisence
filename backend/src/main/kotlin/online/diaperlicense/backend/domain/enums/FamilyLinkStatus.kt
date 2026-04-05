package online.diaperlicense.backend.domain.enums

/** 親子リンクステータス */
enum class FamilyLinkStatus(val value: String) {
    PENDING("pending"),
    ACCEPTED("accepted"),
    REJECTED("rejected"),
    DISSOLVED("dissolved"),
    ;

    companion object {
        fun fromValue(value: String): FamilyLinkStatus =
            entries.firstOrNull { it.value == value }
                ?: throw IllegalArgumentException("Unknown FamilyLinkStatus: $value")
    }
}
