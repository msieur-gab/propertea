# API Format Modes Documentation

## Overview

The Tea Recommendation API supports three output formats, each optimized for different use cases. Control output with the `format` parameter.

## Quick Reference

| Format | Size | Use Case | Includes |
|--------|------|----------|----------|
| **raw** | ~44KB | Testing, exports, validation | Recommendations + renderer traces |
| **display** | ~13KB | Production UI, mobile apps | Recommendations only (simplified) |
| **verbose** | ~68KB | Debugging, troubleshooting | Everything + full inference traces |

---

## Format Modes

### 1. RAW Format (default)

**Complete renderer output with all analysis, trace, and confidence data**

```javascript
// Request
POST /tea-recommendation
{
  "name": "Tie Guan Yin",
  "type": "oolong",
  "caffeineLevel": 4,
  "lTheanineLevel": 5,
  "flavorProfile": ["floral", "orchid", "creamy"],
  "format": "raw"  // or omit (default)
}
```

```javascript
// Response Structure
{
  "tea": {
    "name": "Tie Guan Yin",
    "originalName": "铁观音",
    "type": "oolong",
    "subType": "tie-guan-yin"
  },
  "recommendations": {
    "activity": {
      "recommendations": [...],
      "clusters": [...],
      "analysis": {...},
      "trace": [...]        // ✓ Renderer reasoning
    },
    "time": {
      "recommendations": [...],
      "circadianCurve": [...],
      "analysis": {...},
      "trace": [...]        // ✓ Full calculation steps
    },
    // ... other renderers
  },
  "metadata": {
    "timestamp": "2025-11-03T13:45:00Z",
    "processingTimeMs": 125,
    "version": "2.0",
    "format": "raw"
  }
}
```

**Best For:**
- Testing and validation
- A/B testing
- Data exports for analysis
- Comparing algorithm changes

**Size:** ~44KB per tea (1160 lines)

---

### 2. DISPLAY Format

**UI-ready format optimized for frontend consumption**

```javascript
// Request
POST /tea-recommendation
{
  "name": "Tie Guan Yin",
  "type": "oolong",
  "caffeineLevel": 4,
  "lTheanineLevel": 5,
  "flavorProfile": ["floral", "orchid", "creamy"],
  "format": "display"
}
```

```javascript
// Response Structure (simplified)
{
  "tea": {
    "name": "Tie Guan Yin",
    "originalName": "铁观音",
    "type": "oolong",
    "subType": "tie-guan-yin"
  },
  "recommendations": {
    "activity": {
      "recommendations": [
        {
          "activity": "Meditation",
          "score": 85,              // ✓ Rounded
          "description": "...",
          "timing": "Flexible"
        }
      ],
      "clusters": [...]
    },
    "time": {
      "recommendations": [
        {
          "hour": 10,
          "score": 78,              // ✓ Rounded
          "timeOfDay": "Morning",
          "narrative": "..."
        }
      ],
      "circadianCurve": [...]       // ✓ Chart data preserved
    }
    // ... other renderers (simplified)
  },
  "metadata": {
    "timestamp": "2025-11-03T13:45:00Z",
    "version": "2.0",
    "format": "display"
  }
}
```

**Transformations Applied:**
- ✗ No trace arrays
- ✗ No analysis objects
- ✗ No confidence scores
- ✓ Rounded scores (78.542 → 79)
- ✓ Essential display data only

**Best For:**
- Production UI
- Mobile apps
- Lightweight clients
- Bandwidth-constrained environments

**Size:** ~13KB per tea (324 lines) — **71% smaller than raw**

---

### 3. VERBOSE Format

**Full debugging format with complete inference traces**

```javascript
// Request
POST /tea-recommendation
{
  "name": "Tie Guan Yin",
  "type": "oolong",
  "caffeineLevel": 4,
  "lTheanineLevel": 5,
  "flavorProfile": ["floral", "orchid", "creamy"],
  "format": "verbose"
}
```

