# Tea Recommendation API v2.0

A serverless tea analysis and recommendation engine that uses an Inferrer/Renderer pipeline to provide personalized recommendations based on tea characteristics.

**Current Branch:** `feature/form-integration-and-transport`

---

## 🎯 Quick Start

### Prerequisites

- **Node.js** 18.x or 20.x
- **npm** (comes with Node.js)
- **Git** (for version control)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd propertea
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Verify Node version**
   ```bash
   node --version  # Should be 18.x or 20.x
   ```

---

## 🚀 Running the Development Server

### Quick Start (Recommended for Testing)

We provide a lightweight development server that serves the test UI and the API:

```bash
node dev-server.js
```

**Output:**
```
🚀 Server running at: http://localhost:3000
📝 Test UI available at: http://localhost:3000
🔌 API endpoint: POST http://localhost:3000/.netlify/functions/tea-recommendation
```

**Then open your browser:** http://localhost:3000

---

## 🛑 Stopping the Server

### Option 1: Keyboard Shortcut (while server is running)
```
Press Ctrl+C
```

### Option 2: Kill by Port (if server is stuck)
```bash
# Find process on port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or kill all Node processes
pkill -f "node dev-server.js"
```

### Option 3: Kill by Name
```bash
pkill node
```

---

## 🧪 Testing the API

### Option 1: Using the Interactive Test UI (Recommended)

1. **Start the dev server**
   ```bash
   node dev-server.js
   ```

2. **Open browser:** http://localhost:3000

3. **Using the UI:**
   - Select a tea from the left panel
   - Choose which renderers to include (Activity, Food, Time, Season, Brewing)
   - Toggle between Production and Trace formats
   - Click "Send Request"
   - View the formatted response

### Option 2: Using cURL (Command Line)

**Production format request:**
```bash
curl -X POST http://localhost:3000/.netlify/functions/tea-recommendation \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ali Shan Oolong",
    "originalName": "阿里山烏龍茶",
    "type": "oolong",
    "subType": "high-mountain-oolong",
    "caffeineLevel": 3.5,
    "lTheanineLevel": 6.5,
    "flavorProfile": ["floral", "buttery", "sweet", "creamy", "honeysuckle"],
    "processingMethods": ["withered", "partial-oxidation", "ball-rolled", "minimal-roast"],
    "geography": {
      "location": "Alishan",
      "province": "Chiayi",
      "country": "Taiwan",
      "latitude": 23.47,
      "longitude": 120.8,
      "altitude": 1500,
      "humidity": 80,
      "temperature": 14.8,
      "solarRadiation": 180
    },
    "format": "production",
    "renderers": ["activity", "food", "time"]
  }' | jq .
```

**Trace format request (with analysis):**
```bash
curl -X POST http://localhost:3000/.netlify/functions/tea-recommendation \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sencha",
    "type": "green",
    "caffeineLevel": 4,
    "lTheanineLevel": 6,
    "flavorProfile": ["grassy", "marine", "vegetal"],
    "processingMethods": ["steamed", "rolled"],
    "geography": {
      "location": "Shizuoka",
      "country": "Japan",
      "latitude": 34.97,
      "longitude": 138.38,
      "altitude": 400,
      "humidity": 72,
      "temperature": 16.2,
      "solarRadiation": 170
    },
    "format": "trace",
    "renderers": ["activity"]
  }' | jq .
```

### Option 3: Automated Test Suite

Run the comprehensive test suite to validate both production and trace modes:

```bash
node netlify/functions/test-comprehensive.js
```

**Output:**
```
✅ Production format tests: 3/3 passed
✅ Trace format tests: 3/3 passed
✅ Selective renderer tests: 3/3 passed
🎉 ALL TESTS PASSED!
```

### Option 4: Basic Transport Layer Test

Run the basic transport layer test with Ali Shan Oolong sample:

```bash
node netlify/functions/test-transport-layer.js
```

---

## 📊 API Specification

### Endpoint

```
POST /.netlify/functions/tea-recommendation
```

### Request Format

```json
{
  "name": "Ali Shan Oolong",
  "originalName": "阿里山烏龍茶",
  "type": "oolong",
  "subType": "high-mountain-oolong",
  "caffeineLevel": 3.5,
  "lTheanineLevel": 6.5,
  "flavorProfile": ["floral", "buttery", "sweet"],
  "processingMethods": ["withered", "partial-oxidation"],
  "geography": {
    "location": "Alishan",
    "province": "Chiayi",
    "country": "Taiwan",
    "latitude": 23.47,
    "longitude": 120.8,
    "altitude": 1500,
    "humidity": 80,
    "temperature": 14.8,
    "solarRadiation": 180
  },
  "format": "production",
  "renderers": ["activity", "food", "time"]
}
```

### Parameters

#### Required Fields
- **name** (string): Tea name
- **type** (string): Tea type (green, black, oolong, white, puerh)

#### Optional Fields
- **originalName** (string): Native language name
- **subType** (string): Tea subtype for more precise classification
- **caffeineLevel** (number 0-10): Caffeine content
- **lTheanineLevel** (number 0-10): L-Theanine content
- **flavorProfile** (array): Flavor characteristics
- **processingMethods** (array): Processing techniques used
- **geography** (object): Origin information
  - location, province, country
  - latitude, longitude
  - altitude, humidity, temperature, solarRadiation

