/**
 * TeaCalculationOrchestrator.js
 *
 * CRITICAL COMPONENT: Orchestrates single-pass tea analysis
 *
 * Solves the redundancy problem in the original system:
 * - OLD: _runCoreCalculations() called 6 times (once in analyzeTea, then once per matcher)
 * - NEW: _runCoreCalculations() called 1 time, result passed to all matchers
 *
 * Performance improvement: ~5-6x faster
 */

import { validateAnalysisRequest, validateCoreAnalysis } from './validators.js';

export class TeaCalculationOrchestrator {
  /**
   * @param {Object} services - All calculation services
   *   - teaTypeService
   *   - compoundService
   *   - flavorService
   *   - processingService
   *   - geographyService
   *   - recommendationService
   */
  constructor(services) {
    if (!services || typeof services !== 'object') {
      throw new Error('Services object required for TeaCalculationOrchestrator');
    }

    this.services = services;

    // Validate all required services are present
    const requiredServices = [
      'teaTypeService',
      'compoundService',
      'flavorService',
      'processingService',
      'geographyService',
      'recommendationService'
    ];

    for (const service of requiredServices) {
      if (!services[service]) {
        throw new Error(`Missing required service: ${service}`);
      }
    }
  }

  /**
   * Main entry point: Analyze a tea from raw data
   *
   * Single-pass calculation architecture:
   * 1. Validate & normalize input
   * 2. Run CORE calculations ONE TIME
   * 3. Run MATCHERS IN PARALLEL (they share the core result)
   * 4. Combine and return complete analysis
   *
   * @param {Object} rawTeaData - Raw tea data from API request
   * @returns {Promise<Object>} Complete tea analysis
   */
  async calculateTea(rawTeaData) {
    try {
      // Step 1: Validate input
      const validation = validateAnalysisRequest(rawTeaData);
      if (!validation.valid) {
        return {
          success: false,
          error: validation.error
        };
      }

      const teaModel = validation.data;

      // Step 2: Run CORE calculations ONCE
      const coreAnalysis = await this.runCoreCalculations(teaModel);
      if (!coreAnalysis.success) {
        return {
          success: false,
          error: coreAnalysis.error
        };
      }

      // Step 3: Validate core analysis structure
      const coreValidation = validateCoreAnalysis(coreAnalysis.data);
      if (!coreValidation.valid) {
        return {
          success: false,
          error: coreValidation.error
        };
      }

      // Step 4: Run MATCHERS IN PARALLEL using the same core analysis
      // This is the KEY optimization - matchers don't recalculate
      const [timing, seasonal, activities, food, brewing] = await Promise.all([
        this.services.recommendationService.getTimingRecommendations(
          teaModel,
          coreAnalysis.data
        ),
        this.services.recommendationService.getSeasonalRecommendations(
          teaModel,
          coreAnalysis.data
        ),
        this.services.recommendationService.getActivityRecommendations(
          teaModel,
          coreAnalysis.data
        ),
        this.services.recommendationService.getFoodRecommendations(
          teaModel,
          coreAnalysis.data
        ),
        this.services.recommendationService.getBrewingRecommendations(
          teaModel,
          coreAnalysis.data
        )
      ]);

      // Step 5: Combine all analyses
      const completeAnalysis = {
        // Core analyses
        teaType: coreAnalysis.data.teaType,
        compounds: coreAnalysis.data.compounds,
        flavor: coreAnalysis.data.flavor,
        processing: coreAnalysis.data.processing,
        geography: coreAnalysis.data.geography,

        // Recommendations (derived from core analyses)
        timing: timing.recommendations || {},
        seasonal: seasonal.recommendations || {},
        food: food.recommendations || {},
        activities: activities.recommendations || {},
        brewing: brewing.recommendations || {},

        // Metadata
        calculatedAt: new Date().toISOString(),
        _metadata: {
          teaName: teaModel.name,
          teaType: teaModel.type,
          version: '2.0-orchestrated'
        }
      };

      return {
        success: true,
        data: completeAnalysis
      };
    } catch (error) {
      console.error('Error in TeaCalculationOrchestrator:', error);
      return {
        success: false,
        error: error.message || 'Unknown error during tea analysis'
      };
    }
  }

  /**
   * Run all CORE calculations in parallel
   * This method is called ONCE per analysis (not once per matcher)
   *
   * @param {TeaModel} teaModel - Validated and normalized tea data
   * @returns {Promise<Object>} Core analysis results
   * @private
   */
  async runCoreCalculations(teaModel) {
    try {
      // Run all 5 core calculations in parallel
      // This is still fast because we're doing them once, not 6 times
      const [teaType, compounds, flavor, processing, geography] = await Promise.all([
        this.services.teaTypeService.analyze(teaModel),
        this.services.compoundService.analyze(teaModel),
        this.services.flavorService.analyze(teaModel),
        this.services.processingService.analyze(teaModel),
        this.services.geographyService.analyze(teaModel)
      ]);

      return {
        success: true,
        data: {
          teaType,
          compounds,
          flavor,
          processing,
          geography,
          _sourceTea: teaModel
        }
      };
    } catch (error) {
      console.error('Error in core calculations:', error);
      return {
        success: false,
        error: error.message || 'Core calculation failed'
      };
    }
  }

  /**
   * Get trace/audit logs for debugging
   * (Optional: can be implemented per service to track calculation steps)
   *
   * @returns {Array} Trace logs
   */
  getAuditTrace() {
    return this._auditTrace || [];
  }
}

/**
 * Factory function to create an orchestrator with all services
 * @param {Object} services - Services object
 * @returns {TeaCalculationOrchestrator}
 */
export function createTeaCalculationOrchestrator(services) {
  return new TeaCalculationOrchestrator(services);
}
