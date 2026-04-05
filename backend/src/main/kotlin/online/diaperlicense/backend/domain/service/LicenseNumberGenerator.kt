package online.diaperlicense.backend.domain.service

import org.springframework.stereotype.Component
import java.security.SecureRandom

/**
 * 免許番号ジェネレーター
 *
 * フォーマット: (国コード)-(13文字ランダム英数字)
 * 例: JP-A3F7K2M9X1Q4R
 *
 * 文字種: 大文字英字 + 数字 (紛らわしい文字 O/0/I/1 を除外)
 * 衝突確率: 32^13 ≒ 3.6 × 10^19 通り
 */
@Component
class LicenseNumberGenerator {

    companion object {
        private const val COUNTRY_CODE = "JP"
        private const val RANDOM_LENGTH = 13

        // 紛らわしい文字 (O, 0, I, 1) を除いた英数字
        private val CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
    }

    private val random = SecureRandom()

    fun generate(): String {
        val suffix = (1..RANDOM_LENGTH)
            .map { CHARS[random.nextInt(CHARS.length)] }
            .joinToString("")
        return "$COUNTRY_CODE-$suffix"
    }
}
