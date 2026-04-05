package online.diaperlicense.backend.domain.request

import online.diaperlicense.backend.domain.enums.Visibility
import online.diaperlicense.backend.domain.validation.ValidEnum

/** 公開設定更新リクエスト。null のフィールドは更新しない。 */
data class UpdatePrivacySettingsRequest(

    @field:ValidEnum(enumClass = Visibility::class, allowNull = true, message = "公開範囲が不正です")
    val classRank: String? = null,

    @field:ValidEnum(enumClass = Visibility::class, allowNull = true, message = "公開範囲が不正です")
    val age: String? = null,

    @field:ValidEnum(enumClass = Visibility::class, allowNull = true, message = "公開範囲が不正です")
    val littleAge: String? = null,

    @field:ValidEnum(enumClass = Visibility::class, allowNull = true, message = "公開範囲が不正です")
    val memo: String? = null,

    @field:ValidEnum(enumClass = Visibility::class, allowNull = true, message = "公開範囲が不正です")
    val bio: String? = null,

    @field:ValidEnum(enumClass = Visibility::class, allowNull = true, message = "公開範囲が不正です")
    val habitualStatus: String? = null,

    @field:ValidEnum(enumClass = Visibility::class, allowNull = true, message = "公開範囲が不正です")
    val diaperBrand: String? = null,

    @field:ValidEnum(enumClass = Visibility::class, allowNull = true, message = "公開範囲が不正です")
    val sns: String? = null,

    @field:ValidEnum(enumClass = Visibility::class, allowNull = true, message = "公開範囲が不正です")
    val currentStatus: String? = null,

    @field:ValidEnum(enumClass = Visibility::class, allowNull = true, message = "公開範囲が不正です")
    val diaperLogs: String? = null,
)
