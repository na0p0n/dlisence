package online.diaperlicense.backend.domain.request

import jakarta.validation.constraints.NotBlank
import online.diaperlicense.backend.domain.enums.ButtonVisibility
import online.diaperlicense.backend.domain.validation.ValidEnum
import java.util.UUID

data class SendFamilyLinkRequest(
    @field:NotBlank(message = "リトルIDは必須です")
    val littleId: UUID,
)

data class RespondFamilyLinkRequest(
    /** true: 承認 / false: 拒否 */
    val accept: Boolean,
)

data class UpdateButtonVisibilityRequest(
    @field:NotBlank(message = "ボタン公開範囲は必須です")
    @field:ValidEnum(enumClass = ButtonVisibility::class, message = "ボタン公開範囲が不正です")
    val buttonVisibility: String,
)
