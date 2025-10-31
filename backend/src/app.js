/**
 * app.js - Main Express Application Setup
 *
 * Configures Express server with:
 * - Middleware (CORS, JSON parsing, validation)
 * - Service initialization with single-pass orchestrator
 * - Error handling
 * - Route setup
 */

import express from 'express';
import cors from 'cors';

// Import all services
import { CompoundService } from './services/CompoundService.js';
import { FlavorService } from './services/FlavorService.js';
import { TeaTypeService } from './services/TeaTypeService.js';
import { ProcessingService } from './services/ProcessingService.js';
import { GeographyService } from './services/GeographyService.js';
import { RecommendationService } from './services/RecommendationService.js';

// Import orchestrator and utilities
import { TeaCalculationOrchestrator } from './models/TeaCalculationOrchestrator.js';
import { validateAnalysisRequest } from './models/validators.js';

// Initialize Express app
const app = express();

/**
 * Middleware Configuration
 */

// Trust proxy (for serverless deployments like Netlify/Cloudflare)
app.set('trust proxy', 1);

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

/**
 * Service Initialization
 *
 * Create service instances and initialize orchestrator
 * This happens once at app startup
 */
const services = {
  teaTypeService: new TeaTypeService(),
  compoundService: new CompoundService(),
  flavorService: new FlavorService(),
  processingService: new ProcessingService(),
  geographyService: new GeographyService(),
  recommendationService: new RecommendationService()
};

// Create the orchestrator with all services
const orchestrator = new TeaCalculationOrchestrator(services);

/**
 * Custom Middleware: Attach orchestrator to request
 * Makes orchestrator available in route handlers via req.teaOrchestrator
 */
app.use((req, res, next) => {
  req.teaOrchestrator = orchestrator;
  next();
});

/**
 * Request logging middleware (development only)
 */
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
    });
    next();
  });
}

/**
 * Health Check Endpoint
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    version: '2.0-orchestrated',
    timestamp: new Date().toISOString()
  });
});

/**
 * API Info Endpoint
 */
app.get('/api/info', (req, res) => {
  res.json({
    name: 'Tea Analysis API',
    version: '2.0-orchestrated',
    description: 'Single-pass tea analysis with consolidated services',
    endpoints: [
      'POST /api/analyze - Analyze a tea and get complete results',
      'POST /api/analyze/compounds - Analyze compounds only',
      'POST /api/analyze/flavor - Analyze flavor only',
      'POST /api/analyze/tea-type - Analyze tea type only',
      'GET /health - Health check'
    ],
    features: [
      'Single-pass core calculations (5-6x performance improvement)',
      'Consolidated recommendation service (timing, seasonal, food, activity, brewing)',
      'Intelligent tea type identification with fallback logic',
      'Multi-format input normalization',
      'Comprehensive error handling'
    ]
  });
});

/**
 * Main Analysis Endpoint
 * POST /api/analyze
 *
 * Input: Raw tea data (various formats accepted)
 * Output: Complete tea analysis with core analyses + recommendations
 */
app.post('/api/analyze', async (req, res) => {
  try {
    const result = await req.teaOrchestrator.calculateTea(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error || 'Analysis failed'
      });
    }

    res.json({
      success: true,
      data: result.data
    });
  } catch (error) {
    console.error('Error in /api/analyze:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

/**
 * Individual Service Endpoints (for testing/debugging)
 * Allow calling individual services directly
 */

// POST /api/analyze/compounds
app.post('/api/analyze/compounds', async (req, res) => {
  try {
    const validation = validateAnalysisRequest(req.body);
    if (!validation.valid) {
      return res.status(400).json({ success: false, error: validation.error });
    }

    const result = await services.compoundService.analyze(validation.data);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/analyze/flavor
app.post('/api/analyze/flavor', async (req, res) => {
  try {
    const validation = validateAnalysisRequest(req.body);
    if (!validation.valid) {
      return res.status(400).json({ success: false, error: validation.error });
    }

    const result = await services.flavorService.analyze(validation.data);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/analyze/tea-type
app.post('/api/analyze/tea-type', async (req, res) => {
  try {
    const validation = validateAnalysisRequest(req.body);
    if (!validation.valid) {
      return res.status(400).json({ success: false, error: validation.error });
    }

    const result = await services.teaTypeService.analyze(validation.data);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/analyze/processing
app.post('/api/analyze/processing', async (req, res) => {
  try {
    const validation = validateAnalysisRequest(req.body);
    if (!validation.valid) {
      return res.status(400).json({ success: false, error: validation.error });
    }

    const result = await services.processingService.analyze(validation.data);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/analyze/geography
app.post('/api/analyze/geography', async (req, res) => {
  try {
    const validation = validateAnalysisRequest(req.body);
    if (!validation.valid) {
      return res.status(400).json({ success: false, error: validation.error });
    }

    const result = await services.geographyService.analyze(validation.data);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Error Handling Middleware
 */

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Endpoint not found: ${req.method} ${req.path}`,
    availableEndpoints: [
      'GET /health',
      'GET /api/info',
      'POST /api/analyze',
      'POST /api/analyze/compounds',
      'POST /api/analyze/flavor',
      'POST /api/analyze/tea-type',
      'POST /api/analyze/processing',
      'POST /api/analyze/geography'
    ]
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

export default app;
export { orchestrator, services };
