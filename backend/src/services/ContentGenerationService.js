/**
 * ContentGenerationService.js
 *
 * Converts raw tea analysis data into human-readable narratives using descriptors.
 * Uses reference files to generate contextual explanations for:
 * - Effects (dominant and supporting with combination names)
 * - Timing recommendations (converting hours to readable schedules)
 * - Seasonal suitability (with 12-season to 4-season mapping)
 * - Food pairing explanations
 * - Activity context
 */

import {
  effectMapping,
  teaTypeEffects,
  effectInteractionRules,
  effectCombinations
} from '../descriptors/index.js';
import {
  flavorInfluences,
  flavorToPrimaryEffects
} from '../descriptors/index.js';
import {
  teaTypeDescriptors
} from '../descriptors/index.js';
import {
  processingInfluences
} from '../descriptors/index.js';
import {
  seasonalFactors
} from '../descriptors/index.js';

export class ContentGenerationService {
  constructor() {
    this.effectMapping = effectMapping;
    this.effectCombinations = effectCombinations;
    this.teaTypeDescriptors = teaTypeDescriptors;
  }

  /**
   * Get effect description from mapping
   */
  getEffectDescription(effectName) {
    const effect = this.effectMapping[effectName];
    return effect ? effect.description : `This tea has ${effectName} properties`;
  }

  /**
   * Get combination name and description from dominant and supporting effects
   */
  getEffectCombination(dominant, supporting) {
    const combinationKey = `${dominant}+${supporting}`;
    const combination = effectCombinations[combinationKey];

    if (combination) {
      return {
        name: combination.name,
        description: combination.description
      };
    }

    return {
      name: `${dominant.charAt(0).toUpperCase() + dominant.slice(1)} & ${supporting.charAt(0).toUpperCase() + supporting.slice(1)}`,
      description: `A balanced blend of ${dominant} and ${supporting} effects`
    };
  }

  /**
   * Convert 24-hour format to readable time-of-day description
   */
  hourToTimeOfDay(hour) {
    if (hour >= 6 && hour <= 8) return 'Early Morning';
    if (hour >= 9 && hour <= 11) return 'Late Morning';
    if (hour >= 12 && hour <= 13) return 'Early Afternoon';
    if (hour >= 14 && hour <= 16) return 'Afternoon';
    if (hour >= 17 && hour <= 19) return 'Early Evening';
    if (hour >= 20 && hour <= 23) return 'Evening';
    return 'Night';
  }

  /**
   * Generate timing recommendation narrative
   */
  generateTimingNarrative(timing, teaModel) {
    if (!timing || !timing.recommendedTimes) {
      return "Suitable throughout the day";
    }

    const recommendedHours = timing.recommendedTimes.slice(0, 3);
    const timeLabels = recommendedHours.map(t => this.hourToTimeOfDay(t.hour));
    const uniqueLabels = [...new Set(timeLabels)];

    const scheduleText = uniqueLabels.join(', ');

    let explanation = '';
    const caffeine = teaModel.caffeineLevel || 0;
    const theanine = teaModel.lTheanineLevel || 0;
    const ratio = caffeine > 0 ? theanine / caffeine : 0;

    if (ratio >= 1.5) {
      explanation = `The high L-theanine content promotes calm focus, making this ideal for times when you need sustained concentration without jitters.`;
    } else if (ratio >= 0.8) {
      explanation = `The balanced caffeine-theanine ratio provides smooth, sustained energy perfect for focus and mental clarity throughout your chosen times.`;
    } else {
      explanation = `The higher caffeine content delivers invigorating energy, making this perfect for early-day consumption or when you need mental alertness.`;
    }

    return {
      summary: `Best enjoyed ${scheduleText}`,
      explanation: explanation,
      detailedTimes: timing.recommendedTimes.map(t => ({
        hour: t.hour,
        timeOfDay: this.hourToTimeOfDay(t.hour),
        score: t.score
      }))
    };
  }

  /**
   * Map 12-season system to 4-season descriptions
   */
  twelveSeasonToFourSeason(seasonName) {
    const mapping = {
      'Early Spring': 'spring',
      'Spring': 'spring',
      'Late Spring': 'spring',
      'Early Summer': 'summer',
      'Summer': 'summer',
      'Late Summer': 'summer',
      'Early Autumn': 'fall',
      'Autumn': 'fall',
      'Late Autumn': 'fall',
      'Early Winter': 'winter',
      'Winter': 'winter',
      'Late Winter': 'winter'
    };
    return mapping[seasonName] || 'any season';
  }

  /**
   * Generate seasonal recommendation narrative
   */
  generateSeasonalNarrative(seasonal, teaType) {
    if (!seasonal || Object.keys(seasonal).length === 0) {
      return {
        summary: 'Enjoyable throughout the year',
        explanation: 'This tea adapts well to all seasons',
        bestSeasons: ['Spring', 'Summer', 'Autumn', 'Winter'],
        seasonalDetails: []
      };
    }

    // Get top 2-3 seasons
    const topSeasons = Object.entries(seasonal)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([season, score]) => ({
        season,
        score,
        fourSeason: this.twelveSeasonToFourSeason(season)
      }));

    const bestFourSeasons = [...new Set(topSeasons.map(s => s.fourSeason))];

