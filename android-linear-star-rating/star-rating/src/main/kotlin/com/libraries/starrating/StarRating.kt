package com.libraries.starrating

import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clipToBounds
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Outline
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.role
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.Density
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import androidx.compose.foundation.Canvas
import androidx.compose.ui.Alignment

data class StarRatingColors(
    val filled: Color,
    val empty: Color,
)

object StarRatingDefaults {
  val defaultSize: Dp = 32.dp
  val defaultGap: Dp = 4.dp

  @Composable
  fun colors(
      filled: Color = Color(0xFFFFB400),
      empty: Color = Color(0xFFD6D6D6),
  ): StarRatingColors = StarRatingColors(filled = filled, empty = empty)
}

@Composable
fun StarRating(
    value: Float,
    modifier: Modifier = Modifier,
    max: Int = DEFAULT_MAX_STARS,
    onValueChange: ((Float) -> Unit)? = null,
    readOnly: Boolean = onValueChange == null,
    colors: StarRatingColors = StarRatingDefaults.colors(),
    size: Dp = StarRatingDefaults.defaultSize,
    gap: Dp = StarRatingDefaults.defaultGap,
) {
    val fills = remember(value, max) { getStarFills(value, max) }
    val interactive = !readOnly && onValueChange != null

    Row(
        modifier = modifier.semantics {
            contentDescription = "Rating $value out of $max"
            role = Role.Button
        },
        horizontalArrangement = Arrangement.spacedBy(gap),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        fills.forEach { state ->
            val starModifier = if (interactive) {
                Modifier.clickable(
                    interactionSource = remember { MutableInteractionSource() },
                    indication = null,
                    role = Role.Button,
                ) {
                    onValueChange?.invoke(state.index.toFloat())
                }
            } else {
                Modifier
            }

            LinearStar(
                fill = state.fill,
                colors = colors,
                modifier = starModifier.size(size),
            )
        }
    }
}

@Composable
private fun LinearStar(
    fill: Float,
    colors: StarRatingColors,
    modifier: Modifier = Modifier,
) {
    val starShape = remember { StarShape() }
    val clampedFill = fill.coerceIn(0f, 1f)

    BoxWithConstraints(modifier = modifier) {
        val filledWidth = maxWidth * clampedFill

        Canvas(modifier = Modifier.size(maxWidth, maxHeight)) {
            drawPath(starShape.createPath(size), colors.empty)
        }
        Box(
            modifier = Modifier
                .align(Alignment.CenterStart)
                .width(filledWidth)
                .height(maxHeight)
                .clipToBounds(),
        ) {
            Canvas(modifier = Modifier.size(maxWidth, maxHeight)) {
                drawPath(starShape.createPath(size), colors.filled)
            }
        }
    }
}

private class StarShape : Shape {
    override fun createOutline(size: Size, layoutDirection: LayoutDirection, density: Density): Outline {
        return Outline.Generic(createPath(size))
    }

    fun createPath(size: Size): Path {
        val path = Path()
        val w = size.width
        val h = size.height
        val cx = w / 2f
        val cy = h / 2f
        val outer = minOf(w, h) / 2f
        val inner = outer * 0.45f
        val points = 5
        val angleStep = (Math.PI * 2 / points).toFloat()
        val startAngle = (-Math.PI / 2).toFloat()

        for (i in 0 until points * 2) {
            val radius = if (i % 2 == 0) outer else inner
            val angle = startAngle + i * angleStep / 2f
            val x = cx + kotlin.math.cos(angle) * radius
            val y = cy + kotlin.math.sin(angle) * radius
            if (i == 0) {
                path.moveTo(x, y)
            } else {
                path.lineTo(x, y)
            }
        }
        path.close()
        return path
    }
}
