/**
 * activities.js
 *
 * Unified taxonomy for all tea activities and occasions
 * Single source of truth for activity definitions and groupings
 *
 * ID Convention: UPPERCASE_WITH_UNDERSCORES
 * Example: ACTIVITY_MEDITATION, CLUSTER_MINDFULNESS_RELAXATION
 *
 * ALIGNMENT NOTE: All activities below are referenced in FlavorTaxonomy.FLAVORS
 * and must be kept in sync when either file changes.
 */

export class ActivityTaxonomy {
  /**
   * Activity Clusters
   * Groups activities into themed occasions/contexts
   */
  static CLUSTERS = {
    CLUSTER_MINDFULNESS_RELAXATION: {
      id: 'CLUSTER_MINDFULNESS_RELAXATION',
      displayName: 'Mindfulness & Relaxation',
      description: 'Quiet, reflective moments for inner calm and peace'
    },
    CLUSTER_FOCUS_PRODUCTIVITY: {
      id: 'CLUSTER_FOCUS_PRODUCTIVITY',
      displayName: 'Focus & Productivity',
      description: 'Activities that require or enhance mental clarity and concentration'
    },
    CLUSTER_SOCIAL_GATHERING: {
      id: 'CLUSTER_SOCIAL_GATHERING',
      displayName: 'Social & Gathering',
      description: 'Shared moments, connection, and celebration with others'
    },
    CLUSTER_WELLNESS_DIGESTIVE: {
      id: 'CLUSTER_WELLNESS_DIGESTIVE',
      displayName: 'Wellness & Digestive',
      description: 'Activities focused on health, digestion, and physical wellbeing'
    },
    CLUSTER_ENERGY_VITALITY: {
      id: 'CLUSTER_ENERGY_VITALITY',
      displayName: 'Energy & Vitality',
      description: 'Morning rituals and activities that invigorate and uplift'
    },
    CLUSTER_COMFORT_INDULGENCE: {
      id: 'CLUSTER_COMFORT_INDULGENCE',
      displayName: 'Comfort & Indulgence',
      description: 'Warming, soothing moments of pleasure and self-care'
    },
    CLUSTER_EVENING_ROUTINE: {
      id: 'CLUSTER_EVENING_ROUTINE',
      displayName: 'Evening & Routine',
      description: 'Wind-down activities and daily rituals'
    },
    CLUSTER_BOLD_CREATIVE: {
      id: 'CLUSTER_BOLD_CREATIVE',
      displayName: 'Bold & Creative',
      description: 'Activities for bold expression and creative pursuits'
    }
  };

