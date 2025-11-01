# PropertyTea API Documentation

Complete API reference for the PropertyTea tea recommendation engine.

**Version:** 2.0.0
**Base URL:** `/api`
**Status:** Phase 2 - JSON Schema Validation + Extended Dataset

---

## Quick Start

### 1. Basic Recommendation Request

```bash
curl -X POST http://localhost:3000/api/analysis/comprehensive \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sencha Green Tea",
    "type": "green",
    "caffeineLevel": 7,
    "lTheanineLevel": 4,
    "flavor": {
      "primary": ["vegetal", "grassy", "fresh"]
    },
    "geography": {
      "country": "Japan",
      "altitude": 600,
      "temperature": 15,
      "humidity": 70
    },
    "processing": {
      "methods": ["steaming"],
      "oxidationLevel": 5
    }
  }'
```

### 2. Response Format

```json
{
  "success": true,
  "data": {
    "effects": {...},
    "timing": {...},
    "seasons": {...},
    "food": {...},
    "activities": {...},
    "summary": {...}
  },
  "metadata": {
    "timestamp": "2025-11-01T12:00:00.000Z",
    "processingTimeMs": 145,
    "dataQuality": {
      "completeness": 80,
      "estimatedConfidence": 75
    }
  },
  "warnings": [...]
}
```

---

## Data Completeness & Confidence

Every recommendation response includes **data quality metrics** that indicate reliability:

### Completeness Ranges

- **Excellent (80-100%)**: Full analysis with high confidence
- **Good (60-79%)**: Solid analysis with moderate-high confidence
- **Fair (40-59%)**: Basic analysis with some uncertainty
- **Limited (<40%)**: Minimal data, results may be generic

### Confidence Levels

- **Very High (85-100%)**: Highly reliable recommendations
- **High (70-84%)**: Reliable recommendations
- **Moderate (55-69%)**: Reasonably reliable
- **Low (40-54%)**: Use with caution
- **Very Low (<40%)**: Consider providing more data

### Example: Data Quality Response

```json
{
  "metadata": {
    "dataQuality": {
      "completeness": 80,
      "estimatedConfidence": 75
    }
  },
  "warnings": [
    {
      "code": "MISSING_OPTIONAL",
      "message": "Optional field 'storage' is missing - this may reduce recommendation accuracy",
      "field": "storage"
    }
  ]
}
```

---

## Tea Model Schema

### Required Fields

```json
{
  "name": "string (1-255 chars)",
  "type": "green|white|oolong|black|puerh|dark|herbal"
}
```

### Complete Tea Model

```json
{
  "id": "tea-green-sencha-001",
  "name": "Sencha Green Tea",
  "type": "green",
  "subType": "null or string",

  "caffeineLevel": 0-10,
  "lTheanineLevel": 0-10,

  "flavor": {
    "primary": ["vegetal", "grassy", "fresh"],
    "secondary": ["slightly sweet", "oceanic"],
    "intensity": "subtle|moderate|pronounced|intense"
  },

  "geography": {
    "country": "Japan",
    "province": "Shizuoka",
    "location": "Mountain name",
    "altitude": 0-5000,
    "latitude": -90 to 90,
    "longitude": -180 to 180,
    "temperature": -50 to 50,
    "humidity": 0-100,
    "solarRadiation": 0+
  },

  "processing": {
    "methods": ["steaming", "roasting", "oxidation"],
    "oxidationLevel": 0-100,
    "roastLevel": "none|light|medium|heavy|charcoal",
    "fermentationDays": 0+,
    "dryingMethod": "sun-dried|shade-dried|pan-fired|oven-dried"
  },

  "harvest": {
    "season": "spring|summer|autumn|winter",
    "harvestDate": "2025-04-15",
    "flush": "first-flush|second-flush|third-flush|autumn-flush"
  },

  "storage": {
    "ageInYears": 0+,
    "storageCondition": "dry|humid|cool-dry|natural"
  },

  "source": {
    "producer": "Estate name",
    "vendor": "Vendor name",
    "importDate": "2025-01-01"
  },

  "tags": ["morning", "focus", "energizing"],
  "bestPairedFood": ["seafood", "salads"],
  "optimalTemperature": 70,
  "steepTime": 60,
  "steepCount": 3,
  "preparation": "steeped|whisked|decocted",

  "notes": "Additional notes"
}
```