    // Get seasonal descriptors
    const descriptor = this.teaTypeDescriptors.seasonalCharacteristics[teaType] || {};

    let explanation = '';
    if (topSeasons.length > 0) {
      const seasonName = topSeasons[0].fourSeason;
      explanation = descriptor[seasonName] || `This tea shines in ${seasonName}`;
    }

    return {
      summary: `Best enjoyed in ${bestFourSeasons.join(', ')}`,
      explanation: explanation,
      bestSeasons: topSeasons.map(s => s.season),
      seasonalDetails: topSeasons,
      fourSeasonMapping: bestFourSeasons
    };
  }

  /**
   * Generate food pairing explanation
   */
  generateFoodNarrative(foodPairings, flavorProfile) {
    if (!foodPairings || foodPairings.length === 0) {
      return {
        summary: 'Versatile with various cuisines',
        explanation: 'This tea pairs well with many different foods',
        pairings: []
      };
    }

    const topPairings = Array.isArray(foodPairings)
      ? foodPairings.slice(0, 4)
      : Object.entries(foodPairings)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 4)
          .map(([food]) => food);

    let explanation = 'This tea complements a variety of foods beautifully. ';

    if (flavorProfile && flavorProfile.length > 0) {
      const flavorCount = Math.min(2, flavorProfile.length);
      const mainFlavors = flavorProfile.slice(0, flavorCount);
      explanation += `The ${mainFlavors.join(' and ')} notes pair particularly well with complementary dishes.`;
    }

    return {
      summary: `Pairs well with ${topPairings.slice(0, 2).join(', ')}`,
      explanation: explanation,
      recommendedFoods: topPairings
    };
  }

  /**
   * Generate activity recommendation narrative
   */
  generateActivityNarrative(activities, effects) {
    if (!activities || activities.length === 0) {
      return {
        summary: 'Suitable for any occasion',
        explanation: 'This tea adapts to any social or personal context',
        suggestions: []
      };
    }

    const topActivities = Array.isArray(activities)
      ? activities.slice(0, 3)
      : Object.entries(activities)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 3)
          .map(([activity]) => activity);

    let explanation = 'This tea is perfect for: ';

    if (effects && effects.dominant) {
      if (effects.dominant === 'calming' || effects.dominant === 'harmonizing') {
        explanation += 'moments of reflection and relaxation. ';
      } else if (effects.dominant === 'energizing' || effects.dominant === 'focusing') {
        explanation += 'productive work or focused tasks. ';
      } else {
        explanation += `activities that benefit from ${effects.dominant} energy. `;
      }
    }

    explanation += `Consider enjoying it during ${topActivities[0] || 'your preferred activities'}.`;

    return {
      summary: `Perfect for ${topActivities[0] || 'any activity'}`,
      explanation: explanation,
      suggestions: topActivities
    };
  }

  /**
   * Generate overall summary narrative
   */
  generateOverallSummary(teaModel, analysis) {
    const type = teaModel.type;
    const typeDescriptor = this.teaTypeDescriptors.generalDescriptions[type] || '';

    let summary = `${teaModel.name} is a ${type} tea. ${typeDescriptor}\n\n`;

    if (analysis.effects && analysis.effects.dominant && analysis.effects.supporting) {
      const dominantDesc = this.getEffectDescription(analysis.effects.dominant);
      const supportingDesc = this.getEffectDescription(analysis.effects.supporting);

      summary += `It offers ${analysis.effects.dominant} and ${analysis.effects.supporting} effects: `;
      summary += `${dominantDesc.toLowerCase()} while also ${supportingDesc.toLowerCase()}.`;
    }

    return summary;
  }

  /**
   * Enrich analysis with readable content
   */
  enrich(teaModel, analysis) {
    if (!analysis || !analysis.success) {
      return analysis;
    }

    const enriched = { ...analysis };

    // Enrich effects
    if (enriched.effects) {
      const dominant = enriched.effects.dominant;
      const supporting = enriched.effects.supporting;

      enriched.effects = {
        ...enriched.effects,
        dominant: {
          name: dominant,
          description: this.getEffectDescription(dominant)
        },
        supporting: {
          name: supporting,
          description: this.getEffectDescription(supporting)
        },
        combination: this.getEffectCombination(dominant, supporting)
      };
    }

    // Enrich timing
    if (enriched.timing) {
      enriched.timing = {
        ...enriched.timing,
        narrative: this.generateTimingNarrative(enriched.timing, teaModel)
      };
    }

    // Enrich seasonal
    if (enriched.seasonal) {
      enriched.seasonal = {
        ...enriched.seasonal,
        narrative: this.generateSeasonalNarrative(enriched.seasonal, teaModel.type)
      };
    }

    // Enrich food
    if (enriched.food) {
      enriched.food = {
        ...enriched.food,
        narrative: this.generateFoodNarrative(
          enriched.food.recommendedFoods || enriched.food,
          teaModel.flavorProfile
        )
      };
    }

    // Enrich activities
    if (enriched.activities) {
      enriched.activities = {
        ...enriched.activities,
        narrative: this.generateActivityNarrative(
          enriched.activities.recommendedActivities || enriched.activities,
          enriched.effects
        )
      };
    }

    // Add overall summary
    enriched.summary = this.generateOverallSummary(teaModel, analysis);

    return enriched;
  }
}

export const contentGenerationService = new ContentGenerationService();
