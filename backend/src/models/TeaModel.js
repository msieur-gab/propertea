/**
 * TeaModel.js
 * Standardized data structure for all tea data
 * Provides normalization and validation
 */

export class TeaModel {
  constructor(data = {}) {
    // Basic tea information
    this.id = data.id || null;
    this.name = data.name || '';
    this.originalName = data.originalName || '';
    this.type = data.type || '';
    this.subType = data.subType || '';

    // Chemical compounds (0-10 scale)
    // Handle both flat structure and nested structure
    this.caffeineLevel = typeof data.caffeineLevel === 'number'
      ? data.caffeineLevel
      : (typeof data.compounds?.caffeineLevel === 'number' ? data.compounds.caffeineLevel : 0);
    this.lTheanineLevel = typeof data.lTheanineLevel === 'number'
      ? data.lTheanineLevel
      : (typeof data.compounds?.lTheanineLevel === 'number' ? data.compounds.lTheanineLevel : 0);

    // Processing information
    this.processing = {
      methods: Array.isArray(data.processing?.methods) ? data.processing.methods : (Array.isArray(data.processingMethods) ? data.processingMethods : []),
      oxidationLevel: typeof data.processing?.oxidationLevel === 'number' ? data.processing.oxidationLevel : 0,
      rollingStyle: data.processing?.rollingStyle || '',
      withering: data.processing?.withering || '',
      firing: data.processing?.firing || ''
    };

    // Geographical information
    this.geography = {
      country: data.geography?.country || '',
      province: data.geography?.province || '',
      location: data.geography?.location || '',
      latitude: typeof data.geography?.latitude === 'number' ? data.geography.latitude : null,
      longitude: typeof data.geography?.longitude === 'number' ? data.geography.longitude : null,
      altitude: typeof data.geography?.altitude === 'number' ? data.geography.altitude : null,
      humidity: typeof data.geography?.humidity === 'number' ? data.geography.humidity : null,
      temperature: typeof data.geography?.temperature === 'number' ? data.geography.temperature : null,
      solarRadiation: typeof data.geography?.solarRadiation === 'number' ? data.geography.solarRadiation : null,
      harvestMonth: typeof data.geography?.harvestMonth === 'number' ? data.geography.harvestMonth : null
    };

    // Flavor profile
    this.flavor = {
      primary: Array.isArray(data.flavor?.primary) ? data.flavor.primary : (Array.isArray(data.flavorProfile) ? data.flavorProfile : []),
      secondary: Array.isArray(data.flavor?.secondary) ? data.flavor.secondary : [],
      notes: data.flavor?.notes || ''
    };

    // Metadata
    this.dateAdded = data.dateAdded || new Date().toISOString();
  }

  /**
   * Validate the tea data
   * @returns {Object} { isValid: boolean, errors: string[] }
   */
  validate() {
    const errors = [];

    // Basic validation
    if (!this.name || typeof this.name !== 'string' || !this.name.trim()) {
      errors.push('Tea name is required and must be a non-empty string');
    }

    if (!this.type || typeof this.type !== 'string' || !this.type.trim()) {
      errors.push('Tea type is required and must be a non-empty string');
    }

    // Validate compound levels (0-10 scale)
    if (typeof this.caffeineLevel !== 'number' || this.caffeineLevel < 0 || this.caffeineLevel > 10) {
      errors.push('Caffeine level must be a number between 0 and 10');
    }

    if (typeof this.lTheanineLevel !== 'number' || this.lTheanineLevel < 0 || this.lTheanineLevel > 10) {
      errors.push('L-Theanine level must be a number between 0 and 10');
    }

    // Validate processing
    if (!Array.isArray(this.processing.methods)) {
      errors.push('Processing methods must be an array');
    }

    if (typeof this.processing.oxidationLevel === 'number') {
      if (this.processing.oxidationLevel < 0 || this.processing.oxidationLevel > 100) {
        errors.push('Oxidation level must be between 0 and 100');
      }
    }

    // Validate geography
    if (this.geography.latitude !== null) {
      if (typeof this.geography.latitude !== 'number' || this.geography.latitude < -90 || this.geography.latitude > 90) {
        errors.push('Latitude must be a number between -90 and 90');
      }
    }

    if (this.geography.longitude !== null) {
      if (typeof this.geography.longitude !== 'number' || this.geography.longitude < -180 || this.geography.longitude > 180) {
        errors.push('Longitude must be a number between -180 and 180');
      }
    }

    if (this.geography.harvestMonth !== null) {
      if (typeof this.geography.harvestMonth !== 'number' || this.geography.harvestMonth < 1 || this.geography.harvestMonth > 12) {
        errors.push('Harvest month must be a number between 1 and 12');
      }
    }

    // Validate flavor
    if (!Array.isArray(this.flavor.primary)) {
      errors.push('Flavor primary must be an array');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Convert to JSON-serializable object
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      originalName: this.originalName,
      type: this.type,
      subType: this.subType,
      caffeineLevel: this.caffeineLevel,
      lTheanineLevel: this.lTheanineLevel,
      processing: { ...this.processing },
      geography: { ...this.geography },
      flavor: { ...this.flavor },
      dateAdded: this.dateAdded
    };
  }

  /**
   * Create TeaModel from raw data
   */
  static fromData(data) {
    return new TeaModel(data);
  }

  /**
   * Create empty TeaModel
   */
  static createEmpty() {
    return new TeaModel();
  }
}
