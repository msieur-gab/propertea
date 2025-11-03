/**
 * ActivityRenderer.js
 *
 * Purpose: Render activity recommendations from three contributing sources:
 *   1. Compound Profile (40%) - biochemical stimulation/relaxation from caffeine/theanine
 *   2. Tea Type Hints (35%) - cultural/traditional activity associations
 *   3. Flavor Profile Hints (25%) - sensory/thematic activity suggestions
 *
 * Input: Inferences from CompoundInferrer, TeaTypeInferrer, and FlavorInferrer
 * Output: Activity recommendations with confidence and reasoning
 *
 * This Renderer uses the Unified Taxonomy System (ActivityTaxonomy) for activity definitions
 * and organization, replacing hardcoded activity lists with dynamic registry data
 */

import { ActivityTaxonomy, TeaTypeTaxonomy, FlavorTaxonomy } from '../../taxonomies/index.js';

export class ActivityRenderer {
  constructor(config = {}) {
    this.config = {
      clusterThreshold: config.clusterThreshold || 70,
      maxRecommendations: config.maxRecommendations || 3,
      // Rebalanced weighting for three sources of activity suggestions
      // Flavor now primary (40%) because it drives real-world tea selection and emotional associations
      flavorWeight: config.flavorWeight || 0.40,          // 40% - sensory/emotional/thematic (PRIMARY)
      compoundWeight: config.compoundWeight || 0.35,      // 35% - biochemical (tells us IF we want stimulation)
      teaTypeWeight: config.teaTypeWeight || 0.25,        // 25% - cultural tradition (provides baseline context)
      ...config
    };

    // Store taxonomy references
    this.activityTaxonomy = ActivityTaxonomy;
    this.teaTypeTaxonomy = TeaTypeTaxonomy;
    this.flavorTaxonomy = FlavorTaxonomy;

    // Build activity clusters from ActivityTaxonomy
    // Map cluster IDs to theme names and profile associations
    this.activityClusters = this._buildClustersFromTaxonomy();
  }

  /**
   * Build activity clusters dynamically from ActivityTaxonomy
   * Groups activities by their cluster assignment
   */
  _buildClustersFromTaxonomy() {
    const clusterMap = new Map();

    // Iterate through all activities and group by cluster
    Object.entries(this.activityTaxonomy.ACTIVITIES).forEach(([activityId, activity]) => {
      const clusterId = activity.cluster;

      if (!clusterMap.has(clusterId)) {
        clusterMap.set(clusterId, {
          clusterId,
          theme: this._getClusterThemeName(clusterId),
          activityIds: [],
          activityNames: []
        });
      }

      clusterMap.get(clusterId).activityIds.push(activityId);
      clusterMap.get(clusterId).activityNames.push(activity.displayName);
    });

    // Convert to array and add profile associations
    return Array.from(clusterMap.values()).map(cluster => ({
      theme: cluster.theme,
      activities: cluster.activityNames,
      activityIds: cluster.activityIds,
      targetProfiles: this._getProfilesForCluster(cluster.clusterId)
    }));
  }

  /**
   * Map cluster ID to human-readable theme name
   */
  _getClusterThemeName(clusterId) {
    const themeMap = {
      'CLUSTER_MINDFULNESS_RELAXATION': 'Mindfulness & Relaxation',
      'CLUSTER_FOCUS_PRODUCTIVITY': 'Focus & Productivity',
      'CLUSTER_SOCIAL_GATHERING': 'Social Engagement',
      'CLUSTER_WELLNESS_DIGESTIVE': 'Wellness & Digestive',
      'CLUSTER_ENERGY_VITALITY': 'Active & Energetic',
      'CLUSTER_EVENING_ROUTINE': 'Evening Wind-Down',
      'CLUSTER_BOLD_CREATIVE': 'Creative Pursuits',
      'CLUSTER_COMFORT_INDULGENCE': 'Comfort & Indulgence'
    };
    return themeMap[clusterId] || clusterId;
  }

