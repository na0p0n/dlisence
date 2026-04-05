package online.diaperlicense.backend.domain.request

import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.Size
import online.diaperlicense.backend.domain.enums.AgeClass
import online.diaperlicense.backend.domain.enums.CgRole
import online.diaperlicense.backend.domain.enums.CgStyle
import online.diaperlicense.backend.domain.enums.DependencyClass
import online.diaperlicense.backend.domain.enums.FriendAddMode
import online.diaperlicense.backend.domain.enums.HabitualStatus
import online.diaperlicense.backend.domain.enums.IconType
import online.diaperlicense.backend.domain.validation.ValidEnum

/** プロフィール更新リクエスト。null のフィールドは更新しない。 */
data class UpdateUserRequest(

    @field:Size(max = 30, message = "ニックネームは30文字以内で入力してください")
    val nickname: String? = null,

    @field:ValidEnum(enumClass = IconType::class, allowNull = true, message = "アイコン種別は emoji または image を指定してください")
    val iconType: String? = null,

    val iconEmoji: String? = null,
    val iconUrl: String? = null,

    @field:Min(value = 1, message = "年齢は1以上で入力してください")
    @field:Max(value = 149, message = "年齢が不正です")
    val age: Int? = null,

    @field:Min(value = 0, message = "リトル年齢は0以上で入力してください")
    val littleAge: Int? = null,

    @field:ValidEnum(enumClass = DependencyClass::class, allowNull = true, message = "依存度クラスが不正です")
    val dependencyClass: String? = null,

    @field:ValidEnum(enumClass = AgeClass::class, allowNull = true, message = "精神年齢クラスが不正です")
    val ageClass: String? = null,

    @field:ValidEnum(enumClass = CgRole::class, allowNull = true, message = "ケアギバーロールが不正です")
    val cgRole: String? = null,

    @field:ValidEnum(enumClass = CgStyle::class, allowNull = true, message = "ケアギバースタイルが不正です")
    val cgStyle: String? = null,

    @field:Size(max = 40, message = "ひとことは40文字以内で入力してください")
    val memo: String? = null,

    @field:Size(max = 200, message = "自己紹介は200文字以内で入力してください")
    val bio: String? = null,

    val diaperBrand: String? = null,
    val snsX: String? = null,

    @field:ValidEnum(enumClass = HabitualStatus::class, allowNull = true, message = "習慣ステータスが不正です")
    val habitualStatus: String? = null,

    @field:ValidEnum(enumClass = FriendAddMode::class, allowNull = true, message = "友達追加モードが不正です")
    val friendAddMode: String? = null,
)