---

## Endpoints

### GET /api/health

Health check endpoint.

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "operational",
    "timestamp": "2025-11-01T12:00:00.000Z",
    "version": "2.0.0"
  }
}
```

---

### GET /api/docs

API documentation endpoint.

**Response:**
```json
{
  "success": true,
  "data": {
    "version": "2.0.0",
    "endpoints": [...],
    "inputSchema": {...},
    "responseStructure": {...},
    "confidenceMetrics": {...}
  }
}
```

---

### POST /api/analysis/effects

Analyze dominant and supporting effects.

**Request:**
```json
{
  "name": "Sencha Green Tea",
  "type": "green",
  "caffeineLevel": 7,
  "lTheanineLevel": 4
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "description": {
      "summary": "Alert & Sharp",
      "detailed": "...",
      "dominant": {
        "effect": "energizing",
        "description": "Promotes alertness and mental clarity",
        "score": 85,
        "confidence": 82
      },
      "supporting": {
        "effect": "focusing",
        "description": "Enhances concentration and focus",
        "score": 78,
        "confidence": 80
      }
    },
    "expectedEffects": {
      "dominant": "energizing",
      "supporting": "focusing"
    },
    "allScores": {
      "energizing": { "score": 85, "confidence": 82, "range": {...} },
      "calming": { "score": 20, "confidence": 75, "range": {...} },
      ...
    },
    "confidence": {
      "overall": 80,
      "dataGaps": {...},
      "note": null
    }
  },
  "metadata": {
    "dataQuality": {
      "completeness": 60,
      "estimatedConfidence": 70
    }
  }
}
```

---

### POST /api/analysis/comprehensive

Complete analysis with all recommendation types.

**Request:** (Same as effects endpoint)

**Response:**
```json
{
  "success": true,
  "data": {
    "effects": {...},
    "timing": {
      "recommendedTimes": [
        { "hour": 9, "score": 90, "confidence": 90 }
      ],
      "idealRanges": [
        { "start": 8, "end": 13, "score": 86, "confidence": 86 }
      ]
    },
    "seasons": {
      "recommendedSeasons": [
        { "season": "Spring", "score": 90, "confidence": 88 }
      ]
    },
    "food": {
      "recommendedFoods": [
        {
          "name": "Salads",
          "score": 100,
          "confidence": 100,
          "confidenceLabel": "Very High",
          "range": { "low": 100, "high": 100 }
        }
      ],
      "mealClusters": [
        {
          "occasion": "Light Lunch",
          "foods": [...],
          "score": 100,
          "confidence": 100
        }
      ]
    },
    "activities": {
      "recommendedActivities": [
        {
          "name": "High-Focus Work",
          "score": 100,
          "confidence": 100,
          "confidenceLabel": "Very High"
        }
      ],
      "activityClusters": [...]
    },
    "summary": {
      "teaName": "Sencha Green Tea",
      "teaType": "green",
      "analysisQuality": {
        "dataCompleteness": 60,
        "estimatedConfidence": 70,
        "warningsCount": 2
      },
      "recommendationSummary": {
        "dominantEffect": "energizing",
        "optimalTime": 10,
        "optimalSeason": "Spring",
        "topFood": "Salads",
        "topActivity": "High-Focus Work"
      }
    }
  }
}
```

---

### POST /api/analysis/validate

Validate tea data without running full analysis.

**Request:** (Same as effects endpoint)

**Response:**
```json
{
  "success": true,
  "data": {
    "isValid": true,
    "errors": [],
    "warnings": [
      {
        "code": "MISSING_OPTIONAL",
        "message": "Optional field 'storage' is missing",
        "field": "storage"
      }
    ],
    "dataQuality": {
      "completeness": 60,
      "estimatedConfidence": 70,
      "interpretation": "Good - Solid analysis with moderate confidence"
    }
  }
}
```

---

## Error Responses

### Validation Error (400)

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed: 2 error(s)",
    "details": {
      "errors": [
        {
          "field": "type",
          "value": "invalid_type",
          "message": "Field '/type' must be one of: green, white, oolong, black, puerh, dark, herbal",
          "code": "ENUM_VIOLATION",
          "constraint": { "enum": [...] }
        }
      ],
      "totalErrors": 2,
      "totalWarnings": 1,
      "dataCompleteness": 50,
      "estimatedConfidence": 40
    }
  },
  "metadata": {
    "timestamp": "2025-11-01T12:00:00.000Z"
  }
}
```

