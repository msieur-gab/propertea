/**
 * seasons.js
 *
 * Unified taxonomy for seasons with 3-phase granularity
 * Single source of truth for seasonal definitions and characteristics
 *
 * Granularity: 12 seasons (3 phases per season) + Anytime = 13 total
 * Phases: Early, Mid, Late
 *
 * ID Convention: UPPERCASE_WITH_UNDERSCORES
 * Example: SEASON_EARLY_SPRING, SEASON_SPRING, SEASON_LATE_SPRING
 *
 * ALIGNMENT NOTE: All seasons referenced in FlavorTaxonomy must be kept in sync
 */

export class SeasonTaxonomy {
  /**
   * Seasons with 3-phase granularity
   * Each season has Early, Mid, and Late phases
   */
  static SEASONS = {
    // ========== SPRING (3 phases) ==========
    SEASON_EARLY_SPRING: {
      id: 'SEASON_EARLY_SPRING',
      displayName: 'Early Spring',
      description: 'Early spring awakening, first blooms, fresh emergence',
      seasonFamily: 'spring',
      phase: 'early',
      temperatureRange: { min: 5, max: 12 },
      characteristics: ['emergence', 'fresh', 'light', 'delicate', 'budding']
    },
    SEASON_SPRING: {
      id: 'SEASON_SPRING',
      displayName: 'Spring',
      description: 'Mid-spring bloom, renewal, balanced growth',
      seasonFamily: 'spring',
      phase: 'mid',
      temperatureRange: { min: 10, max: 18 },
      characteristics: ['renewal', 'fresh', 'herbaceous', 'balanced', 'blooming']
    },
    SEASON_LATE_SPRING: {
      id: 'SEASON_LATE_SPRING',
      displayName: 'Late Spring',
      description: 'Late spring transition, full bloom, warming trend',
      seasonFamily: 'spring',
      phase: 'late',
      temperatureRange: { min: 15, max: 22 },
      characteristics: ['warming', 'full bloom', 'transition', 'vibrant', 'energetic']
    },

    // ========== SUMMER (3 phases) ==========
    SEASON_EARLY_SUMMER: {
      id: 'SEASON_EARLY_SUMMER',
      displayName: 'Early Summer',
      description: 'Early summer brightness, longest days, fresh transition',
      seasonFamily: 'summer',
      phase: 'early',
      temperatureRange: { min: 18, max: 25 },
      characteristics: ['bright', 'fresh', 'crisp', 'light', 'energetic']
    },
    SEASON_SUMMER: {
      id: 'SEASON_SUMMER',
      displayName: 'Summer',
      description: 'Mid-summer heat, peak warmth, cooling flavors needed',
      seasonFamily: 'summer',
      phase: 'mid',
      temperatureRange: { min: 23, max: 32 },
      characteristics: ['cooling', 'refreshing', 'light', 'bright', 'thirst-quenching']
    },
    SEASON_LATE_SUMMER: {
      id: 'SEASON_LATE_SUMMER',
      displayName: 'Late Summer',
      description: 'Late summer harvest, heat mellowing, transition approaching',
      seasonFamily: 'summer',
      phase: 'late',
      temperatureRange: { min: 20, max: 28 },
      characteristics: ['harvest', 'transition', 'ripening', 'warm', 'abundant']
    },

    // ========== AUTUMN (3 phases) ==========
    SEASON_EARLY_AUTUMN: {
      id: 'SEASON_EARLY_AUTUMN',
      displayName: 'Early Autumn',
      description: 'Early autumn transition, cooling nights, first color shifts',
      seasonFamily: 'autumn',
      phase: 'early',
      temperatureRange: { min: 15, max: 22 },
      characteristics: ['transition', 'cooling', 'fresh', 'crisp', 'harvest']
    },
    SEASON_AUTUMN: {
      id: 'SEASON_AUTUMN',
      displayName: 'Autumn',
      description: 'Mid-autumn richness, full color, balanced warmth',
      seasonFamily: 'autumn',
      phase: 'mid',
      temperatureRange: { min: 10, max: 18 },
      characteristics: ['warm', 'earthy', 'rich', 'toasted', 'grounding']
    },
    SEASON_LATE_AUTUMN: {
      id: 'SEASON_LATE_AUTUMN',
      displayName: 'Late Autumn',
      description: 'Late autumn depth, darker flavors, preparatory season',
      seasonFamily: 'autumn',
      phase: 'late',
      temperatureRange: { min: 5, max: 12 },
      characteristics: ['deep', 'earthy', 'aged', 'introspective', 'comforting']
    },

    // ========== WINTER (3 phases) ==========
    SEASON_EARLY_WINTER: {
      id: 'SEASON_EARLY_WINTER',
      displayName: 'Early Winter',
      description: 'Early winter chill, transition from autumn, first frosts',
      seasonFamily: 'winter',
      phase: 'early',
      temperatureRange: { min: 0, max: 10 },
      characteristics: ['chill', 'transition', 'warming', 'grounding', 'fortifying']
    },
    SEASON_WINTER: {
      id: 'SEASON_WINTER',
      displayName: 'Winter',
      description: 'Mid-winter cold, deep flavors, internal warmth focus',
      seasonFamily: 'winter',
      phase: 'mid',
      temperatureRange: { min: -5, max: 5 },
      characteristics: ['deep', 'warming', 'comforting', 'rich', 'aged']
    },
    SEASON_LATE_WINTER: {
      id: 'SEASON_LATE_WINTER',
      displayName: 'Late Winter',
      description: 'Late winter renewal hints, dormancy ending, spring approaching',
      seasonFamily: 'winter',
      phase: 'late',
      temperatureRange: { min: 0, max: 12 },
      characteristics: ['renewal', 'warming', 'hopeful', 'transitional', 'restoring']
    },

    // ========== ANYTIME (year-round) ==========
    SEASON_ANYTIME: {
      id: 'SEASON_ANYTIME',
      displayName: 'Any Time',
      description: 'Versatile flavors suitable for any season or occasion',
      seasonFamily: 'all',
      phase: 'all',
      temperatureRange: { min: -10, max: 35 },
      characteristics: ['versatile', 'balanced', 'adaptable', 'universal', 'timeless']
    }
  };

