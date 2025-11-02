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
      aliases: ['relaxation', 'relax', 'unwinding'],
      description: 'A state of ease and peace where tension melts away',
      benefits: ['Reduces stress and anxiety', 'Lowers blood pressure', 'Improves sleep quality', 'Enhances mental clarity'],
      suggestedTiming: 'Afternoon or early evening, especially after work'
    },
    ACTIVITY_UNWINDING: {
      id: 'ACTIVITY_UNWINDING',
      displayName: 'Unwinding',
      cluster: 'CLUSTER_MINDFULNESS_RELAXATION',
      aliases: ['unwinding', 'unwind', 'decompressing'],
      description: 'Gently releasing tension and transitioning to a calmer state',
      benefits: ['Eases physical tension', 'Transitions mind from work mode', 'Promotes gradual relaxation', 'Encourages introspection'],
      suggestedTiming: 'Late afternoon to evening'
    },
    ACTIVITY_CALM: {
      id: 'ACTIVITY_CALM',
      displayName: 'Calm',
      cluster: 'CLUSTER_MINDFULNESS_RELAXATION',
      aliases: ['calm', 'calming', 'peace', 'peaceful'],
      description: 'Cultivating inner peace and tranquility in the present moment',
      benefits: ['Reduces racing thoughts', 'Stabilizes mood', 'Improves emotional balance', 'Enhances presence'],
      suggestedTiming: 'Any time, especially when feeling overwhelmed'
    },
    ACTIVITY_CONTEMPLATIVE: {
      id: 'ACTIVITY_CONTEMPLATIVE',
      displayName: 'Contemplative',
      cluster: 'CLUSTER_MINDFULNESS_RELAXATION',
      aliases: ['contemplative', 'contemplation', 'meditation', 'reflective', 'reflection'],
      description: 'Deep, mindful reflection on thoughts, feelings, and life experiences',
      benefits: ['Increases self-awareness', 'Promotes wisdom and insight', 'Deepens emotional understanding', 'Supports personal growth'],
      suggestedTiming: 'Morning or quiet evening moments'
    },
    ACTIVITY_GROUNDING: {
      id: 'ACTIVITY_GROUNDING',
      displayName: 'Grounding',
      cluster: 'CLUSTER_MINDFULNESS_RELAXATION',
      aliases: ['grounding', 'grounded', 'centered', 'centering'],
      description: 'Connecting with the present moment and anchoring to stability',
      benefits: ['Reduces anxiety and panic', 'Improves focus and presence', 'Enhances sense of stability', 'Calms nervous system'],
      suggestedTiming: 'Flexible, especially beneficial during stressful periods'
    },

    // ========== FOCUS & PRODUCTIVITY CLUSTER ==========
    ACTIVITY_FOCUS: {
      id: 'ACTIVITY_FOCUS',
      displayName: 'Focus',
      cluster: 'CLUSTER_FOCUS_PRODUCTIVITY',
      aliases: ['focus', 'focused', 'concentration', 'concentrate'],
      description: 'Directing mental attention with clarity toward meaningful tasks',
      benefits: ['Enhances concentration and attention span', 'Improves work quality', 'Reduces mental fog', 'Boosts productivity'],
      suggestedTiming: 'Morning through early afternoon'
    },
    ACTIVITY_REFRESHMENT: {
      id: 'ACTIVITY_REFRESHMENT',
      displayName: 'Refreshment',
      cluster: 'CLUSTER_FOCUS_PRODUCTIVITY',
      aliases: ['refreshment', 'refresh', 'refreshing', 'revitalizing'],
      description: 'Renewing mental and physical vitality with a sense of invigoration',
      benefits: ['Clears mental fatigue', 'Restores energy', 'Refreshes senses', 'Resets mental state'],
      suggestedTiming: 'Midday or as needed for a mental reset'
    },
    ACTIVITY_CLEANSING: {
      id: 'ACTIVITY_CLEANSING',
      displayName: 'Cleansing',
      cluster: 'CLUSTER_FOCUS_PRODUCTIVITY',
      aliases: ['cleansing', 'cleanse', 'purifying', 'purification'],
      description: 'Detoxifying and purifying the body and mind',
      benefits: ['Supports natural detoxification', 'Aids digestive system', 'Clarifies mental state', 'Reduces inflammation'],
      suggestedTiming: 'Morning or between meals'
    },
    ACTIVITY_DETOX_CLEANSING: {
      id: 'ACTIVITY_DETOX_CLEANSING',
      displayName: 'Detox Cleansing',
      cluster: 'CLUSTER_FOCUS_PRODUCTIVITY',
      aliases: ['detox', 'detoxing', 'cleanse', 'detoxification'],
      description: 'Intensive cleansing to support the body\'s natural elimination processes',
      benefits: ['Enhances liver function', 'Boosts immune system', 'Improves energy levels', 'Supports whole-body wellness'],
      suggestedTiming: 'Morning on an empty stomach or between meals'
    },

    // ========== SOCIAL & GATHERING CLUSTER ==========
    ACTIVITY_SOCIAL: {
      id: 'ACTIVITY_SOCIAL',
      displayName: 'Social',
      cluster: 'CLUSTER_SOCIAL_GATHERING',
      aliases: ['social', 'socializing', 'gathering', 'company'],
      description: 'Sharing meaningful moments and connection with friends and loved ones',
      benefits: ['Strengthens relationships', 'Boosts mood and happiness', 'Promotes sense of belonging', 'Encourages conversation'],
      suggestedTiming: 'Afternoon or evening gatherings'
    },
    ACTIVITY_ROMANTIC: {
      id: 'ACTIVITY_ROMANTIC',
      displayName: 'Romantic',
      cluster: 'CLUSTER_SOCIAL_GATHERING',
      aliases: ['romantic', 'romance', 'intimate', 'intimacy'],
      description: 'Creating intimate moments of closeness and emotional connection',
      benefits: ['Deepens intimate bonds', 'Creates memorable moments', 'Enhances emotional intimacy', 'Promotes relaxed conversation'],
      suggestedTiming: 'Evening, especially sunset or after dinner'
    },
    ACTIVITY_AFTERNOON_BREAK: {
      id: 'ACTIVITY_AFTERNOON_BREAK',
      displayName: 'Afternoon Break',
      cluster: 'CLUSTER_SOCIAL_GATHERING',
      aliases: ['afternoon break', 'afternoon tea', 'break', 'pause'],
      description: 'A mindful pause in the day to rest and recharge',
      benefits: ['Restores mental energy', 'Breaks up the workday', 'Allows social connection', 'Improves afternoon productivity'],
      suggestedTiming: '2-4 PM, mid-afternoon'
    },

    // ========== WELLNESS & DIGESTIVE CLUSTER ==========
    ACTIVITY_DIGESTIVE: {
      id: 'ACTIVITY_DIGESTIVE',
      displayName: 'Digestive',
      cluster: 'CLUSTER_WELLNESS_DIGESTIVE',
      aliases: ['digestive', 'digestion', 'digestive aid', 'after meal'],
      description: 'Supporting healthy digestion and nutrient absorption',
      benefits: ['Aids digestion and reduces bloating', 'Soothes the digestive tract', 'Improves nutrient absorption', 'Reduces post-meal discomfort'],
      suggestedTiming: 'After meals, especially lunch and dinner'
    },
    ACTIVITY_SATIATING: {
      id: 'ACTIVITY_SATIATING',
      displayName: 'Satiating',
      cluster: 'CLUSTER_WELLNESS_DIGESTIVE',
      aliases: ['satiating', 'satiation', 'filling', 'nourishing'],
      description: 'Providing deep nourishment and a sense of satisfaction',
      benefits: ['Enhances feeling of fullness', 'Supports balanced meals', 'Nourishes body and spirit', 'Promotes satisfaction'],
      suggestedTiming: 'With or after meals'
    },

    // ========== ENERGY & VITALITY CLUSTER ==========
    ACTIVITY_ENERGY: {
      id: 'ACTIVITY_ENERGY',
      displayName: 'Energy',
      cluster: 'CLUSTER_ENERGY_VITALITY',
      aliases: ['energy', 'energizing', 'energetic', 'boost'],
      description: 'Activating and invigorating the mind and body with dynamic vitality',
      benefits: ['Increases alertness and energy', 'Enhances physical performance', 'Improves mental clarity', 'Boosts motivation'],
      suggestedTiming: 'Morning through midday'
    },
    ACTIVITY_GENTLE_ENERGY: {
      id: 'ACTIVITY_GENTLE_ENERGY',
      displayName: 'Gentle Energy',
      cluster: 'CLUSTER_ENERGY_VITALITY',
      aliases: ['gentle energy', 'gentle boost', 'light energy'],
      description: 'A soft, sustainable lift in vitality without overstimulation',
      benefits: ['Provides steady energy without jitters', 'Supports sustained focus', 'Gentle on sensitive systems', 'Promotes balanced activity'],
      suggestedTiming: 'Morning or early afternoon'
    },
    ACTIVITY_UPLIFTING: {
      id: 'ACTIVITY_UPLIFTING',
      displayName: 'Uplifting',
      cluster: 'CLUSTER_ENERGY_VITALITY',
      aliases: ['uplifting', 'uplift', 'elevating', 'mood boost'],
      description: 'Elevating mood and brightening emotional state',
      benefits: ['Improves mood and outlook', 'Enhances positivity', 'Reduces emotional fatigue', 'Increases mental brightness'],
      suggestedTiming: 'Morning or during afternoon slump'
    },
    ACTIVITY_MORNING: {
      id: 'ACTIVITY_MORNING',
      displayName: 'Morning',
      cluster: 'CLUSTER_ENERGY_VITALITY',
      aliases: ['morning', 'breakfast', 'waking', 'start day'],
      description: 'Starting the day with vitality and intention',
      benefits: ['Wakes the senses', 'Sets positive tone for day', 'Supports morning alertness', 'Encourages mindful start'],
      suggestedTiming: 'Early morning, with breakfast'
    },

    // ========== COMFORT & INDULGENCE CLUSTER ==========
    ACTIVITY_COMFORT: {
      id: 'ACTIVITY_COMFORT',
      displayName: 'Comfort',
      cluster: 'CLUSTER_COMFORT_INDULGENCE',
      aliases: ['comfort', 'comforting', 'cozy', 'soothing'],
      description: 'Wrapping yourself in warmth and emotional wellbeing',
      benefits: ['Soothes emotions', 'Provides emotional warmth', 'Creates sense of safety', 'Reduces feelings of isolation'],
      suggestedTiming: 'Any time, especially during cold weather or difficult moments'
    },
    ACTIVITY_WARMING: {
      id: 'ACTIVITY_WARMING',
      displayName: 'Warming',
      cluster: 'CLUSTER_COMFORT_INDULGENCE',
      aliases: ['warming', 'warm', 'cozy', 'warming comfort'],
      description: 'Generating internal warmth and cozy comfort',
      benefits: ['Improves circulation', 'Increases body warmth', 'Creates cozy atmosphere', 'Soothes and relaxes'],
      suggestedTiming: 'Cold weather, late afternoon, or evening'
    },
    ACTIVITY_INDULGENCE: {
      id: 'ACTIVITY_INDULGENCE',
      displayName: 'Indulgence',
      cluster: 'CLUSTER_COMFORT_INDULGENCE',
      aliases: ['indulgence', 'indulging', 'luxury', 'pleasure'],
      description: 'Treating yourself to moments of pure pleasure and luxury',
      benefits: ['Enhances enjoyment of life', 'Provides self-care moment', 'Improves mood', 'Creates sense of reward'],
      suggestedTiming: 'Special occasions or evening relaxation'
    },
    ACTIVITY_TREAT: {
      id: 'ACTIVITY_TREAT',
      displayName: 'Treat',
      cluster: 'CLUSTER_COMFORT_INDULGENCE',
      aliases: ['treat', 'special treat', 'indulge', 'reward'],
      description: 'A special reward for yourself—a moment of well-deserved pleasure',
      benefits: ['Provides emotional reward', 'Creates celebratory moment', 'Boosts mood', 'Encourages self-appreciation'],
      suggestedTiming: 'As a reward or special moment'
    },

    // ========== EVENING & ROUTINE CLUSTER ==========
    ACTIVITY_EVENING: {
      id: 'ACTIVITY_EVENING',
      displayName: 'Evening',
      cluster: 'CLUSTER_EVENING_ROUTINE',
      aliases: ['evening', 'dusk', 'night', 'sunset', 'wind down'],
      description: 'Slowing down as day ends and preparing for restful sleep',
      benefits: ['Supports sleep quality', 'Reduces evening stress', 'Creates transition ritual', 'Calms before bedtime'],
      suggestedTiming: 'Late afternoon through early evening'
    },
    ACTIVITY_ROUTINE: {
      id: 'ACTIVITY_ROUTINE',
      displayName: 'Routine',
      cluster: 'CLUSTER_EVENING_ROUTINE',
      aliases: ['routine', 'daily ritual', 'habit', 'regular'],
      description: 'A regular practice that grounds you and creates daily structure',
      benefits: ['Builds healthy habits', 'Creates sense of stability', 'Improves consistency', 'Supports wellbeing ritual'],
      suggestedTiming: 'Same time daily, becomes part of your rhythm'
    },

    // ========== BOLD & CREATIVE CLUSTER ==========
    ACTIVITY_BOLD_EXPERIENCE: {
      id: 'ACTIVITY_BOLD_EXPERIENCE',
      displayName: 'Bold Experience',
      cluster: 'CLUSTER_BOLD_CREATIVE',
      aliases: ['bold', 'bold experience', 'adventurous', 'daring'],
      description: 'Embracing adventurous moments and bold experiences',
      benefits: ['Encourages courage and boldness', 'Enhances sense of aliveness', 'Supports daring pursuits', 'Inspires confidence'],
      suggestedTiming: 'When pursuing new challenges or adventures'
    },
    ACTIVITY_CREATIVE: {
      id: 'ACTIVITY_CREATIVE',
      displayName: 'Creative',
      cluster: 'CLUSTER_BOLD_CREATIVE',
      aliases: ['creative', 'creativity', 'artistic', 'creation'],
      description: 'Unlocking creative expression and artistic inspiration',
      benefits: ['Enhances creative thinking', 'Improves artistic flow', 'Supports problem-solving', 'Inspires original ideas'],
      suggestedTiming: 'During creative work or artistic pursuits'
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
