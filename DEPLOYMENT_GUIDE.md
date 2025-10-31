# Tea Analysis API - Deployment & Development Guide

## Overview

This is a serverless Tea Analysis API built with **Netlify Functions** and **ES Modules**. The architecture uses single-pass calculation orchestration for optimal performance.

- **No traditional server** - runs entirely on Netlify Functions
- **Local development** - `netlify dev` for testing before deployment
- **Auto-scaling** - handled automatically by Netlify
- **Zero cold start overhead** - functions are optimized

## Project Structure

```
propertea/
├── backend/
│   └── src/
│       ├── models/                    # Core data structures
│       │   ├── TeaModel.js
│       │   ├── validators.js
│       │   └── TeaCalculationOrchestrator.js
│       ├── services/                  # Business logic
│       │   ├── CompoundService.js
│       │   ├── FlavorService.js
│       │   ├── TeaTypeService.js
│       │   ├── ProcessingService.js
│       │   ├── GeographyService.js
│       │   ├── RecommendationService.js
│       │   └── index.js
│       └── utils/
│           └── normalization.js       # Data format handling
├── netlify/
│   └── functions/                     # Netlify Functions (serverless)
│       ├── lib/
│       │   └── orchestrator.js        # Shared utilities
│       ├── analyze.js                 # POST /api/analyze
│       ├── analyze-compounds.js
│       ├── analyze-flavor.js
│       ├── analyze-tea-type.js
│       ├── analyze-processing.js
│       ├── analyze-geography.js
│       ├── health.js
│       └── api-info.js
├── netlify.toml                       # Netlify configuration
├── package.json                       # Dependencies and scripts
└── DEPLOYMENT_GUIDE.md               # This file
```

## Prerequisites

