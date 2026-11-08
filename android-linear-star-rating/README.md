# android-linear-star-rating

Kotlin Jetpack Compose library for **linear** partial star fill (e.g. `4.6` → the last star is 60% filled). Fill math matches `@libraries/star-rating-core` on the web.

## Gradle dependency

Publish coordinates (placeholder until released to Maven Central):

```kotlin
dependencies {
    implementation("com.libraries:star-rating:0.1.0")
}
```

**Local development** — include the module from this repo:

```kotlin
// settings.gradle.kts
includeBuild("../android-linear-star-rating") // or copy :star-rating into your project

dependencies {
    implementation(project(":star-rating"))
}
```

## Usage

```kotlin
import com.libraries.starrating.StarRating
import com.libraries.starrating.StarRatingDefaults

StarRating(
    value = 4.6f,
    max = 5,
    onValueChange = { newValue -> /* ... */ },
    readOnly = false,
    colors = StarRatingDefaults.colors(),
    size = StarRatingDefaults.defaultSize,
    gap = StarRatingDefaults.defaultGap,
)
```

Pure Kotlin helpers (`getStarFills`, `normalizeRating`) live in the same artifact for custom UI.

## Sample app

The `:sample` module shows a `4.6` rating with interactive taps.

```bash
./gradlew :sample:installDebug
```

## Publish library locally

```bash
./gradlew :star-rating:publishToMavenLocal
```

Artifact: `com.libraries:star-rating:0.1.0`

## Tests

```bash
./gradlew :star-rating:test
```

Unit tests for fill math run on the JVM under `star-rating/src/test`.

## Project structure

```
android-linear-star-rating/
├── star-rating/          # Publishable Android library
├── sample/               # Demo app
├── gradle/libs.versions.toml
└── README.md
```
