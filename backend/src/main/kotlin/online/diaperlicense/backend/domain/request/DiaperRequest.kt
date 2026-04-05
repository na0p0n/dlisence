package online.diaperlicense.backend.domain.request

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size
import online.diaperlicense.backend.domain.enums.DiaperActionType
import online.diaperlicense.backend.domain.enums.DiaperCurrentStatus
import online.diaperlicense.backend.domain.validation.ValidEnum

data class UpdateDiaperStatusRequest(
    @field:NotBlank(message = "おむつステータスは必須です")
    @field:ValidEnum(enumClass = DiaperCurrentStatus::class, message = "おむつステータスが不正です")
    val currentStatus: String,
)

data class CreateDiaperLogRequest(
    @field:NotBlank(message = "アクション種別は必須です")
    @field:ValidEnum(enumClass = DiaperActionType::class, message = "アクション種別が不正です")
    val actionType: String,

    @field:Size(max = 200, message = "メモは200文字以内で入力してください")
    val note: String? = null,
)
