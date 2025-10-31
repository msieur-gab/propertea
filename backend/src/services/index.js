/**
 * Services Index
 *
 * Centralized export of all calculation and recommendation services.
 * This file organizes all service modules for easy consumption by the
 * TeaCalculationOrchestrator and API endpoints.
 */

// Core analysis services
export { CompoundService, compoundService } from './CompoundService.js';
export { FlavorService, flavorService } from './FlavorService.js';
export { TeaTypeService, teaTypeService } from './TeaTypeService.js';
export { ProcessingService, processingService } from './ProcessingService.js';
export { GeographyService, geographyService } from './GeographyService.js';
export { EffectService, effectService } from './EffectService.js';

// Recommendation service (consolidates all matchers)
export { RecommendationService, recommendationService } from './RecommendationService.js';

/**
 * Service Factory
 *
 * Provides convenient access to all services with a single import
 */
export class ServiceFactory {
  static createAllServices() {
    return {
      compound: new CompoundService(),
      flavor: new FlavorService(),
      teaType: new TeaTypeService(),
      processing: new ProcessingService(),
      geography: new GeographyService(),
      effect: new EffectService(),
      recommendation: new RecommendationService()
    };
  }

  /**
   * Get individual service instance
   * @param {string} serviceName - Service name (compound, flavor, teaType, processing, geography, effect, recommendation)
   * @returns {Object} Service instance
   */
  static getService(serviceName) {
    const services = {
      compound: new CompoundService(),
      flavor: new FlavorService(),
      teaType: new TeaTypeService(),
      processing: new ProcessingService(),
      geography: new GeographyService(),
      effect: new EffectService(),
      recommendation: new RecommendationService()
    };

    if (!services[serviceName]) {
      throw new Error(
        `Unknown service: ${serviceName}. Available services: ${Object.keys(services).join(', ')}`
      );
    }

    return services[serviceName];
  }
}

/**
 * Singleton instances for direct module import
 * Useful for singleton pattern adoption across the codebase
 */
export const services = {
  compound: new CompoundService(),
  flavor: new FlavorService(),
  teaType: new TeaTypeService(),
  processing: new ProcessingService(),
  geography: new GeographyService(),
  effect: new EffectService(),
  recommendation: new RecommendationService()
};
