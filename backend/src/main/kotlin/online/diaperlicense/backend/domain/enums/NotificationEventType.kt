package online.diaperlicense.backend.domain.enums

/** 通知イベント種別 */
enum class NotificationEventType(val value: String) {
    DIAPER_CHECK("diaper_check"),
    DIAPER_CHANGE("diaper_change"),
    EARLY_BED("early_bed"),
    FAMILY_REQUEST("family_request"),
    FAMILY_APPROVED("family_approved"),
    FRIEND_REQUEST("friend_request"),
    FRIEND_APPROVED("friend_approved"),
    ;

    companion object {
        fun fromValue(value: String): NotificationEventType =
            entries.firstOrNull { it.value == value }
                ?: throw IllegalArgumentException("Unknown NotificationEventType: $value")
    }
}