#### Control Parameters
- **format** (string, default: "production")
  - `"production"`: Lean response (tea + recommendations + metadata)
  - `"trace"`: Full response (includes analysis with step-by-step reasoning)

- **renderers** (array, default: all renderers)
  - Available: `["activity", "food", "time", "season", "brewing"]`
  - Only requested renderers will execute

### Response Format

#### Production Response (format: "production")
```json
{
  "tea": {
    "name": "Ali Shan Oolong",
    "originalName": "阿里山烏龍茶",
    "type": "oolong",
    "subType": "high-mountain-oolong"
  },
  "recommendations": {
    "activity": [
      {
        "activity": "Relaxation",
        "score": 75,
        "description": "...",
        "rationale": "...",
        "timing": "...",
        "benefits": []
      }
    ],
    "food": [...],
    "time": [...]
  },
  "metadata": {
    "timestamp": "2025-11-02T09:33:40.258Z",
    "processingTimeMs": 11,
    "version": "2.0",
    "pipeline": "inferrer-renderer",
    "format": "production",
    "renderersRequested": ["activity", "food", "time"]
  }
}
```

#### Trace Response (format: "trace")
Same as production, plus:
```json
{
  "analysis": {
    "compound": {
      "analysis": {...},
      "trace": [
        {
          "step": 1,
          "reason": "Analyzing compound profile",
          "adjustment": "Detected smooth & sustained profile",
          "value": 0.95
        }
      ],
      "confidence": 0.95
    },
    "flavor": {...},
    "teaType": {...},
    "geography": {...},
    "processing": {...}
  }
}
```

### Response Times

- **Typical:** 2-11ms
- **Inferrers:** ~6ms (5 in parallel)
- **Renderers:** ~6ms (requested ones in parallel)
- **Total:** ~12ms average

---

## 📁 Project Structure

```
propertea/
├── README.md                           # This file
├── package.json                        # Dependencies and scripts
├── dev-server.js                       # Development server (local testing)
│
├── endpoint/                           # Core Recommendation Engine
│   ├── README.md                       # API documentation
│   ├── validation-dataset-17-tea.json  # Test data (16 teas)
│   └── src/
│       ├── processors/
│       │   ├── inferrers/              # 5 Analysis engines
│       │   │   ├── CompoundInferrer.js
│       │   │   ├── FlavorInferrer.js
│       │   │   ├── TeaTypeInferrer.js
│       │   │   ├── GeographyInferrer.js
│       │   │   └── ProcessingInferrer.js
│       │   └── renderers/              # 5 Recommendation generators
│       │       ├── ActivityRenderer.js
│       │       ├── FoodRenderer.js
│       │       ├── TimeRenderer.js
│       │       ├── SeasonRenderer.js
│       │       └── BrewingRenderer.js
│       └── taxonomies/                 # Unified taxonomy system
│
├── new admin/                          # Admin Form Interface
│   ├── index.html                      # Main form
│   ├── js/
│   │   ├── app.js                      # Main application
│   │   ├── modules/
│   │   │   ├── recordHandler.js        # Tea record creation
│   │   │   ├── analysisDisplay.js      # Recommendations display
│   │   │   └── ...                     # Other UI modules
│   │   └── services/
│   │       └── apiService.js           # API integration (TO BE IMPLEMENTED)
│   └── css/                            # Styling
│
├── netlify/                            # Serverless Transport Layer
│   ├── functions/
│   │   ├── tea-recommendation.js       # Main API endpoint handler
│   │   ├── test-comprehensive.js       # Full test suite
│   │   └── test-transport-layer.js     # Basic transport test
│   └── test-ui.html                    # Interactive test interface
│
└── _dataset/                           # Reference data
    └── TeaDatabase.js                  # 10 reference teas with complete data
```

---

## 🔄 Data Flow

```
Admin Form (new admin/)
    ↓
Form Data: { name, type, compounds, flavors, geography, ... }
    ↓
API Transport Layer (netlify/functions/tea-recommendation.js)
    ↓
Phase 1: Run 5 Inferrers in parallel (~6ms)
    ├─ CompoundInferrer    → Caffeine/L-Theanine analysis
    ├─ FlavorInferrer      → Flavor profile analysis
    ├─ TeaTypeInferrer     → Tea type classification
    ├─ GeographyInferrer   → Origin analysis
    └─ ProcessingInferrer  → Processing method analysis
    ↓
Phase 2: Run Requested Renderers in parallel (~6ms)
    ├─ ActivityRenderer    → Activity recommendations
    ├─ FoodRenderer        → Food pairing recommendations
    ├─ TimeRenderer        → Time-of-day recommendations
    ├─ SeasonRenderer      → Season recommendations
    └─ BrewingRenderer     → Brewing method recommendations
    ↓
Response: JSON with recommendations + optional analysis traces
    ↓
Display in Admin UI or external application
```

---

## 📚 Key Features