### Not Found (404)

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Endpoint not found: POST /api/invalid"
  },
  "metadata": {
    "timestamp": "2025-11-01T12:00:00.000Z"
  }
}
```

### Server Error (500)

```json
{
  "success": false,
  "error": {
    "code": "ANALYSIS_ERROR",
    "message": "Failed to analyze tea effects",
    "details": {
      "originalError": "error message"
    }
  },
  "metadata": {
    "timestamp": "2025-11-01T12:00:00.000Z"
  }
}
```

---

## Example Requests

### Minimal Request (38% data completeness)

```json
{
  "name": "Unknown Tea",
  "type": "oolong"
}
```

**Expected Response:**
- ✅ Passes validation
- ⚠️ 38% data completeness
- 📊 20% estimated confidence
- 🎯 Generic recommendations

---

### Complete Request (80%+ data completeness)

```json
{
  "name": "Sencha Green Tea",
  "type": "green",
  "caffeineLevel": 7,
  "lTheanineLevel": 4,
  "flavor": {
    "primary": ["vegetal", "grassy", "fresh"],
    "secondary": ["slightly sweet"],
    "intensity": "moderate"
  },
  "geography": {
    "country": "Japan",
    "province": "Shizuoka",
    "altitude": 600,
    "temperature": 15,
    "humidity": 70,
    "solarRadiation": 150
  },
  "processing": {
    "methods": ["steaming"],
    "oxidationLevel": 5,
    "roastLevel": "none",
    "dryingMethod": "sun-dried"
  },
  "harvest": {
    "season": "spring",
    "flush": "first-flush"
  }
}
```

**Expected Response:**
- ✅ Passes validation
- 📊 80-90% data completeness
- 🎯 75-85% estimated confidence
- 🏆 High-quality recommendations

---

## Validation Error Codes

| Code | Meaning | Example |
|------|---------|---------|
| `REQUIRED` | Required field missing | `name` is required |
| `TYPE_MISMATCH` | Wrong data type | `caffeineLevel` must be number |
| `RANGE_VIOLATION` | Value outside bounds | `caffeineLevel` must be 0-10 |
| `ENUM_VIOLATION` | Value not in allowed list | `type` must be one of: green, white... |
| `FORMAT_INVALID` | Invalid format | Date format invalid |
| `PATTERN_MISMATCH` | Doesn't match pattern | Invalid regex pattern |

---

## Warning Codes

| Code | Meaning |
|------|---------|
| `MISSING_OPTIONAL` | Optional field not provided |
| `DATA_QUALITY_LOW` | Field incomplete or low quality |
| `DEPRECATED_FIELD` | Field is deprecated |
| `UNUSUAL_VALUE` | Value is unusual but valid |

---

## Extended Tea Dataset

The API includes a database of 10 carefully curated teas:

### Available Teas

**Green Teas:**
- Sencha Green Tea (Japan)
- Ceremonial Grade Matcha (Japan)

**White Teas:**
- Silver Needle White Tea (China)

**Oolong Teas:**
- Tie Guan Yin (Iron Goddess) (China)
- Da Hong Pao (Big Red Robe) (China)

**Black Teas:**
- Keemun Black Tea (China)

**Puerh Teas:**
- Puerh Sheng (Raw) - 5 Years (China)
- Puerh Shou (Ripe) - 15 Years (China)

**Dark Teas:**
- Liu Bao Dark Tea (China)

**Herbal:**
- Chamomile Flowers (Egypt)

### Dataset Features

- **100% Schema Valid**: All teas pass JSON schema validation
- **80-100% Completeness**: Rich attribute coverage
- **26 Unique Tags**: For easy categorization
- **Full Geographic Data**: Origin, altitude, climate
- **Complete Processing Info**: Methods, oxidation, fermentation
- **Recommendation-Ready**: All teas fully detailed

---

## Best Practices

### 1. Provide Maximum Information

```javascript
// ✅ Good: Full data
{
  "name": "Tea",
  "type": "green",
  "caffeineLevel": 7,
  "lTheanineLevel": 4,
  "flavor": { "primary": ["vegetal"], "intensity": "moderate" },
  "geography": { "country": "Japan", "altitude": 600, "temperature": 15 }
}

