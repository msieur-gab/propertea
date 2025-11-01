/**
 * ActivityRenderer.js
 *
 * Purpose: Render activity recommendations based on compound inference
 * Input: CompoundInferrer output { analysis: { stimulationLevel, relaxationLevel, compoundProfile } }
 * Output: Activity recommendations with confidence and reasoning
 *
 * This Renderer uses the Unified Taxonomy System (ActivityTaxonomy) for activity definitions
 * and organization, replacing hardcoded activity lists with dynamic registry data
 */

import { ActivityTaxonomy } from '../../taxonomies/index.js';

export class ActivityRenderer {
  constructor(config = {}) {
    this.config = {
      clusterThreshold: config.clusterThreshold || 70,
      maxRecommendations: config.maxRecommendations || 3,
      ...config
    };

    this.activityTaxonomy = ActivityTaxonomy;

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
   * Render activity recommendations from compound inference
   * @param {Object} compoundInference - Output from CompoundInferrer
   * @returns {Object} - Activity recommendations with cluster grouping
   */
  render(compoundInference) {
    const trace = [];

    // Extract inference data
    if (!compoundInference?.analysis) {
      return this._failedRender("No compound inference data provided", trace);
    }

    const analysis = compoundInference.analysis;
    const { stimulationLevel, relaxationLevel, compoundProfile } = analysis;

    trace.push({
      step: "Data Reception",
      reason: "Received compound inference",
      adjustment: `Profile: ${compoundProfile}, Stimulation: ${stimulationLevel}, Relaxation: ${relaxationLevel}`,
      value: "Inference validated"
    });

    // Score activities based on compound profile
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
      value: "Ready for profile matching"
    });

    // Score based on compound profile
    const profileBonus = this._getProfileBonus(compoundProfile);
    let boostedActivities = 0;

    this.activityClusters.forEach(cluster => {
      if (cluster.targetProfiles.includes(compoundProfile)) {
        cluster.activities.forEach(activity => {
          const currentScore = activityScores.get(activity) || 0;
          activityScores.set(activity, currentScore + profileBonus);
          boostedActivities++;
        });
      }
    });

    trace.push({
      step: "Profile Matching",
      reason: `Compound profile: ${compoundProfile}`,
      adjustment: `Boosted ${boostedActivities} activities by +${profileBonus}`,
      value: `Profile score applied`
    });

    // Score based on stimulation level
    const stimulationBonus = this._getStimulationBonus(stimulationLevel);
    let stimulationBoosted = 0;

    if (this._isStimulating(stimulationLevel)) {
      // Boost stimulating activities
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
      // Boost relaxing activities
      const relaxingThemes = ["Mindfulness & Relaxation", "Evening Wind-Down", "Contemplative & Reflective"];
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
      step: "Stimulation Scoring",
      reason: `Stimulation level: ${stimulationLevel}`,
      adjustment: `Boosted ${stimulationBoosted} activities by +${stimulationBonus}`,
      value: `Stimulation score applied`
    });

    // Get top activities
    const sortedActivities = Array.from(activityScores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, this.config.maxRecommendations);

    const recommendedActivities = sortedActivities.map(([activity, score]) => ({
      activity,
      score: Math.min(100, score),
      rationale: this._getRationale(activity, compoundProfile, stimulationLevel)
    }));

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
        relaxationLevel
      },

      // Metadata
      trace,
      confidence: compoundInference.confidence || 0.85,
      rendererVersion: '1.0'
    };
  }

  // ========== Helper Methods ==========

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
   * Return error render when inference fails
   */
  _failedRender(reason, trace) {
    return {
      recommendations: [],
      clusters: [],
      analysis: {
        compoundProfile: "Unknown",
        stimulationLevel: "Unknown",
        relaxationLevel: "Unknown"
      },
      trace: [{
        step: "Error",
        reason,
        adjustment: "Unable to render recommendations",
        value: "Failed"
      }],
      confidence: 0.0,
      rendererVersion: '1.0'
    };
  }
}
