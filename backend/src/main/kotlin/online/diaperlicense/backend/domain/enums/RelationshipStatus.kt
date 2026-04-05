package online.diaperlicense.backend.domain.enums

/** 友達関係ステータス */
enum class RelationshipStatus(val value: String) {
    PENDING("pending"),
    ACCEPTED("accepted"),
    REJECTED("rejected"),
    BLOCKED("blocked"),
    ;

    companion object {
        fun fromValue(value: String): RelationshipStatus =
            entries.firstOrNull { it.value == value }
                ?: throw IllegalArgumentException("Unknown RelationshipStatus: $value")
    }
}
