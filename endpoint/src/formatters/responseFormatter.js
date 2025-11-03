/**
 * responseFormatter.js
 *
 * Purpose: Transform recommendation pipeline output into different API response formats
 * Supports three output modes: raw, display, verbose
 *
 * Format Modes:
 * - raw: Complete renderer output (default) - includes all data for validation/testing
 * - display: UI-ready format - simplified, no trace data, optimized for frontend consumption
 * - verbose: Debugging format - raw + full inference traces for troubleshooting
 */

/**
 * Format renderer output based on requested mode
 * @param {Object} baseResponse - Base response with tea info, recommendations, metadata
 * @param {Object} allInferences - All inference results from inferrers
 * @param {string} format - Output format: 'raw', 'display', 'verbose'
 * @param {Array} rendererNames - Names of renderers that were run
 * @returns {Object} - Formatted response
 */
export function formatResponse(baseResponse, allInferences, format, rendererNames) {
  switch (format) {
    case 'display':
      return formatDisplay(baseResponse);

    case 'verbose':
      return formatVerbose(baseResponse, allInferences, rendererNames);

    case 'raw':
    default:
      return formatRaw(baseResponse);
  }
}

/**
 * RAW FORMAT (default)
 * Complete renderer output with all analysis, trace, and confidence
 * Use case: Testing, validation, A/B testing, data exports
 */
function formatRaw(baseResponse) {
  // Return complete response as-is
  // This is what we're exporting to _dataset files
  return baseResponse;
}

/**
 * DISPLAY FORMAT
 * UI-ready, simplified format optimized for frontend consumption
 * Use case: Production UI, mobile apps, lightweight clients
 *
 * Transformations:
 * - Remove trace arrays
 * - Remove analysis objects (keep essential metadata)
 * - Remove confidence scores from nested objects
 * - Keep only recommendations and essential display data
 */
function formatDisplay(baseResponse) {
  const { tea, recommendations, metadata } = baseResponse;

  // Transform recommendations for each renderer
  const displayRecommendations = {};

  Object.entries(recommendations).forEach(([rendererName, rendererOutput]) => {
    switch (rendererName) {
      case 'activity':
        displayRecommendations.activity = {
          recommendations: rendererOutput.recommendations.map(rec => ({
            activity: rec.activity,
            score: Math.round(rec.score),
            description: rec.description,
            timing: rec.timing
          })),
          clusters: rendererOutput.clusters
        };
        break;

      case 'time':
        displayRecommendations.time = {
          recommendations: rendererOutput.recommendations.map(rec => ({
            hour: rec.hour,
            score: Math.round(rec.score),
            timeOfDay: rec.timeOfDay,
            narrative: rec.narrative
          })),
          circadianCurve: rendererOutput.circadianCurve
        };
        break;

      case 'food':
        displayRecommendations.food = {
          recommendations: rendererOutput.recommendations.map(rec => ({
            food: rec.food,
            score: Math.round(rec.score),
            description: rec.description,
            narrative: rec.narrative,
            category: rec.category
          })),
          cuisineGroupings: rendererOutput.cuisineGroupings
        };
        break;

      case 'season':
        displayRecommendations.season = {
          recommendations: rendererOutput.recommendations.map(rec => ({
            seasonId: rec.seasonId,
            displayName: rec.displayName,
            score: Math.round(rec.score)
          })),
          circularYear: rendererOutput.circularYear?.map(month => ({
            month: month.month,
            displayName: month.displayName,
            score: Math.round(month.score)
          })),
          seasonalRange: rendererOutput.seasonalRange
        };
        break;

      case 'brewing':
        displayRecommendations.brewing = {
          brewingStyles: rendererOutput.brewingStyles?.map(style => ({
            style: style.style,
            parameters: {
              temperature: style.parameters.temperature,
              steepTime: style.parameters.steepTime,
              gramsPer100ml: style.parameters.gramsPer100ml,
              infusions: style.parameters.infusions
            },
            narrative: style.narrative
          }))
        };
        break;

      case 'terroir':
        displayRecommendations.terroir = {
          narrative: rendererOutput.narrative,
          teaType: rendererOutput.teaType,
          location: rendererOutput.location,
          qualityIndicator: rendererOutput.qualityIndicator,
          characteristics: rendererOutput.characteristics,
          harvestSeason: rendererOutput.harvestSeason
        };
        break;

      default:
        // For any other renderer, just copy recommendations array
        displayRecommendations[rendererName] = {
          recommendations: rendererOutput.recommendations || []
        };
    }
  });

  return {
    tea,
    recommendations: displayRecommendations,
    metadata: {
      timestamp: metadata.timestamp,
      version: metadata.version,
      format: 'display'
    }
  };
}

/**
 * VERBOSE FORMAT
 * Complete debugging format with full inference traces
 * Use case: Development, debugging, troubleshooting, quality assurance
 *
 * Includes:
 * - All raw data
 * - Full inference traces from all inferrers
 * - Renderer traces
 * - Confidence scores at all levels
 */
function formatVerbose(baseResponse, allInferences, rendererNames) {
  // Start with raw format
  const verboseResponse = { ...baseResponse };

  // Add full inference analysis
  const inferenceDetails = {};

  Object.entries(allInferences).forEach(([inferrerName, inference]) => {
    inferenceDetails[inferrerName] = {
      // Include everything from the inference
      analysis: inference.analysis,
      trace: inference.trace,
      confidence: inference.confidence,
      inferrerVersion: inference.inferrerVersion
    };
  });

  // Add inference details to response
  verboseResponse.inferences = inferenceDetails;

  // Add format indicator
  verboseResponse.metadata.format = 'verbose';

  // Add debugging metadata
  verboseResponse.debug = {
    inferrersRun: Object.keys(allInferences),
    renderersRun: rendererNames,
    totalTraceSteps: Object.values(allInferences).reduce((sum, inf) => sum + (inf.trace?.length || 0), 0)
  };

  return verboseResponse;
}

/**
 * Get format mode description for API documentation
 */
export function getFormatModeInfo() {
  return {
    raw: {
      description: 'Complete renderer output with all analysis, trace, and confidence data',
      useCase: 'Testing, validation, A/B testing, data exports',
      responseSize: 'Large (~10-20KB per tea)',
      includes: ['recommendations', 'analysis', 'trace', 'confidence', 'metadata']
    },
    display: {
      description: 'UI-ready format optimized for frontend consumption',
      useCase: 'Production UI, mobile apps, lightweight clients',
      responseSize: 'Small (~2-5KB per tea)',
      includes: ['recommendations', 'essential metadata only']
    },
    verbose: {
      description: 'Full debugging format with complete inference traces',
      useCase: 'Development, debugging, troubleshooting, QA',
      responseSize: 'Very Large (~20-40KB per tea)',
      includes: ['all raw data', 'full inference traces', 'renderer traces', 'debug metadata']
    }
  };
}
