package online.diaperlicense.backend.domain.validation

import jakarta.validation.Constraint
import jakarta.validation.ConstraintValidator
import jakarta.validation.ConstraintValidatorContext
import jakarta.validation.Payload
import kotlin.reflect.KClass

/**
 * 文字列フィールドが指定した Enum の value に含まれているか検証するアノテーション。
 *
 * 使い方:
 *   @ValidEnum(enumClass = UserRole::class)
 *   val role: String
 *
 * nullable フィールドに使う場合は allowNull = true を指定する。
 */
@Target(AnnotationTarget.FIELD, AnnotationTarget.VALUE_PARAMETER)
@Retention(AnnotationRetention.RUNTIME)
@Constraint(validatedBy = [ValidEnumValidator::class])
annotation class ValidEnum(
    val enumClass: KClass<out Enum<*>>,
    val allowNull: Boolean = false,
    val message: String = "許可されていない値です",
    val groups: Array<KClass<*>> = [],
    val payload: Array<KClass<out Payload>> = [],
)

class ValidEnumValidator : ConstraintValidator<ValidEnum, String?> {

    private lateinit var allowedValues: Set<String>
    private var allowNull: Boolean = false

    override fun initialize(annotation: ValidEnum) {
        allowNull = annotation.allowNull
        // Enum クラスの value プロパティ（文字列）を収集
        allowedValues = annotation.enumClass.java.enumConstants
            .mapNotNull { constant ->
                constant.javaClass.getDeclaredMethod("getValue")
                    .also { it.isAccessible = true }
                    .invoke(constant) as? String
            }
            .toSet()
    }

    override fun isValid(value: String?, context: ConstraintValidatorContext): Boolean {
        if (value == null) return allowNull
        return value in allowedValues
    }
}
