# Mood Energy Effects → Effect Categories Mapping

## Our 12 Effect Categories
1. clarifying
2. refreshing
3. energizing
4. calming
5. harmonizing
6. grounding
7. elevating
8. comforting
9. warming
10. aromatic
11. relaxing
12. mentally-stimulating

## Mapping Strategy: Conservative Approach

Only map when there's clear semantic alignment. A mood phrase can map to multiple effects.

### Mood phrases from 17-tea dataset → Effects

| Mood Energy Effect | Primary Effect | Secondary Effects | Notes |
|---|---|---|---|
| "Calming" | calming | relaxing | Direct match |
| "Relaxing" | relaxing | calming | Direct match |
| "Energizing" / "Energized" | energizing | clarifying | Active state |
| "Alerting" / "Alertness" / "Alert" | energizing | mentally-stimulating | Cognitive activation |
| "Mental clarity" / "Clear-headed" | clarifying | mentally-stimulating | Cognitive focus |
| "Mental alertness" / "Alertness" | mentally-stimulating | clarifying | Mental activation |
| "Enhances concentration" / "Focus" | clarifying | mentally-stimulating | Sustained attention |
| "Gentle energy boost" | elevating | energizing | Mild uplifting |
| "Balanced energy" / "Balanced state of mind" | harmonizing | elevating | Equilibrium |
| "Steady energy" | grounding | energizing | Sustained, stable |
| "Enhances efficiency" / "Improves thinking" | mentally-stimulating | clarifying | Cognitive improvement |
| "Stress reduction" / "Reduces anxiety" | relaxing | calming | Emotional regulation |
| "Refreshing" | refreshing | energizing | Revitalizing |
| "Invigorating" / "Reduces fatigue" | energizing | clarifying | Active revitalization |
| "Lift spirits" / "Can lift spirits" | elevating | harmonizing | Emotional uplifting |
| "Bright and powerful" | clarifying | energizing | Cognitive & physical power |
| "Promotes relaxation" | relaxing | calming | Ease & peace |
| "Can also be relaxing/calming" | relaxing | calming | Secondary characteristic |
| "Mindful alertness" | clarifying | grounding | Present awareness |

## Test Accuracy Metric

Match is successful if API-detected effect matches ANY primary or secondary effect.

Confidence:
- Primary effect match: 1.0 points
- Secondary effect match: 0.7 points
- No match: 0.0 points