  /**
   * Get compound profile associations for a cluster
   */
  _getProfilesForCluster(clusterId) {
    const profileMap = {
      'CLUSTER_MINDFULNESS_RELAXATION': ['Deeply Calm', 'Calm & Clear', 'Smooth & Sustained'],
      'CLUSTER_FOCUS_PRODUCTIVITY': ['Intense & Sharp', 'Focused & Energized', 'Balanced & Focused', 'Smooth & Alert'],
      'CLUSTER_SOCIAL_GATHERING': ['Balanced & Focused', 'Smooth & Alert', 'Focused & Energized'],
      'CLUSTER_WELLNESS_DIGESTIVE': ['Balanced & Focused', 'Calm & Clear', 'Smooth & Sustained'],
      'CLUSTER_ENERGY_VITALITY': ['Intense & Sharp', 'Focused & Energized', 'High (Smooth)'],
      'CLUSTER_EVENING_ROUTINE': ['Deeply Calm', 'Calm & Clear', 'Smooth & Sustained'],
      'CLUSTER_BOLD_CREATIVE': ['Balanced & Focused', 'Smooth & Alert', 'Calm & Clear'],
      'CLUSTER_COMFORT_INDULGENCE': ['Deeply Calm', 'Smooth & Sustained', 'Calm & Clear']
    };
    return profileMap[clusterId] || [];
  }

