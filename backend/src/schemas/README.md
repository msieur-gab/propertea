# JSON Schema Definitions

This directory contains JSON Schema definitions for input validation, output validation, and API communication in the PropertyTea recommendation engine.

## Schemas

### Input Schemas

#### `TeaModel.schema.json`
Complete schema for tea model input validation. Used when clients submit tea information for analysis.

**Key Fields:**
- `name` (required): Tea name
- `type` (required): One of `green`, `white`, `oolong`, `black`, `puerh`, `dark`, `herbal`
- `subType` (optional): Subclassification (e.g., 'sheng', 'shou' for puerh)
- `caffeineLevel` (optional): 0-10 scale
- `lTheanineLevel` (optional): 0-10 scale
- `flavor` (optional): Primary/secondary flavor notes with intensity
- `geography` (optional): Origin data (altitude, temperature, humidity, solar radiation)
- `processing` (optional): Methods, oxidation level, roast level, fermentation days
- `harvest` (optional): Season, date, flush info
- `storage` (optional): Age, storage conditions

**Data Completeness Impact:**
- Complete tea (all fields): ~90% completeness
- Minimal tea (name + type): ~38% completeness
- Impacts recommendation confidence directly

### Output Schemas

#### `ConfidenceMetrics.schema.json`
Standard confidence metadata structure. All recommendation results include confidence metrics.

**Fields:**
- `overall` (required): Overall confidence percentage (0-100)
- `data`: Data completeness confidence (0-100)
- `agreement`: Factor agreement confidence (0-100)
- `label`: Human-readable level (`Very High`, `High`, `Moderate`, `Low`, `Very Low`)

#### `RecommendationResult.schema.json`
Comprehensive schema covering all recommendation types:
- **Effect Result**: Effect analysis with dominant/supporting effects
- **Time Result**: Hourly recommendations with time ranges
- **Season Result**: Seasonal recommendations
- **Food Result**: Food pairing recommendations with meal clusters
- **Activity Result**: Activity recommendations with theme clusters

All results include:
- Individual scores with confidence metrics
- Confidence ranges (low-high)
- Human-readable confidence labels
- Supporting data breakdowns

### API Schemas

#### `APIResponse.schema.json`
Standard wrapper for all API responses.

**Structure:**
```json
{
  "success": boolean,
  "data": {...},
  "metadata": {
    "requestId": string,
    "timestamp": ISO 8601,
    "version": string,
    "processingTimeMs": number
  },
  "error": {...},  // Only if success: false
  "warnings": [...]
}
```

#### `ValidationError.schema.json`
Detailed validation error reporting with field-level information.

**Fields:**
- `isValid`: Validation pass/fail
- `errors`: Array of validation errors with codes (REQUIRED, TYPE_MISMATCH, RANGE_VIOLATION, etc.)
- `warnings`: Non-critical warnings (MISSING_OPTIONAL, DATA_QUALITY_LOW, etc.)
- `summary`: Data completeness %, estimated confidence, error counts

## Validation Utility

Use `SchemaValidator.js` for validation:

```javascript
import SchemaValidator from './SchemaValidator.js';

// Validate tea model
const result = SchemaValidator.validateTeaModel(teaData);
if (result.isValid) {
  console.log('Valid tea data');
} else {
  console.log('Errors:', result.errors);
}

// Generate readable report
const report = SchemaValidator.generateValidationReport(result);
console.log(report);

// Check data completeness
const completeness = SchemaValidator.calculateDataCompleteness(teaData);
console.log(`Data completeness: ${completeness}%`);
```

## Validation Results

### Complete Tea Model
- ✅ Passes validation
- ~90% data completeness
- ~80% estimated recommendation confidence

### Minimal Valid Tea Model
- ✅ Passes validation (only requires name + type)
- ~38% data completeness
- ~20% estimated recommendation confidence
- Generates 8 warnings for missing optional fields

### Invalid Tea Model
Example validation errors:
- `[ENUM_VIOLATION]` - type value not in allowed list
- `[RANGE_VIOLATION]` - numeric field outside min/max bounds
- `[TYPE_MISMATCH]` - field type doesn't match schema
- `[REQUIRED]` - missing required field

## Error Codes

### Validation Error Codes
- `REQUIRED` - Required field is missing
- `TYPE_MISMATCH` - Field type doesn't match schema
- `RANGE_VIOLATION` - Numeric value outside min/max bounds
- `ENUM_VIOLATION` - Value not in allowed enum list
- `FORMAT_INVALID` - Invalid format (e.g., bad date)
- `PATTERN_MISMATCH` - Value doesn't match regex pattern

### Warning Codes
- `MISSING_OPTIONAL` - Optional field not provided
- `DATA_QUALITY_LOW` - Field incomplete or low quality
- `DEPRECATED_FIELD` - Field is deprecated
- `UNUSUAL_VALUE` - Value is unusual but valid

## Usage in API Endpoints

Schemas should be used in middleware for:

1. **Input Validation** - Validate request body against `TeaModel.schema.json`
2. **Output Validation** - Ensure responses match appropriate recommendation schema
3. **Error Responses** - Wrap errors in `APIResponse.schema.json` with error details
4. **Data Quality Assessment** - Use completeness % and warnings to guide user

## Future Extensions

Schemas can be extended for:
- Extended tea dataset with more detailed attributes
- User preference profiles
- Historical recommendation data
- Analytics data structures

Current design supports extension without breaking existing APIs.
