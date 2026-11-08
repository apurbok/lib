package com.libraries.starrating

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class StarFillTest {
    @Test
    fun fillsFifthStarTo60PercentForRating46On5Stars() {
        val fills = getStarFills(4.6f, 5)
        assertEquals(5, fills.size)
        assertEquals(1f, fills[0].fill, 0.0001f)
        assertEquals(100f, fills[0].fillPercent, 0.0001f)
        assertEquals(1f, fills[3].fill, 0.0001f)
        assertEquals(100f, fills[3].fillPercent, 0.0001f)
        assertEquals(0.6f, fills[4].fill, 0.0001f)
        assertEquals(60f, fills[4].fillPercent, 0.0001f)
        assertEquals(5, fills[4].index)
    }

    @Test
    fun returnsAllEmptyStarsForZero() {
        val fills = getStarFills(0f, 5)
        assertTrue(fills.all { it.fill == 0f })
        assertEquals(0f, fills[0].fillPercent, 0.0001f)
    }

    @Test
    fun returnsAllFullStarsAtMax() {
        val fills = getStarFills(5f, 5)
        assertTrue(fills.all { it.fill == 1f })
    }

    @Test
    fun clampsAboveMaxToFullStars() {
        val fills = getStarFills(99f, 5)
        assertTrue(fills.all { it.fill == 1f })
    }

    @Test
    fun clampsBelowZero() {
        val fills = getStarFills(-2f, 5)
        assertTrue(fills.all { it.fill == 0f })
    }

    @Test
    fun supportsCustomMax() {
        val fills = getStarFills(2.25f, 3)
        assertEquals(3, fills.size)
        assertEquals(0.25f, fills[2].fill, 0.0001f)
        assertEquals(25f, fills[2].fillPercent, 0.0001f)
        assertEquals(3, fills[2].index)
    }

    @Test
    fun normalizeRatingRoundsToPrecision() {
        assertEquals(4.6f, normalizeRating(4.567f, 5, 1), 0.0001f)
    }
}