  /**
   * Individual Activities
   * Each activity has:
   * - id: unique identifier (UPPERCASE_WITH_UNDERSCORES)
   * - displayName: human-readable name
   * - cluster: references CLUSTERS by id
   * - aliases: alternative names/spellings
   */
  static ACTIVITIES = {
    // ========== MINDFULNESS & RELAXATION CLUSTER ==========
    ACTIVITY_RELAXATION: {
      id: 'ACTIVITY_RELAXATION',
      displayName: 'Relaxation',
      cluster: 'CLUSTER_MINDFULNESS_RELAXATION',
      aliases: ['relaxation', 'relax', 'unwinding']
    },
    ACTIVITY_UNWINDING: {
      id: 'ACTIVITY_UNWINDING',
      displayName: 'Unwinding',
      cluster: 'CLUSTER_MINDFULNESS_RELAXATION',
      aliases: ['unwinding', 'unwind', 'decompressing']
    },
    ACTIVITY_CALM: {
      id: 'ACTIVITY_CALM',
      displayName: 'Calm',
      cluster: 'CLUSTER_MINDFULNESS_RELAXATION',
      aliases: ['calm', 'calming', 'peace', 'peaceful']
    },
    ACTIVITY_CONTEMPLATIVE: {
      id: 'ACTIVITY_CONTEMPLATIVE',
      displayName: 'Contemplative',
      cluster: 'CLUSTER_MINDFULNESS_RELAXATION',
      aliases: ['contemplative', 'contemplation', 'meditation', 'reflective', 'reflection']
    },
    ACTIVITY_GROUNDING: {
      id: 'ACTIVITY_GROUNDING',
      displayName: 'Grounding',
      cluster: 'CLUSTER_MINDFULNESS_RELAXATION',
      aliases: ['grounding', 'grounded', 'centered', 'centering']
    },

    // ========== FOCUS & PRODUCTIVITY CLUSTER ==========
    ACTIVITY_FOCUS: {
      id: 'ACTIVITY_FOCUS',
      displayName: 'Focus',
      cluster: 'CLUSTER_FOCUS_PRODUCTIVITY',
      aliases: ['focus', 'focused', 'concentration', 'concentrate']
    },
    ACTIVITY_REFRESHMENT: {
      id: 'ACTIVITY_REFRESHMENT',
      displayName: 'Refreshment',
      cluster: 'CLUSTER_FOCUS_PRODUCTIVITY',
      aliases: ['refreshment', 'refresh', 'refreshing', 'revitalizing']
    },
    ACTIVITY_CLEANSING: {
      id: 'ACTIVITY_CLEANSING',
      displayName: 'Cleansing',
      cluster: 'CLUSTER_FOCUS_PRODUCTIVITY',
      aliases: ['cleansing', 'cleanse', 'purifying', 'purification']
    },
    ACTIVITY_DETOX_CLEANSING: {
      id: 'ACTIVITY_DETOX_CLEANSING',
      displayName: 'Detox Cleansing',
      cluster: 'CLUSTER_FOCUS_PRODUCTIVITY',
      aliases: ['detox', 'detoxing', 'cleanse', 'detoxification']
    },

    // ========== SOCIAL & GATHERING CLUSTER ==========
    ACTIVITY_SOCIAL: {
      id: 'ACTIVITY_SOCIAL',
      displayName: 'Social',
      cluster: 'CLUSTER_SOCIAL_GATHERING',
      aliases: ['social', 'socializing', 'gathering', 'company']
    },
    ACTIVITY_ROMANTIC: {
      id: 'ACTIVITY_ROMANTIC',
      displayName: 'Romantic',
      cluster: 'CLUSTER_SOCIAL_GATHERING',
      aliases: ['romantic', 'romance', 'intimate', 'intimacy']
    },
    ACTIVITY_AFTERNOON_BREAK: {
      id: 'ACTIVITY_AFTERNOON_BREAK',
      displayName: 'Afternoon Break',
      cluster: 'CLUSTER_SOCIAL_GATHERING',
      aliases: ['afternoon break', 'afternoon tea', 'break', 'pause']
    },

    // ========== WELLNESS & DIGESTIVE CLUSTER ==========
    ACTIVITY_DIGESTIVE: {
      id: 'ACTIVITY_DIGESTIVE',
      displayName: 'Digestive',
      cluster: 'CLUSTER_WELLNESS_DIGESTIVE',
      aliases: ['digestive', 'digestion', 'digestive aid', 'after meal']
    },
    ACTIVITY_SATIATING: {
      id: 'ACTIVITY_SATIATING',
      displayName: 'Satiating',
      cluster: 'CLUSTER_WELLNESS_DIGESTIVE',
      aliases: ['satiating', 'satiation', 'filling', 'nourishing']
    },

    // ========== ENERGY & VITALITY CLUSTER ==========
    ACTIVITY_ENERGY: {
      id: 'ACTIVITY_ENERGY',
      displayName: 'Energy',
      cluster: 'CLUSTER_ENERGY_VITALITY',
      aliases: ['energy', 'energizing', 'energetic', 'boost']
    },
    ACTIVITY_GENTLE_ENERGY: {
      id: 'ACTIVITY_GENTLE_ENERGY',
      displayName: 'Gentle Energy',
      cluster: 'CLUSTER_ENERGY_VITALITY',
      aliases: ['gentle energy', 'gentle boost', 'light energy']
    },
    ACTIVITY_UPLIFTING: {
      id: 'ACTIVITY_UPLIFTING',
      displayName: 'Uplifting',
      cluster: 'CLUSTER_ENERGY_VITALITY',
      aliases: ['uplifting', 'uplift', 'elevating', 'mood boost']
    },
    ACTIVITY_MORNING: {
      id: 'ACTIVITY_MORNING',
      displayName: 'Morning',
      cluster: 'CLUSTER_ENERGY_VITALITY',
      aliases: ['morning', 'breakfast', 'waking', 'start day']
    },

    // ========== COMFORT & INDULGENCE CLUSTER ==========
    ACTIVITY_COMFORT: {
      id: 'ACTIVITY_COMFORT',
      displayName: 'Comfort',
      cluster: 'CLUSTER_COMFORT_INDULGENCE',
      aliases: ['comfort', 'comforting', 'cozy', 'soothing']
    },
    ACTIVITY_WARMING: {
      id: 'ACTIVITY_WARMING',
      displayName: 'Warming',
      cluster: 'CLUSTER_COMFORT_INDULGENCE',
      aliases: ['warming', 'warm', 'cozy', 'warming comfort']
    },
    ACTIVITY_INDULGENCE: {
      id: 'ACTIVITY_INDULGENCE',
      displayName: 'Indulgence',
      cluster: 'CLUSTER_COMFORT_INDULGENCE',
      aliases: ['indulgence', 'indulging', 'luxury', 'pleasure']
    },
    ACTIVITY_TREAT: {
      id: 'ACTIVITY_TREAT',
      displayName: 'Treat',
      cluster: 'CLUSTER_COMFORT_INDULGENCE',
      aliases: ['treat', 'special treat', 'indulge', 'reward']
    },

    // ========== EVENING & ROUTINE CLUSTER ==========
    ACTIVITY_EVENING: {
      id: 'ACTIVITY_EVENING',
      displayName: 'Evening',
      cluster: 'CLUSTER_EVENING_ROUTINE',
      aliases: ['evening', 'dusk', 'night', 'sunset', 'wind down']
    },
    ACTIVITY_ROUTINE: {
      id: 'ACTIVITY_ROUTINE',
      displayName: 'Routine',
      cluster: 'CLUSTER_EVENING_ROUTINE',
      aliases: ['routine', 'daily ritual', 'habit', 'regular']
    },

    // ========== BOLD & CREATIVE CLUSTER ==========
    ACTIVITY_BOLD_EXPERIENCE: {
      id: 'ACTIVITY_BOLD_EXPERIENCE',
      displayName: 'Bold Experience',
      cluster: 'CLUSTER_BOLD_CREATIVE',
      aliases: ['bold', 'bold experience', 'adventurous', 'daring']
    },
    ACTIVITY_CREATIVE: {
      id: 'ACTIVITY_CREATIVE',
      displayName: 'Creative',
      cluster: 'CLUSTER_BOLD_CREATIVE',
      aliases: ['creative', 'creativity', 'artistic', 'creation']
    }
  };