  /**
   * Render activity recommendations from multiple inference sources
   * @param {Object} inferences - Object with compound, teaType, and flavor analyses
   *   - inferences.compound: Output from CompoundInferrer
   *   - inferences.teaType: Output from TeaTypeInferrer
   *   - inferences.flavor: Output from FlavorInferrer
   * @returns {Object} - Activity recommendations with cluster grouping
   */
  render(inferences) {
    const trace = [];

    // Extract inference data from all sources
    const compoundInf = inferences?.compound;
    const teaTypeInf = inferences?.teaType;
    const flavorInf = inferences?.flavor;

    if (!compoundInf?.analysis) {
      return this._failedRender("No compound inference data provided", trace);
    }

    const compoundAnalysis = compoundInf.analysis;
    const { stimulationLevel, relaxationLevel, compoundProfile } = compoundAnalysis;

    trace.push({
      step: "Data Reception",
      reason: "Received multi-source inferences",
      adjustment: `Compound: ${compoundProfile}, TeaType: ${teaTypeInf?.analysis?.teaType}, Flavor: ${flavorInf?.analysis?.dominantFlavor}`,
      value: "All inferences validated"
    });

    // Collect activity hints from all three sources
    const teaTypeActivityHints = this._getTeaTypeActivityHints(teaTypeInf);
    const flavorActivityHints = this._getFlavorActivityHints(flavorInf);

    trace.push({
      step: "Hint Collection",
      reason: "Extracted activity hints from taxonomy sources",
      adjustment: `TeaType hints: ${teaTypeActivityHints.size}, Flavor hints: ${flavorActivityHints.size}`,
      value: "Hints collected from cultural and sensory sources"
    });

    // Score activities based on three weighted sources
    const activityScores = new Map();

    // Initialize all activities with base score
    this.activityClusters.forEach(cluster => {
      cluster.activities.forEach(activity => {
        activityScores.set(activity, 50); // Base score
      });
    });

    trace.push({
      step: "Scoring Initialization",
      reason: "Set base scores for all activities",
      adjustment: `Initialized ${activityScores.size} activities with base score 50`,
      value: "Ready for three-factor scoring"
    });

    // SCORING FACTOR 1: Flavor Activity Hints (40% - PRIMARY)
    // Flavor drives real-world tea selection through emotional & psychological associations
    let flavorBoosted = 0;
    flavorActivityHints.forEach((count, activity) => {
      const currentScore = activityScores.get(activity) || 0;
      // Strong bonus based on how many flavors suggest this activity
      // Multiple flavor matches indicate strong thematic alignment
      const flavorBonus = (20 + count * 8) * this.config.flavorWeight;
      activityScores.set(activity, currentScore + flavorBonus);
      flavorBoosted++;
    });

    trace.push({
      step: "Flavor Hints Scoring (40% - PRIMARY)",
      reason: "Sensory/emotional/thematic activity suggestions from flavor profile",
      adjustment: `Boosted ${flavorBoosted} activities by +${(20 * this.config.flavorWeight).toFixed(2)} base + multi-flavor multiplier`,
      value: `Flavor-driven emotional associations applied`
    });

    // SCORING FACTOR 2: Compound Profile (35%)
    // Biochemistry tells us IF we want stimulation, but flavor tells us HOW & WHEN
    const profileBonus = this._getProfileBonus(compoundProfile) * this.config.compoundWeight;
    let compoundBoosted = 0;

    this.activityClusters.forEach(cluster => {
      if (cluster.targetProfiles.includes(compoundProfile)) {
        cluster.activities.forEach(activity => {
          const currentScore = activityScores.get(activity) || 0;
          activityScores.set(activity, currentScore + profileBonus);
          compoundBoosted++;
        });
      }
    });

    trace.push({
      step: "Compound Scoring (35%)",
      reason: `Compound profile: ${compoundProfile}`,
      adjustment: `Boosted ${compoundBoosted} activities by +${profileBonus.toFixed(2)}`,
      value: `Biochemical score applied`
    });

    // SCORING FACTOR 3: Stimulation Level (within 35%)
    const stimulationBonus = this._getStimulationBonus(stimulationLevel) * this.config.compoundWeight;
    let stimulationBoosted = 0;

    if (this._isStimulating(stimulationLevel)) {
      const stimulatingThemes = ["Focus & Productivity", "Active & Energetic"];
      this.activityClusters.forEach(cluster => {
        if (stimulatingThemes.includes(cluster.theme)) {
          cluster.activities.forEach(activity => {
            const currentScore = activityScores.get(activity) || 0;
            activityScores.set(activity, currentScore + stimulationBonus);
            stimulationBoosted++;
          });
        }
      });
    } else {
      const relaxingThemes = ["Mindfulness & Relaxation", "Evening Wind-Down"];
      this.activityClusters.forEach(cluster => {
        if (relaxingThemes.includes(cluster.theme)) {
          cluster.activities.forEach(activity => {
            const currentScore = activityScores.get(activity) || 0;
            activityScores.set(activity, currentScore + stimulationBonus);
            stimulationBoosted++;
          });
        }
      });
    }

    trace.push({
      step: "Stimulation Scoring (within 35%)",
      reason: `Stimulation level: ${stimulationLevel}`,
      adjustment: `Boosted ${stimulationBoosted} activities by +${stimulationBonus.toFixed(2)}`,
      value: `Stimulation multiplier applied`
    });

    // SCORING FACTOR 4: Tea Type Activity Hints (25%)
    // Cultural context provides baseline, but individual character comes from flavor
    let teaTypeBoosted = 0;
    teaTypeActivityHints.forEach((activityId, activity) => {
      const currentScore = activityScores.get(activity) || 0;
      const teaTypeBonus = 20 * this.config.teaTypeWeight;
      activityScores.set(activity, currentScore + teaTypeBonus);
      teaTypeBoosted++;
    });

    trace.push({
      step: "Tea Type Hints Scoring (25%)",
      reason: "Cultural/traditional activity associations (baseline context)",
      adjustment: `Boosted ${teaTypeBoosted} activities by +${(20 * this.config.teaTypeWeight).toFixed(2)}`,
      value: `Cultural tradition score applied`
    });

    // Get top activities
    const sortedActivities = Array.from(activityScores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, this.config.maxRecommendations);

    const recommendedActivities = sortedActivities.map(([activity, score]) => {
      const activityObj = this._getActivityObject(activity);
      return {
        activity,
        score: Math.min(100, score),
        description: activityObj?.description || 'A recommended activity',
        rationale: this._getRationale(activity, compoundProfile, stimulationLevel),
        timing: activityObj?.suggestedTiming || 'Flexible timing',
        benefits: activityObj?.benefits || []
      };
    });

    trace.push({
      step: "Final Selection",
      reason: "Selected top activities",
      adjustment: `Selected ${recommendedActivities.length} activities`,
      value: recommendedActivities.map(a => a.activity).join(", ")
    });

    // Cluster recommendations
    const clusters = this._clusterRecommendations(recommendedActivities);

    return {
      // Top recommended activities
      recommendations: recommendedActivities,

      // Grouped by theme
      clusters,

      // Supporting data
      analysis: {
        compoundProfile,
        stimulationLevel,
        relaxationLevel,
        teaType: teaTypeInf?.analysis?.teaType,
        dominantFlavor: flavorInf?.analysis?.dominantFlavor
      },

      // Scoring sources - rebalanced for flavor-driven recommendations
      scoringSources: {
        flavor: {
          weight: this.config.flavorWeight,
          role: "PRIMARY (40%) - Emotional & psychological associations (smoky→creative, floral→calm, etc.)",
          importance: "Drives real-world tea selection and mood-based pairing"
        },
        compound: {
          weight: this.config.compoundWeight,
          role: "SECONDARY (35%) - Biochemical stimulation/relaxation (caffeine/theanine)",
          importance: "Tells us IF we want stimulation, flavor tells us HOW & WHEN"
        },
        teaType: {
          weight: this.config.teaTypeWeight,
          role: "BASELINE (25%) - Cultural/traditional activity associations",
          importance: "Provides context, but individual character comes from flavor"
        }
      },

      // Metadata
      trace,
      confidence: Math.min(1.0, (compoundInf.confidence || 0.85) * 0.9),
      rendererVersion: '2.0'
    };
  }

