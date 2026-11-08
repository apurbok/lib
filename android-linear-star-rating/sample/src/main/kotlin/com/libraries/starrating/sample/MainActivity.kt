package com.libraries.starrating.sample

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.libraries.starrating.StarRating
import com.libraries.starrating.StarRatingDefaults

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            SampleApp()
        }
    }
}

@Composable
private fun SampleApp() {
    MaterialTheme {
        Surface(modifier = Modifier.fillMaxSize()) {
            var rating by remember { mutableFloatStateOf(4.6f) }

            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(24.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp, Alignment.CenterVertically),
                horizontalAlignment = Alignment.CenterHorizontally,
            ) {
                Text(
                    text = "Linear star rating",
                    style = MaterialTheme.typography.titleLarge,
                )
                Text(
                    text = "Value: $rating / 5",
                    style = MaterialTheme.typography.bodyLarge,
                )
                StarRating(
                    value = rating,
                    max = 5,
                    onValueChange = { rating = it },
                    readOnly = false,
                    size = StarRatingDefaults.defaultSize,
                    gap = StarRatingDefaults.defaultGap,
                )
                Text(
                    text = "Fifth star is 60% filled at 4.6",
                    style = MaterialTheme.typography.bodyMedium,
                )
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
private fun SamplePreview() {
    SampleApp()
}