  /**
   * Get activity by ID or alias (case-insensitive)
   * @param {string} query - Activity ID or alias
   * @returns {Object|null} - Activity object or null if not found
   */
  static getActivity(query) {
    if (!query) return null;

    const normalizedQuery = String(query).toLowerCase().trim();

    // Try direct ID match (case-insensitive)
    for (const [id, activity] of Object.entries(this.ACTIVITIES)) {
      if (id.toLowerCase() === normalizedQuery) {
        return activity;
      }
    }

    // Try alias match
    for (const activity of Object.values(this.ACTIVITIES)) {
      if (activity.aliases?.some(alias => alias.toLowerCase() === normalizedQuery)) {
        return activity;
      }
    }

    return null;
  }

  /**
   * Get cluster by ID or displayName
   * @param {string} query - Cluster ID or displayName
   * @returns {Object|null} - Cluster object or null if not found
   */
  static getCluster(query) {
    if (!query) return null;

    const normalizedQuery = String(query).toLowerCase().trim();

    for (const cluster of Object.values(this.CLUSTERS)) {
      if (
        cluster.id.toLowerCase() === normalizedQuery ||
        cluster.displayName.toLowerCase() === normalizedQuery
      ) {
        return cluster;
      }
    }

    return null;
  }

  /**
   * Get all activities in a cluster
   * @param {string} clusterId - Cluster ID or displayName
   * @returns {Array} - Array of activity objects
   */
  static getActivitiesByCluster(clusterId) {
    const cluster = this.getCluster(clusterId);
    if (!cluster) return [];

    return Object.values(this.ACTIVITIES).filter(
      activity => activity.cluster === cluster.id
    );
  }

  /**
   * Get all clusters
   * @returns {Array} - Array of all cluster objects
   */
  static getAllClusters() {
    return Object.values(this.CLUSTERS);
  }

  /**
   * Get all activities
   * @returns {Array} - Array of all activity objects
   */
  static getAllActivities() {
    return Object.values(this.ACTIVITIES);
  }

  /**
   * List all valid activity IDs and aliases (for error messages)
   * @returns {Array} - Array of all valid identifiers
   */
  static listAllValid() {
    const valid = [];

    Object.values(this.ACTIVITIES).forEach(activity => {
      valid.push(activity.id);
      valid.push(...activity.aliases);
    });

    return valid;
  }

  /**
   * Validate that an activity exists
   * Throws helpful error if not found
   * @param {string} query - Activity ID or alias
   * @throws {Error} - If activity not found
   */
  static validateActivity(query) {
    const activity = this.getActivity(query);

    if (!activity) {
      throw new Error(
        `Unknown activity: "${query}"\n` +
        `Valid activities: ${this.listAllValid().join(', ')}`
      );
    }

    return activity;
  }
}

export default ActivityTaxonomy;