```javascript
// Response Structure (everything)
{
  "tea": {...},
  "recommendations": {
    "activity": {
      "recommendations": [...],
      "analysis": {...},
      "trace": [...]        // ✓ Renderer reasoning
    }
    // ... all renderers with full data
  },
  "inferences": {           // ✓ Full inference details
    "compound": {
      "analysis": {
        "caffeineLevel": 4,
        "lTheanineLevel": 5,
        "ratio": "0.80",
        "ratioCategory": "Balanced",
        "stimulationLevel": "Moderate",
        "relaxationLevel": "Moderate",
        "compoundProfile": "Balanced & Focused"
      },
      "trace": [            // ✓ Every calculation step
        {
          "step": "Input Reception",
          "reason": "Raw form data received",
          "adjustment": "caffeineLevel: 4, lTheanineLevel: 5",
          "value": "Data validated"
        },
        // ... more steps
      ],
      "confidence": 0.95,
      "inferrerVersion": "2.0"
    },
    "flavor": {...},        // ✓ All inferrers
    "teaType": {...},
    "geography": {...},
    "processing": {...}
  },
  "debug": {                // ✓ Debugging metadata
    "inferrersRun": ["compound", "flavor", "teaType", "geography", "processing"],
    "renderersRun": ["activity", "food", "time", "season", "brewing", "terroir"],
    "totalTraceSteps": 66
  },
  "metadata": {
    "timestamp": "2025-11-03T13:45:00Z",
    "processingTimeMs": 125,
    "version": "2.0",
    "format": "verbose"
  }
}
```

**Best For:**
- Development and debugging
- Algorithm troubleshooting
- Quality assurance
- Understanding why specific recommendations were made

**Size:** ~68KB per tea (1843 lines) — **53% larger than raw**

---

## Usage Examples

### Frontend (Production)

```javascript
// Use display format for production UI
const response = await fetch('/api/tea-recommendation', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    ...teaData,
    format: 'display'  // Lightweight response
  })
});

const data = await response.json();

// Clean, simplified structure
data.recommendations.activity.recommendations.forEach(rec => {
  console.log(`${rec.activity}: ${rec.score}/100`);
});
```

### Testing/Validation

```javascript
// Use raw format for testing
const response = await fetch('/api/tea-recommendation', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    ...teaData,
    format: 'raw'  // Complete renderer output
  })
});

const data = await response.json();

// Includes full analysis and renderer traces
console.log('Activity trace:', data.recommendations.activity.trace);
console.log('Compound analysis:', data.recommendations.activity.analysis);
```

### Debugging

```javascript
// Use verbose format for debugging
const response = await fetch('/api/tea-recommendation', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    ...teaData,
    format: 'verbose'  // Everything + inference traces
  })
});

const data = await response.json();

// Full pipeline visibility
console.log('Compound inferrer steps:', data.inferences.compound.trace);
console.log('Activity renderer steps:', data.recommendations.activity.trace);
console.log('Debug info:', data.debug);
```

---

## Performance Comparison

**Test tea: Tie Guan Yin (oolong)**

| Metric | raw | display | verbose |
|--------|-----|---------|---------|
| Response size | 44.19 KB | 12.62 KB | 67.53 KB |
| JSON lines | 1160 | 324 | 1843 |
| Renderer traces | ✓ Yes | ✗ No | ✓ Yes |
| Inference traces | ✗ No | ✗ No | ✓ Yes |
| Recommended for | Testing | Production | Debugging |

**Size savings (display vs raw):** 71% reduction
**Size increase (verbose vs raw):** 53% larger

---

## Migration Guide

### From old "production" format → "display"

```javascript
// Before
{ format: "production" }

// After
{ format: "display" }
```

### From old "trace" format → "verbose"

```javascript
// Before
{ format: "trace" }

// After
{ format: "verbose" }
```

---

## Error Handling

Invalid format parameter returns helpful error:

```javascript
// Request
{ format: "invalid" }

// Response (400 Bad Request)
{
  "error": "Invalid format parameter",
  "validValues": ["raw", "display", "verbose"],
  "descriptions": {
    "raw": "Complete renderer output with all data (default)",
    "display": "UI-ready format, simplified for frontend",
    "verbose": "Full debugging format with inference traces"
  }
}
```

---

## Samples

See `_dataset/format-samples/` for example outputs:
- `oolong-raw.json` — Complete renderer output
- `oolong-display.json` — UI-ready format
- `oolong-verbose.json` — Full debugging format

---

## API Version

**Version:** 2.0
**Pipeline:** inferrer-renderer
**Default format:** raw