- **Node.js** 18+ (download from https://nodejs.org/)
- **npm** (comes with Node.js)
- **Netlify account** (sign up at https://netlify.com if deploying to production)
- **Git** (for version control)

## Local Development Setup

### 1. Install Dependencies

```bash
npm install
```

This installs:
- `netlify-cli` - Local development server

### 2. Start Local Development Server

```bash
npm run dev
```

This starts `netlify dev` on `http://localhost:8888`

Output:
```
◈ Netlify Dev ◈
◈ Loaded function analyze
◈ Loaded function analyze-compounds
...
◈ Server is listening on http://localhost:8888
```

### 3. Test Endpoints Locally

Once `netlify dev` is running, you can test endpoints:

#### Health Check
```bash
curl http://localhost:8888/.netlify/functions/health
```

#### API Info
```bash
curl http://localhost:8888/.netlify/functions/api-info
```

#### Complete Analysis
```bash
curl -X POST http://localhost:8888/.netlify/functions/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dragon Well",
    "type": "green",
    "flavor": {"primary": ["grassy", "sweet"]},
    "compounds": {"caffeineLevel": 4, "lTheanineLevel": 6},
    "processing": {"methods": ["pan-fired"], "oxidationLevel": 8},
    "geography": {
      "country": "China",
      "province": "Zhejiang",
      "altitude": 300,
      "humidity": 75,
      "temperature": 18
    }
  }'
```

### Alternative: Run the Express server locally

If you prefer to exercise the Express application (useful when targeting a VPS or traditional hosting provider), start it with:

```bash
npm run serve:express
```

This boots the API on `http://localhost:3000` by default. Update `HOST` or `PORT` environment variables to change the bind address.

#### Response modes

The analysis endpoint supports two modes:

- **Standard (default):** returns concise data suitable for UI consumption.
- **Explain:** include reasoning traces and matcher debug info by adding `?mode=explain` to the request URL or passing `{ "options": { "explain": true } }` inside the JSON body.

Example:

```bash
curl -X POST "http://localhost:3000/api/analyze?mode=explain" \
  -H "Content-Type: application/json" \
  -d '{ "name": "Long Jing", "type": "green" }'
```

or

```json
{
  "name": "Long Jing",
  "type": "green",
  "options": { "explain": true }
}
```

## API Endpoints

All endpoints are accessible both locally and on Netlify:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/.netlify/functions/health` | Health check |
| GET | `/.netlify/functions/api-info` | API documentation |
| POST | `/.netlify/functions/analyze` | Complete tea analysis |
| POST | `/.netlify/functions/analyze-compounds` | Compounds analysis only |
| POST | `/.netlify/functions/analyze-flavor` | Flavor analysis only |
| POST | `/.netlify/functions/analyze-tea-type` | Tea type analysis only |
| POST | `/.netlify/functions/analyze-processing` | Processing analysis only |
| POST | `/.netlify/functions/analyze-geography` | Geography analysis only |

> **Note:** When running the Express server, these endpoints are available under `/api/...` by default (see the section below for details).

## Input Format

All POST endpoints accept JSON with tea data:

### Minimal Request
```json
{
  "name": "Sencha",
  "type": "green"
}
```

### Complete Request
```json
{
  "name": "Dragon Well",
  "type": "green",
  "subType": "zhu ye qing",
  "flavor": {
    "primary": ["grassy", "sweet", "chestnut"]
  },
  "compounds": {
    "caffeineLevel": 4,
    "lTheanineLevel": 6
  },
  "processing": {
    "methods": ["pan-fired"],
    "oxidationLevel": 8
  },
  "geography": {
    "country": "China",
    "province": "Zhejiang",
    "location": "Hangzhou",
    "altitude": 300,
    "humidity": 75,
    "temperature": 18,
    "latitude": 30.2,
    "longitude": 120.1,
    "harvestMonth": 3
  }
}
```

## Self-Hosted Deployment (OVH / VPS)

Some hosting platforms (e.g., OVH shared hosting, bare VPS) expect you to run a traditional Node process instead of serverless functions. Use the new Express entry point provided in `backend/server.js`.

1. **Install dependencies** on the target machine:
   ```bash
   npm ci --omit=dev
   ```
2. **Start the server**:
   ```bash
   HOST=0.0.0.0 PORT=8080 npm run serve:express
   ```
   Adjust `HOST`/`PORT` as required by your provider. You can wrap this command with a process manager like `pm2` or `forever` for resiliency.

3. **Expose the API** via reverse proxy (NGINX/Apache) so that `/api/*` routes point to the Node process.

4. **Configure the admin UI** to target the correct base URL. You can either set a global override before loading `app.js`:
   ```html
   <script>
     window.__PROPERTEA_API_BASE__ = '/api';
   </script>
   ```
   or add a data attribute on the `<html>` tag:
   ```html
   <html lang="en" data-api-base="/api">
   ```
   The updated `APIService` will automatically pick up either override and call `/api/analyze`.

With these steps the same codebase can be deployed on Netlify (serverless) or any Node-ready hosting provider.

## Output Format

Complete analysis response:

```json
{
  "success": true,
  "data": {
    "teaType": {
      "identified": {
        "type": "green",
        "subType": "zhu ye qing",
        "source": "Explicit type",
        "confidence": "High"
      },
      "description": "Green teas are minimally processed...",
      "characteristics": {...}
    },
    "compounds": {
      "levels": {
        "caffeineLevel": 4,
        "lTheanineLevel": 6,
        "lTheanineToCaffeineRatio": 1.5
      },
      "analysis": {...}
    },
    "flavor": {
      "profile": {
        "identified": ["grassy", "sweet", "chestnut"],
        "dominant": ["grassy", "sweet"],
        "categories": ["Vegetal", "Sweet"],
        "intensity": "Moderate"
      }
    },
    "processing": {
      "methods": ["pan-fired"],
      "roastLevel": "Light",
      "characteristics": {...}
    },
    "geography": {
      "location": {...},
      "climate": {...},
      "characteristics": {...}
    },
    "timing": {
      "bestTimes": ["Morning", "Afternoon"],
      "worstTimes": [],
      "explanation": "..."
    },
    "seasonal": {
      "bestSeasons": ["Spring", "Summer"],
      "explanation": "..."
    },
    "food": {
      "foods": ["Light Desserts", "Pastries"],
      "occasions": ["Breakfast", "Afternoon tea"],
      "explanation": "..."
    },
    "activities": {
      "activities": ["Focused work", "Study"],
      "explanation": "..."
    },
    "brewing": {
      "general": {
        "waterTemperature": "70-80°C",
        "steepTime": "2-3 minutes",
        "leafToWaterRatio": "1:50"
      },
      "gongfu": {...},
      "western": {...}
    },
    "calculatedAt": "2024-10-31T12:00:00.000Z"
  }
}
```

## Deploying to Netlify

### Option 1: Deploy via Netlify CLI (Recommended for Testing)

```bash
# Login to Netlify
netlify login

# Deploy to preview URL
netlify deploy

# Deploy to production
npm run deploy
```

### Option 2: Deploy via GitHub (Best Practice)

1. **Push code to GitHub:**
   ```bash
   git add .
   git commit -m "Set up Netlify Functions for tea analysis API"
   git push origin main
   ```

2. **Connect on Netlify:**
   - Go to https://app.netlify.com
   - Click "New site from Git"
   - Select your GitHub repository
   - Configure build settings:
     - **Build command**: Leave empty (no build needed)
     - **Publish directory**: `netlify/functions`
     - **Functions directory**: `netlify/functions`
   - Click "Deploy"

3. **Your site is live!**
   - Netlify generates a URL like `https://your-site-name.netlify.app`
   - Access API at `https://your-site-name.netlify.app/.netlify/functions/health`

### Option 3: Deploy to Custom Domain

After deploying to Netlify:

1. Go to site settings in Netlify dashboard
2. Click "Domain settings"
3. Add your custom domain
4. Update DNS records (Netlify provides instructions)

## Environment Variables

Create a `.env.local` file for local development (not committed to git):

```
# .env.local (local development only)
NETLIFY_DEV=true
```

For production environment variables in Netlify:

1. Go to Netlify dashboard → Site settings → Build & deploy → Environment
2. Add variables like `API_KEY`, etc. if needed

## Performance Characteristics

The API is optimized with:

- **Single-pass calculations**: Core calculations run once, result passed to all matchers (~5-6x faster)
- **Parallel processing**: Services run in parallel where possible
- **Stateless functions**: No database dependencies, instant scaling
- **Caching**: Orchestrator instance is cached across function invocations during warm starts

Expected response times:
- Health check: < 10ms
- Simple analysis: 50-200ms
- Complete analysis: 100-500ms

## Troubleshooting

### `netlify dev` won't start
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Import errors in functions
- Ensure all files use `.js` extensions (required for ES modules)
- Check file paths are relative and correct
- Functions must be in `netlify/functions/` directory

### CORS errors
- The `netlify.toml` already configures CORS headers
- If issues persist, check that `Access-Control-Allow-Origin: *` is being sent

### Function timeout errors
- Increase timeout in `netlify.toml` if needed:
  ```toml
  [functions]
  timeout = 30
  ```

## Testing Workflow

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Keep terminal open** (shows logs and hot-reload)

3. **Test in another terminal or Postman:**
   ```bash
   curl -X POST http://localhost:8888/.netlify/functions/analyze \
     -H "Content-Type: application/json" \
     -d '{"name": "Test", "type": "green"}'
   ```

4. **Make code changes** - functions auto-reload

5. **Check logs** - appear in dev server terminal

## Next Steps

1. **Integrate with admin panel** - Update admin UI to POST to `/api/analyze`
2. **Add authentication** - If needed, add API key validation in functions
3. **Add database** - If persistence needed, integrate MongoDB/PostgreSQL via serverless connectors
4. **Monitor performance** - Use Netlify Analytics to track function execution times

## File Reference

- **Service Logic**: `/home/msieur-gab/propertea/backend/src/services/`
- **Data Models**: `/home/msieur-gab/propertea/backend/src/models/`
- **Functions**: `/home/msieur-gab/propertea/netlify/functions/`
- **Configuration**: `/home/msieur-gab/propertea/netlify.toml`

## Support

- **Netlify Docs**: https://docs.netlify.com/functions/overview/
- **Netlify CLI**: https://cli.netlify.com/
- **Function Development**: https://docs.netlify.com/functions/overview/

---

**Status**: Ready for local testing and production deployment ✓