// ❌ Avoid: Minimal data
{
  "name": "Tea",
  "type": "green"
}
```

### 2. Handle Validation Warnings

```javascript
if (response.warnings?.length > 0) {
  console.warn('Data quality warnings:', response.warnings);
  console.log('Completeness:', response.metadata.dataQuality.completeness);
}
```

### 3. Check Confidence Levels

```javascript
const confidence = response.metadata.dataQuality.estimatedConfidence;
if (confidence < 50) {
  console.warn('Low confidence - recommend providing more data');
}
```

### 4. Progressive Enhancement

```javascript
// Start with minimal data
const basicRequest = { name: "Tea", type: "green" };

// If confidence too low, ask user for more data:
// - Caffeine/L-theanine levels
// - Flavor profile
// - Geographic origin
// - Processing method
```

---

## Integration Examples

### Node.js / Express

```javascript
import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 5000
});

async function analyzeTea(teaData) {
  try {
    const response = await client.post('/analysis/comprehensive', teaData);

    if (response.data.success) {
      const effects = response.data.data.effects.expectedEffects;
      const confidence = response.data.metadata.dataQuality.estimatedConfidence;

      console.log(`${teaData.name} is ${effects.dominant} (${confidence}% confident)`);
      return response.data;
    } else {
      console.error('Validation failed:', response.data.error);
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
}
```

### Python

```python
import requests

API_URL = 'http://localhost:3000/api'

def analyze_tea(tea_data):
    response = requests.post(
        f'{API_URL}/analysis/comprehensive',
        json=tea_data,
        timeout=5
    )

    if response.status_code == 200:
        data = response.json()
        if data['success']:
            effects = data['data']['effects']['expectedEffects']
            confidence = data['metadata']['dataQuality']['estimatedConfidence']
            print(f"{tea_data['name']} is {effects['dominant']} ({confidence}% confident)")
        else:
            print('Validation error:', data['error'])
    else:
        print(f'Request failed: {response.status_code}')
```

---

## Performance Notes

- **Average Response Time**: 100-200ms for comprehensive analysis
- **Bottleneck**: Data completeness calculation (10-50ms)
- **Caching**: Consider caching by tea name for repeated queries
- **Batch Processing**: Not recommended - process individually

---

## Roadmap

- **Phase 3**: API parameter audit and extended dataset enhancements
- **Phase 4**: Performance optimization and caching
- **Future**: Learning/feedback loop infrastructure (when ready)

---

**Last Updated:** November 2025
**Contact:** tea-api@propertea.local
