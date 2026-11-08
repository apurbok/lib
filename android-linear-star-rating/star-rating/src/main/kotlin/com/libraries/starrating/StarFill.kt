package com.libraries.starrating

import kotlin.math.pow
import kotlin.math.round

const val DEFAULT_MAX_STARS = 5

data class StarFillState(
    /** 1-based star index. */
    val index: Int,
    /** Linear fill from 0 (empty) to 1 (full). */
    val fill: Float,
    /** Same as [fill], expressed as 0–100 percentage. */
    val fillPercent: Float,
)

/**
 * Clamps a rating into `[0, max]` and rounds to [precision] decimal places when provided.
 */
fun normalizeRating(
    value: Float,
    max: Int = DEFAULT_MAX_STARS,
    precision: Int? = null,
): Float {
    val clamped = value.coerceIn(0f, max.toFloat())
    if (precision == null) {
        return clamped
    }
    val factor = 10.0.pow(precision).toFloat()
    return round(clamped * factor) / factor
}

/**
 * Computes per-star linear fill for a decimal rating.
 *
 * Example: value 4.6, max 5 → stars 1–4 at 100%, star 5 at 60%.
 */
fun getStarFills(
    value: Float,
    max: Int = DEFAULT_MAX_STARS,
): List<StarFillState> {
    val clamped = normalizeRating(value, max)
    return (1..max).map { index ->
        val fill = (clamped - (index - 1)).coerceIn(0f, 1f)
        StarFillState(
            index = index,
            fill = fill,
            fillPercent = round(fill * 10_000f) / 100f,
        )
    }
}

fun starRatingFromConfig(
    value: Float,
    max: Int = DEFAULT_MAX_STARS,
    precision: Int? = null,
): List<StarFillState> {
    val normalized = if (precision != null) {
        normalizeRating(value, max, precision)
    } else {
        normalizeRating(value, max)
    }
    return getStarFills(normalized, max)
}
