# Mood Energy Effects → Effect Categories Mapping

## Our 8 Core Effect Categories
1. clarifying
2. invigorating
3. calming
4. centering
5. harmonizing
6. uplifting
7. releasing
8. nourishing

## Mapping Strategy: Conservative Approach

Only map when there's clear semantic alignment. A mood phrase can map to multiple effects.

### Mood phrases from 17-tea dataset → 8 Core Effects

| Mood Energy Effect | Primary Effect | Secondary Effects | Notes |
|---|---|---|---|
| "Calming" | calming | centering | Direct match; peaceful state |
| "Relaxing" | calming | centering | Peaceful settling |
| "Energizing" / "Energized" | invigorating | clarifying | Awakening, vibrant |
| "Alerting" / "Alertness" / "Alert" | invigorating | clarifying | Mental activation |
| "Mental clarity" / "Clear-headed" | clarifying | invigorating | Cognitive focus |
| "Enhances concentration" / "Focus" | clarifying | centering | Sustained attention, present |
| "Gentle energy boost" | uplifting | invigorating | Mild emotional-spiritual lift |
| "Balanced energy" / "Balanced state of mind" | harmonizing | centering | Equilibrium between forces |
| "Steady energy" | centering | nourishing | Sustained, grounded stability |
| "Improves thinking" / "Enhances efficiency" | clarifying | invigorating | Cognitive improvement, sharpness |
| "Stress reduction" / "Reduces anxiety" | calming | centering | Emotional regulation, settling |
| "Refreshing" | clarifying | invigorating | Revitalizing clarity |
| "Invigorating" / "Reduces fatigue" | invigorating | clarifying | Active awakening |
| "Lift spirits" / "Can lift spirits" | uplifting | harmonizing | Emotional joy, spiritual lift |
| "Bright and powerful" | clarifying | invigorating | Sharp, powerful clarity |
| "Promotes relaxation" | calming | centering | Ease, peaceful presence |
| "Mindful alertness" | clarifying | centering | Present awareness, focused presence |
| "Boosts energy" | invigorating | uplifting | Vital activation with emotional lift |
| "Promotes a sense of calm" | calming | centering | Peaceful presence |
| "Expelling dampness" / "Releasing" | releasing | centering | Energy movement, expansion |
| "Deep sustenance" / "Nourishing" | nourishing | centering | Replenishing core energy |
| "Digestive aid" | releasing | nourishing | Moving energy to support digestion |
| "Mindful tasting" | clarifying | centering | Present, focused awareness |

## Test Accuracy Metric

Match is successful if API-detected effect matches ANY primary or secondary effect.

Confidence:
- Primary effect match: 1.0 points
- Secondary effect match: 0.7 points
- No match: 0.0 points