  /**
   * Get season by ID or displayName (case-insensitive)
   * @param {string} query - Season ID or displayName
   * @returns {Object|null} - Season object or null if not found
   */
  static getSeason(query) {
    if (!query) return null;

    const normalizedQuery = String(query).toLowerCase().trim();

    // Try direct ID match
    for (const [id, season] of Object.entries(this.SEASONS)) {
      if (id.toLowerCase() === normalizedQuery) {
        return season;
      }
    }

    // Try displayName match
    for (const season of Object.values(this.SEASONS)) {
      if (season.displayName.toLowerCase() === normalizedQuery) {
        return season;
      }
    }

    return null;
  }

  /**
   * Get all seasons
   * @returns {Array} - Array of all season objects
   */
  static getAllSeasons() {
    return Object.values(this.SEASONS);
  }

  /**
   * Get seasons by season family (spring, summer, autumn, winter, all)
   * @param {string} seasonFamily - Season family (spring, summer, autumn, winter, all)
   * @returns {Array} - Array of matching season objects
   */
  static getSeasonsByFamily(seasonFamily) {
    const normalized = String(seasonFamily).toLowerCase().trim();

    return Object.values(this.SEASONS).filter(
      season => season.seasonFamily === normalized
    );
  }

  /**
   * Get seasons by phase (early, mid, late, all)
   * @param {string} phase - Phase (early, mid, late, all)
   * @returns {Array} - Array of matching season objects
   */
  static getSeasonsByPhase(phase) {
    const normalized = String(phase).toLowerCase().trim();

    return Object.values(this.SEASONS).filter(
      season => season.phase === normalized || season.phase === 'all'
    );
  }

  /**
   * Get seasons suitable for a temperature range
   * @param {number} temperature - Temperature in Celsius
   * @returns {Array} - Array of suitable season objects
   */
  static getSeasonsByTemperature(temperature) {
    return Object.values(this.SEASONS).filter(season => {
      const { min, max } = season.temperatureRange;
      return temperature >= min && temperature <= max;
    });
  }

  /**
   * Get seasons with a specific characteristic
   * @param {string} characteristic - Characteristic to search for
   * @returns {Array} - Array of season objects with that characteristic
   */
  static getSeasonsByCharacteristic(characteristic) {
    const normalized = String(characteristic).toLowerCase().trim();

    return Object.values(this.SEASONS).filter(season =>
      season.characteristics.some(char => char.toLowerCase() === normalized)
    );
  }

  /**
   * Get season family phases (all 3 phases of a season family)
   * @param {string} seasonFamily - Season family (spring, summer, autumn, winter)
   * @returns {Array} - Array of the 3 phases (early, mid, late) for that family
   */
  static getSeasonPhases(seasonFamily) {
    const normalized = String(seasonFamily).toLowerCase().trim();
    const phases = ['early', 'mid', 'late'];

    const result = [];
    for (const phase of phases) {
      const season = Object.values(this.SEASONS).find(
        s => s.seasonFamily === normalized && s.phase === phase
      );
      if (season) result.push(season);
    }
    return result;
  }

  /**
   * List all valid season IDs (for error messages)
   * @returns {Array} - Array of all valid season identifiers
   */
  static listAllValid() {
    return Object.keys(this.SEASONS);
  }

  /**
   * Validate that a season exists
   * Throws helpful error if not found
   * @param {string} query - Season ID or displayName
   * @throws {Error} - If season not found
   */
  static validateSeason(query) {
    const season = this.getSeason(query);

    if (!season) {
      throw new Error(
        `Unknown season: "${query}"\n` +
        `Valid seasons: ${this.listAllValid().join(', ')}`
      );
    }

    return season;
  }
}

export default SeasonTaxonomy;
