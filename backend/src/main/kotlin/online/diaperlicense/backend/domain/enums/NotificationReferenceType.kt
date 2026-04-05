package online.diaperlicense.backend.domain.enums

/** 通知の関連リソース種別 */
enum class NotificationReferenceType(val value: String) {
    FAMILY_LINK("family_link"),
    DIAPER_LOG("diaper_log"),
    RELATIONSHIP("relationship"),
    ;

    companion object {
        fun fromValue(value: String): NotificationReferenceType =
            entries.firstOrNull { it.value == value }
                ?: throw IllegalArgumentException("Unknown NotificationReferenceType: $value")
    }
}
