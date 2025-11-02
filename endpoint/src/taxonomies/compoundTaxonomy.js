/**
 * CompoundTaxonomy.js
 *
 * Defines compound profiles based on caffeine/theanine ratios and levels.
 * Each profile includes:
 * - Caffeine and theanine ranges that define it
 * - 24-hour circadian curve (hourly scores 0-100)
 * - Time of day affinities (morning/afternoon/evening/night)
 * - Optimal drinking windows
 *
 * This is the data-driven successor to the hardcoded switch statements in TimeRenderer.
 * Extracted from TimeRenderer._getCompoundEffectProfile() and enhanced with metadata.
 */

export const CompoundTaxonomy = {
  // ========== Profile Definitions ==========

  profiles: {
    PROFILE_INTENSE_SHARP: {
      id: 'PROFILE_INTENSE_SHARP',
      displayName: 'Intense & Sharp',
      description: 'High caffeine, very stimulating. Best for morning work and focus.',

      // Compound levels that define this profile
      caffeineRange: { min: 80, max: 150 },     // High caffeine
      theanineRange: { min: 50, max: 100 },     // Moderate theanine
      ratioRange: { min: 1.2, max: 2.5 },       // Caffeine dominant

      // 24-hour circadian curve (0-100 scale, 0=worst, 100=best)
      // Extracted from TimeRenderer: peak 7-13, penalties 18+, deep night 0-5
      circadianProfile: [
        -45, -45, -45, -45, -45, -45,            // 0-5: Deep night penalties
        -25, 18, 28, 28, 25, 20,                 // 6-11: Morning boost peak at 9-10
        20, 18,                                   // 12-13: Late morning still high
        10, 5, 0,                                 // 14-16: Declining
        -15, -30, -40, -45, -45, -45             // 17-23: Evening/night penalties
      ],

      // Time period affinities (0-100 scale)
      timeOfDayAffinity: {
        night: 5,           // 0-5: Very low
        earlyMorning: 40,   // 6-8: Moderate
        morning: 90,        // 9-11: Peak
        midday: 85,         // 12-14: Very high
        afternoon: 50,      // 15-17: Moderate
        evening: 15,        // 18-20: Low
        lateEvening: 5      // 21-23: Very low
      },

      // Optimal drinking windows (hours in 24-hour format)
      optimalRanges: [
        { start: 7, end: 13, label: 'Morning to Early Afternoon', affinity: 90 }
      ]
    },

    PROFILE_FOCUSED_ENERGIZED: {
      id: 'PROFILE_FOCUSED_ENERGIZED',
      displayName: 'Focused & Energized',
      description: 'High caffeine, energizing compound. Sustains focus through afternoon.',

      caffeineRange: { min: 75, max: 130 },
      theanineRange: { min: 40, max: 85 },
      ratioRange: { min: 1.5, max: 2.8 },

      circadianProfile: [
        -30, -30, -30, -30, -30, -30,            // 0-5: Night penalties
        -20, -10, 15, 15, 15, 15,                // 6-11: Morning ramp up
        15, 15,                                   // 12-13: Midday high
        15, 15, 10,                               // 14-16: Afternoon sustained
        -5, -15, -20, -25, -25, -25              // 17-23: Evening decline
      ],

      timeOfDayAffinity: {
        night: 10,
        earlyMorning: 35,
        morning: 80,
        midday: 85,
        afternoon: 80,
        evening: 25,
        lateEvening: 10
      },

      optimalRanges: [
        { start: 8, end: 15, label: 'Morning to Mid-Afternoon', affinity: 85 }
      ]
    },

    PROFILE_CALM_CLEAR: {
      id: 'PROFILE_CALM_CLEAR',
      displayName: 'Calm & Clear',
      description: 'Balanced caffeine/theanine. Provides clarity with calm focus all day, evening option too.',

      caffeineRange: { min: 50, max: 90 },
      theanineRange: { min: 70, max: 130 },
      ratioRange: { min: 0.5, max: 1.0 },

      circadianProfile: [
        -20, -20, -15, -15, -10, -5,             // 0-5: Light morning penalties
        -5, -5, 10, 10, 10, 10,                  // 6-11: Morning ramp
        10, 10, 10, 10, 10, 10,                  // 12-17: Strong mid-day plateau
        15, 12, 12, 10, 5, 0                     // 18-23: Evening option with boost at 19-20
      ],

      timeOfDayAffinity: {
        night: 10,
        earlyMorning: 30,
        morning: 70,
        midday: 85,
        afternoon: 80,
        evening: 60,        // Can drink in evening due to theanine
        lateEvening: 20
      },

      optimalRanges: [
        { start: 9, end: 18, label: 'All Day Focus', affinity: 85 },
        { start: 19, end: 22, label: 'Evening Option', affinity: 60 }
      ]
    },

    PROFILE_DEEPLY_CALM: {
      id: 'PROFILE_DEEPLY_CALM',
      displayName: 'Deeply Calm',
      description: 'Low caffeine, very high theanine. Best for evening relaxation and bedtime tea.',

      caffeineRange: { min: 20, max: 50 },
      theanineRange: { min: 100, max: 180 },
      ratioRange: { min: 0.2, max: 0.5 },

      circadianProfile: [
        5, 5, 5, 5, 5, 5,                        // 0-5: Light early morning
        5, 5, -20, -20, -20, -20,                // 6-11: Morning penalties
        -20, -20, -20, -20, -20, -20,            // 12-17: Strong daytime penalties
        10, 20, 20, 20, 15, 10                   // 18-23: Evening peak
      ],

      timeOfDayAffinity: {
        night: 80,          // Peak: evening/night
        earlyMorning: 30,   // Can drink early morning too
        morning: 10,        // Not ideal
        midday: 5,          // Avoid
        afternoon: 10,      // Not ideal
        evening: 90,        // Peak time
        lateEvening: 85     // Great for sleep prep
      },

      optimalRanges: [
        { start: 17, end: 23, label: 'Evening to Bedtime', affinity: 90 }
      ]
    },

    PROFILE_BALANCED_FOCUSED: {
      id: 'PROFILE_BALANCED_FOCUSED',
      displayName: 'Balanced & Focused',
      description: 'Balanced caffeine/theanine. Good all-day tea with sustained, smooth focus.',

      caffeineRange: { min: 60, max: 100 },
      theanineRange: { min: 80, max: 120 },
      ratioRange: { min: 0.7, max: 1.1 },

      circadianProfile: [
        -15, -15, -15, -15, -15, -15,            // 0-5: Night penalties
        -15, -10, 12, 12, 12, 12,                // 6-11: Morning ramp
        12, 12, 12, 12, 10, 8,                   // 12-17: All-day sustained
        8, 8, 8, 5, 0, 0                         // 18-23: Gentle evening, quiet night
      ],

      timeOfDayAffinity: {
        night: 10,
        earlyMorning: 35,
        morning: 75,
        midday: 85,
        afternoon: 75,
        evening: 50,        // Can drink but less ideal
        lateEvening: 20
      },

      optimalRanges: [
        { start: 8, end: 17, label: 'All-Day Focus', affinity: 80 }
      ]
    },

    PROFILE_SMOOTH_SUSTAINED: {
      id: 'PROFILE_SMOOTH_SUSTAINED',
      displayName: 'Smooth & Sustained',
      description: 'Low-moderate caffeine, moderate theanine. Smooth energy throughout the day.',

      caffeineRange: { min: 40, max: 80 },
      theanineRange: { min: 80, max: 140 },
      ratioRange: { min: 0.4, max: 0.8 },

      circadianProfile: [
        -10, -10, -10, -10, -10, -10,            // 0-5: Light night penalties
        -8, -5, 8, 8, 8, 8,                      // 6-11: Morning gentle ramp
        8, 8, 8, 8, 8, 8,                        // 12-17: Sustained plateau
        8, 8, 5, 3, 0, 0                         // 18-23: Gradual evening wind-down
      ],

      timeOfDayAffinity: {
        night: 15,
        earlyMorning: 40,
        morning: 70,
        midday: 80,
        afternoon: 75,
        evening: 50,        // Gentler evening option
        lateEvening: 25
      },

      optimalRanges: [
        { start: 8, end: 20, label: 'Extended Day Support', affinity: 75 }
      ]
    },

    PROFILE_SMOOTH_ALERT: {
      id: 'PROFILE_SMOOTH_ALERT',
      displayName: 'Smooth & Alert',
      description: 'Low caffeine, moderate theanine. Smooth alertness without harshness.',

      caffeineRange: { min: 35, max: 70 },
      theanineRange: { min: 90, max: 150 },
      ratioRange: { min: 0.35, max: 0.65 },

      circadianProfile: [
        -20, -20, -20, -20, -20, -20,            // 0-5: Night penalties
        -15, -5, 8, 10, 10, 10,                  // 6-11: Morning gentle ramp
        10, 10, 10, 10, 8, 5,                    // 12-17: Full day support
        0, -5, -10, -15, -20, -20                // 18-23: Evening wind-down
      ],

      timeOfDayAffinity: {
        night: 10,
        earlyMorning: 35,
        morning: 65,
        midday: 80,
        afternoon: 70,
        evening: 25,        // Less suitable for evening
        lateEvening: 10
      },

      optimalRanges: [
        { start: 7, end: 19, label: 'Full Day Alertness', affinity: 70 }
      ]
    }
  },

  // ========== Profile Query Methods ==========

  /**
   * Get a profile by ID
   * @param {string} profileId - Profile identifier
   * @returns {Object|null} - Profile object or null if not found
   */
  getProfile(profileId) {
    return this.profiles[profileId] || null;
  },

  /**
   * Get profile by name (display name)
   * @param {string} displayName - Display name of profile
   * @returns {Object|null} - Profile object or null if not found
   */
  getProfileByName(displayName) {
    return Object.values(this.profiles).find(p => p.displayName === displayName) || null;
  },

  /**
   * Get circadian profile (24-hour curve) for a profile
   * @param {string} profileId - Profile identifier
   * @returns {number[]} - Array of 24 hourly scores
   */
  getCircadianProfile(profileId) {
    const profile = this.getProfile(profileId);
    return profile ? profile.circadianProfile : null;
  },

  /**
   * Get optimal drinking windows for a profile
   * @param {string} profileId - Profile identifier
   * @returns {Object[]} - Array of optimal range objects
   */
  getOptimalRanges(profileId) {
    const profile = this.getProfile(profileId);
    return profile ? profile.optimalRanges : [];
  },

  /**
   * Get time of day affinity score for a profile
   * @param {string} profileId - Profile identifier
   * @param {string} timeOfDay - Time period: 'night', 'earlyMorning', 'morning', 'midday', 'afternoon', 'evening', 'lateEvening'
   * @returns {number} - Affinity score 0-100
   */
  getTimeAffinity(profileId, timeOfDay) {
    const profile = this.getProfile(profileId);
    if (!profile) return 0;

    const affinity = profile.timeOfDayAffinity[timeOfDay];
    return affinity !== undefined ? affinity : 0;
  },

  /**
   * Get all profile IDs
   * @returns {string[]} - Array of all profile identifiers
   */
  getAllProfileIds() {
    return Object.keys(this.profiles);
  },

  /**
   * Get all profiles
   * @returns {Object} - Object with all profiles
   */
  getAllProfiles() {
    return { ...this.profiles };
  },

  /**
   * Find profiles by caffeine level
   * @param {number} caffeine - Measured caffeine level
   * @returns {Object[]} - Array of matching profiles
   */
  findProfilesByCaffeine(caffeine) {
    return Object.values(this.profiles).filter(p =>
      caffeine >= p.caffeineRange.min && caffeine <= p.caffeineRange.max
    );
  },

  /**
   * Find profiles by theanine level
   * @param {number} theanine - Measured theanine level
   * @returns {Object[]} - Array of matching profiles
   */
  findProfilesByTheanine(theanine) {
    return Object.values(this.profiles).filter(p =>
      theanine >= p.theanineRange.min && theanine <= p.theanineRange.max
    );
  },

  /**
   * Find profiles by caffeine/theanine ratio
   * @param {number} ratio - Ratio of caffeine to theanine
   * @returns {Object[]} - Array of matching profiles
   */
  findProfilesByRatio(ratio) {
    return Object.values(this.profiles).filter(p =>
      ratio >= p.ratioRange.min && ratio <= p.ratioRange.max
    );
  },

  /**
   * Match profile based on compound levels
   * @param {number} caffeineLevel - Caffeine level
   * @param {number} theanineLevel - Theanine level
   * @returns {string|null} - Best matching profile ID or null if no match
   */
  matchProfile(caffeineLevel, theanineLevel) {
    if (!caffeineLevel || !theanineLevel) return null;

    const ratio = caffeineLevel / theanineLevel;
    let bestMatch = null;
    let bestScore = -1;

    Object.values(this.profiles).forEach(profile => {
      // Check if levels are in range
      const caffeineFit = caffeineLevel >= profile.caffeineRange.min &&
                         caffeineLevel <= profile.caffeineRange.max;
      const theanineFit = theanineLevel >= profile.theanineRange.min &&
                         theanineLevel <= profile.theanineRange.max;
      const ratioFit = ratio >= profile.ratioRange.min &&
                      ratio <= profile.ratioRange.max;

      // Score: all three ranges fit = 3, two = 2, one = 1
      const score = (caffeineFit ? 1 : 0) + (theanineFit ? 1 : 0) + (ratioFit ? 1 : 0);

      if (score > bestScore) {
        bestScore = score;
        bestMatch = profile.id;
      }
    });

    return bestScore > 0 ? bestMatch : null;
  },

  /**
   * Get hourly scores adjusted for a specific profile
   * @param {string} profileId - Profile identifier
   * @param {number} baseScore - Base score to start with (typically 50)
   * @returns {number[]} - Array of 24 adjusted hourly scores (0-100)
   */
  getAdjustedHourlyScores(profileId, baseScore = 50) {
    const profile = this.getProfile(profileId);
    if (!profile) return new Array(24).fill(baseScore);

    return profile.circadianProfile.map(adjustment =>
      Math.max(0, Math.min(100, baseScore + adjustment))
    );
  },

  /**
   * Format optimal time ranges as readable strings
   * @param {string} profileId - Profile identifier
   * @returns {string[]} - Array of formatted time range strings
   */
  formatTimeRanges(profileId) {
    const ranges = this.getOptimalRanges(profileId);
    return ranges.map(r => {
      const startHour = String(r.start).padStart(2, '0');
      const endHour = String(r.end).padStart(2, '0');
      return `${startHour}:00-${endHour}:00 (${r.label})`;
    });
  }
};

export default CompoundTaxonomy;