  // ========== Helper Methods ==========

  /**
   * Get activity object from taxonomy
   */
  _getActivityObject(activityName) {
    // Search through taxonomy for matching activity
    let activityObj = null;
    Object.entries(this.activityTaxonomy.ACTIVITIES).forEach(([id, activity]) => {
      if (activity.displayName === activityName) {
        activityObj = activity;
      }
    });
    return activityObj;
  }

  /**
   * Score bonus based on compound profile
   */
  _getProfileBonus(profile) {
    const bonuses = {
      "Deeply Calm": 25,
      "Calm & Clear": 20,
      "Smooth & Sustained": 20,
      "Smooth & Alert": 15,
      "Balanced & Focused": 20,
      "Focused & Energized": 20,
      "Sharp & Driven": 15,
      "Intense & Sharp": 15
    };
    return bonuses[profile] || 10;
  }

  /**
   * Score bonus based on stimulation level
   */
  _getStimulationBonus(level) {
    const bonuses = {
      "Very High": 25,
      "Very High (Smooth)": 20,
      "High": 20,
      "High (Smooth)": 20,
      "Moderate": 10,
      "Low": 5,
      "Very Low": 2,
      "None": 0
    };
    return bonuses[level] || 10;
  }

  /**
   * Determine if stimulation level is stimulating or relaxing
   */
  _isStimulating(level) {
    return ["Very High", "Very High (Smooth)", "High", "High (Smooth)", "Moderate"].includes(level);
  }

  /**
   * Generate rationale for why an activity is recommended
   */
  _getRationale(activity, profile, stimulation) {
    const rationales = {
      "Meditation": `Perfect for ${profile} profile - encourages mindfulness`,
      "Yoga": `Ideal for ${profile} profile - balances body and mind`,
      "Work": `Great match for ${stimulation} stimulation - supports focus`,
      "Study": `Excellent for ${stimulation} stimulation - enhances concentration`,
      "Creative Writing": `Aligns with ${profile} profile - fosters creative flow`,
      "Social Gatherings": `Good for ${stimulation} stimulation - enhances social energy`,
      "Exercise": `Harnesses ${stimulation} energy - channels natural alertness`,
      "Reading Before Bed": `Perfect for ${profile} profile - gentle wind-down`,
      "Contemplation": `Ideal for ${profile} profile - promotes reflection`,
      "High-Focus Work": `Maximizes ${stimulation} potential - peak productivity`
    };
    return rationales[activity] || `Matches your ${profile} compound profile`;
  }