### Dual Output Formats
- **Production:** Lean, optimized for client consumption
- **Trace:** Full reasoning and confidence scores for debugging

### Selective Renderer Execution
- Request only the recommendation types you need
- Reduces processing and response payload

### No External Dependencies
- Pure JavaScript implementation
- Fast serverless deployment
- Minimal cold start time

### Comprehensive Analysis
- 5 different analysis dimensions
- Confidence scoring
- Step-by-step reasoning traces

---

## 🧠 Available Teas for Testing

The test UI includes 8 reference teas:

1. **Gyokuro** - High L-Theanine (calming, luxurious)
2. **Sencha** - Balanced energy
3. **Da Hong Pao** - Balanced, roasted
4. **Ali Shan Oolong** - Floral, high mountain
5. **Assam** - High caffeine, malty
6. **Silver Needle** - Low caffeine, delicate
7. **Aged Ripe Puerh** - Earthy, aged
8. **Ceremonial Matcha** - High caffeine, umami

Each tea includes complete data: caffeine, L-Theanine, flavors, processing methods, and geography.

---

## ⚙️ Configuration

### Environment Variables

Currently, the API doesn't require environment variables for local development. For production deployment to Netlify, configure in `netlify.toml`.

### Response Time Tuning

The API is optimized for speed with parallel execution. If needed, adjust:
- **Renderer threshold** in individual renderer constructors
- **Max recommendations** parameter in renderer configs

---

## 🐛 Troubleshooting

### Server Won't Start

```bash
# Check if port 3000 is already in use
lsof -i :3000

# Kill the existing process
kill -9 <PID>

# Try again
node dev-server.js
```

### API Returns 400 Error

Check request format:
- **Missing 'name' field?** → Error: "Missing required fields"
- **Invalid 'format' parameter?** → Error: "Invalid format parameter (must be 'production' or 'trace')"
- **Empty renderers array?** → Result will have no recommendations

### Slow Response Time

- Response should be 2-11ms typically
- If slower, check CPU load: `top` or `htop`
- Restart the server if needed

### Test UI Not Loading

- Ensure dev server is running: `http://localhost:3000`
- Check browser console for errors (F12)
- Verify no CORS issues: should see `Access-Control-Allow-Origin: *`

---

## 📖 Development Tasks

### Current Phase: Form Integration

**Status:** Ready for development

**Tasks:**
- [ ] Wire admin form to API
- [ ] Display recommendations in UI
- [ ] Handle loading/error states
- [ ] Fix TimeRenderer labels
- [ ] Implement SeasonRenderer
- [ ] Implement BrewingRenderer

### Next Phase: Production Optimization

- [ ] Performance profiling
- [ ] Caching strategy
- [ ] Error handling edge cases
- [ ] Comprehensive testing

---

## 🚢 Deployment

### Deploy to Netlify

1. **Ensure Netlify CLI is installed**
   ```bash
   npm install -g netlify-cli
   ```

2. **Deploy to production**
   ```bash
   npm run deploy
   ```

3. **Preview before deployment**
   ```bash
   netlify deploy --dry-run
   ```

### Environment Setup

Netlify automatically detects:
- **Functions directory:** `netlify/functions`
- **Build command:** (not needed for serverless functions)

---

## 📝 Git Workflow

### Current Branch

```bash
git branch
# Should show: * feature/form-integration-and-transport
```

### Making Changes

1. **Create feature branch** (if needed)
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Commit changes**
   ```bash
   git add .
   git commit -m "feat: Your feature description"
   ```

3. **Push to remote**
   ```bash
   git push origin feature/your-feature-name
   ```

### Commit Message Format

Follow conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `refactor:` Code refactoring
- `test:` Tests

**Never include** "claude" mentions in commit messages.

---

## 📞 Support & Documentation

### Additional Resources

- **Endpoint API Docs:** See `endpoint/README.md`
- **Form UI Docs:** See `new admin/README.md`
- **Branch Summary:** See `BRANCH_SUMMARY.md`
- **Git History:** `git log --oneline | head -20`

### Test Data

- **Validation dataset (16 teas):** `endpoint/validation-dataset-17-tea.json`
- **Test UI database (8 teas):** `netlify/test-ui.html` (embedded)
- **Reference database:** `_dataset/TeaDatabase.js`

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Node version is 18.x or 20.x
- [ ] `npm install` completed without errors
- [ ] `node dev-server.js` starts successfully
- [ ] http://localhost:3000 loads in browser
- [ ] Can select a tea and send request
- [ ] API responds in ~12ms or less
- [ ] `node netlify/functions/test-comprehensive.js` passes all tests

---

## 📈 Project Stats

- **Core Engine:** 5 Inferrers + 5 Renderers
- **Test Coverage:** 9 comprehensive tests (all passing)
- **Response Time:** Average 2-11ms
- **Zero Dependencies:** Pure JavaScript, no npm packages for core logic
- **Available Teas:** 8 for testing + 16 in validation dataset

---

## 📄 License

ISC

---

**Last Updated:** November 2, 2025
**Branch:** feature/form-integration-and-transport
**Version:** 2.0.0

For the latest updates, check git history: `git log`
