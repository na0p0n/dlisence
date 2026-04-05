package online.diaperlicense.backend.domain.enums

enum class IconType(val value: String) {
    EMOJI("emoji"),
    IMAGE("image"),
    ;

    companion object {
        fun fromValue(value: String): IconType =
            entries.firstOrNull { it.value == value }
                ?: throw IllegalArgumentException("Unknown IconType: $value")
    }
}