  /**
   * Group activities by cluster theme
   */
  _clusterRecommendations(recommendations) {
    const activityNames = recommendations.map(r => r.activity);
    const matchedClusters = [];

    this.activityClusters.forEach(cluster => {
      const matches = cluster.activities.filter(a => activityNames.includes(a));
      if (matches.length > 0) {
        matchedClusters.push({
          theme: cluster.theme,
          activities: matches,
          count: matches.length
        });
      }
    });

    return matchedClusters;
  }

  /**
   * Extract activity hints from tea type taxonomy
   * @param {Object} teaTypeInf - Output from TeaTypeInferrer
   * @returns {Map<string, number>} - Map of activity names to hint count
   */
  _getTeaTypeActivityHints(teaTypeInf) {
    const hints = new Map();

    if (!teaTypeInf?.analysis?.teaType) {
      return hints;
    }

    const teaType = teaTypeInf.analysis.teaType;
    const teaTypeObj = this.teaTypeTaxonomy.getType(teaType);

    if (!teaTypeObj?.baseActivityHints || !Array.isArray(teaTypeObj.baseActivityHints)) {
      return hints;
    }

    // Convert activity IDs to display names and count
    teaTypeObj.baseActivityHints.forEach(activityId => {
      const activityObj = this._getActivityObjectById(activityId);
      if (activityObj?.displayName) {
        hints.set(activityObj.displayName, (hints.get(activityObj.displayName) || 0) + 1);
      }
    });

    return hints;
  }

  /**
   * Extract activity hints from flavor profile
   * @param {Object} flavorInf - Output from FlavorInferrer
   * @returns {Map<string, number>} - Map of activity names to hint count (weighted by flavor matches)
   */
  _getFlavorActivityHints(flavorInf) {
    const hints = new Map();

    // FlavorInferrer provides identifiedFlavors, not flavorProfile
    if (!flavorInf?.analysis?.identifiedFlavors || !Array.isArray(flavorInf.analysis.identifiedFlavors)) {
      return hints;
    }

    const flavors = flavorInf.analysis.identifiedFlavors;

    // Collect activity hints from all flavors in the profile
    flavors.forEach(flavorName => {
      const flavorObj = this.flavorTaxonomy.getFlavor(flavorName);

      if (flavorObj?.activityHints && Array.isArray(flavorObj.activityHints)) {
        flavorObj.activityHints.forEach(activityId => {
          const activityObj = this._getActivityObjectById(activityId);
          if (activityObj?.displayName) {
            hints.set(activityObj.displayName, (hints.get(activityObj.displayName) || 0) + 1);
          }
        });
      }
    });

    return hints;
  }

  /**
   * Get activity object from taxonomy by ID
   * @param {string} activityId - Activity ID (e.g., ACTIVITY_RELAXATION)
   * @returns {Object|null} - Activity object or null
   */
  _getActivityObjectById(activityId) {
    return this.activityTaxonomy.ACTIVITIES[activityId] || null;
  }

  /**
   * Return error render when inference fails
   */
  _failedRender(reason, trace) {
    return {
      recommendations: [],
      clusters: [],
      analysis: {
        compoundProfile: "Unknown",
        stimulationLevel: "Unknown",
        relaxationLevel: "Unknown",
        teaType: "Unknown",
        dominantFlavor: "Unknown"
      },
      scoringSources: {
        flavor: { weight: 0.40, role: "PRIMARY - Emotional/sensory associations" },
        compound: { weight: 0.35, role: "SECONDARY - Biochemical" },
        teaType: { weight: 0.25, role: "BASELINE - Cultural context" }
      },
      trace: [{
        step: "Error",
        reason,
        adjustment: "Unable to render recommendations",
        value: "Failed"
      }],
      confidence: 0.0,
      rendererVersion: '2.0'
    };
  }
}
