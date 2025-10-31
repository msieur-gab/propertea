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
  effectCombinations,
  flavorInfluences,
  teaTypeDescriptors,
  processingInfluences,
  seasonalDescriptions,
  seasonalProfiles
} from '../descriptors/index.js';

export class ContentGenerationService {
  constructor() {
    this.effectMapping = effectMapping;
    this.effectCombinations = effectCombinations;
    this.teaTypeDescriptors = teaTypeDescriptors;
  }

  /**
   * Get effect description from mapping with context
   */
  getEffectDescription(effectName, context = {}) {
    const effect = this.effectMapping[effectName];
    if (!effect) return `This tea has ${effectName} properties`;

    let description = effect.description;

    // Add contextual enhancements
    if (context.caffeineLevel === 'High' && effectName === 'energizing') {
      description = 'Delivers robust mental and physical energy with smooth activation';
    } else if (context.caffeineLevel === 'Low' && effectName === 'energizing') {
      description = 'Provides gentle, sustained vitality without overstimulation';
    } else if (context.lTheanineLevel === 'High' && effectName === 'calming') {
      description = 'Creates profound relaxation and mental clarity simultaneously';
    } else if (context.lTheanineLevel === 'High' && effectName === 'focusing') {
      description = 'Enhances concentration with a calm, meditative quality';
    }

    return description;
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

    // Get seasonal explanation based on tea type
    let explanation = '';
    if (topSeasons.length > 0) {
      const teaTypeInfo = this.teaTypeDescriptors[teaType]?.base || {};
      const seasonalTendency = teaTypeInfo.seasonalTendency || 'neutral';
      const primarySeason = topSeasons[0].fourSeason;

      // Create explanation based on tea type and primary season
      if (seasonalTendency === 'cooling') {
        explanation = `This cooling ${teaType} tea is perfectly suited for ${primarySeason} enjoyment. Its refreshing character aligns beautifully with the season's energy.`;
      } else if (seasonalTendency === 'warming') {
        explanation = `This warming ${teaType} tea is ideal for ${primarySeason}, offering comfort and depth during the season. Perfect for cozy moments.`;
      } else {
        explanation = `This ${teaType} tea shines in ${primarySeason}, adapting beautifully to the season's character and mood.`;
      }
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
   * Generate food pairing explanation with flavor context
   */
  generateFoodNarrative(foodPairings, flavorProfile, teaType = '') {
    if (!foodPairings || (Array.isArray(foodPairings) && foodPairings.length === 0)) {
      return {
        summary: 'Versatile with various cuisines',
        explanation: 'This tea adapts beautifully to different foods and occasions',
        pairings: [],
        pairingLogic: 'Universal compatibility'
      };
    }

    const topPairings = Array.isArray(foodPairings)
      ? foodPairings.slice(0, 5)
      : Object.entries(foodPairings)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([food]) => food);

    let explanation = '';
    let pairingLogic = 'Complementary flavors';

    // Enhanced flavor-based explanation
    if (flavorProfile && flavorProfile.length > 0) {
      const mainFlavors = flavorProfile.slice(0, 2);
      const flavorStr = mainFlavors.join(' and ');

      if (mainFlavors.some(f => ['floral', 'fruity', 'sweet'].includes(f))) {
        explanation = `The delicate ${flavorStr} character of this tea pairs beautifully with light desserts, fresh fruits, and delicate proteins. The subtle sweetness complements rather than competes with food.`;
        pairingLogic = 'Subtle flavors enhance lighter dishes';
      } else if (mainFlavors.some(f => ['roasted', 'woody', 'earthy'].includes(f))) {
        explanation = `The robust ${flavorStr} profile stands up well to hearty foods, grilled proteins, and rich flavors. This tea brings depth and complexity to the meal.`;
        pairingLogic = 'Bold flavors balance rich foods';
      } else if (mainFlavors.some(f => ['creamy', 'honey', 'smooth'].includes(f))) {
        explanation = `The smooth, ${flavorStr} notes create harmony with both delicate and rich foods. It acts as a pleasant palate cleanser while enhancing flavors.`;
        pairingLogic = 'Smooth texture bridges diverse foods';
      } else {
        explanation = `The ${flavorStr} notes create an elegant pairing experience, enhancing the natural flavors of complementary dishes.`;
      }
    } else {
      explanation = 'This tea provides excellent balance with a wide range of foods, cleansing the palate while enhancing flavors.';
    }

    return {
      summary: `Pairs beautifully with ${topPairings.slice(0, 2).join(', ')}, and more`,
      explanation: explanation,
      recommendedFoods: topPairings.slice(0, 4),
      pairingLogic: pairingLogic,
      mealOccasions: this.getMealOccasionsForTea(teaType)
    };
  }

  /**
   * Get meal occasions suitable for tea type
   */
  getMealOccasionsForTea(teaType) {
    const occasions = {
      'green': ['Breakfast', 'Mid-morning snack', 'Afternoon tea', 'Light lunch'],
      'white': ['Breakfast', 'Afternoon relaxation', 'Evening wind-down', 'After-dinner'],
      'oolong': ['Morning ritual', 'Afternoon social tea', 'Post-meal', 'Evening contemplation'],
      'black': ['Morning boost', 'Breakfast companion', 'Afternoon pick-me-up', 'Social gathering'],
      'puerh': ['Afternoon digestive', 'Post-meal', 'Evening contemplation', 'Social occasion'],
      'yellow': ['Anytime enjoyment', 'Casual afternoon', 'Social gathering', 'Relaxation moment'],
      'red': ['Morning energy', 'Afternoon social', 'Post-meal digestive', 'Evening warming'],
      'dark': ['After-meal digestive', 'Evening warming', 'Grounding moment', 'Social tea time'],
      'herbal': ['Anytime', 'Wellness focus', 'Relaxation', 'Evening routine'],
      'tisane': ['Anytime', 'Wellness ritual', 'Calm moment', 'Before bed']
    };
    return occasions[teaType] || ['Anytime', 'Social occasion', 'Quiet moment', 'Meal pairing'];
  }

  /**
   * Generate activity recommendation narrative with effect context
   */
  generateActivityNarrative(activities, effects, teaType = '') {
    if (!activities || (Array.isArray(activities) && activities.length === 0)) {
      return {
        summary: 'Suitable for any occasion',
        explanation: 'This tea adapts gracefully to diverse contexts and moments',
        suggestions: [],
        context: 'Versatile companion'
      };
    }

    const topActivities = Array.isArray(activities)
      ? activities.slice(0, 4)
      : Object.entries(activities)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 4)
          .map(([activity]) => activity);

    let explanation = '';
    let context = '';

    // Build narrative based on effect profile
    if (effects && effects.dominant) {
      const dominant = effects.dominant;
      const supporting = effects.supporting;

      if (dominant === 'calming' || dominant === 'harmonizing') {
        explanation = `This tea excels during moments of reflection, meditation, and personal contemplation. Its ${supporting || 'balanced'} nature creates the perfect environment for unwinding, journaling, or peaceful solitude. Ideal for evening rituals and transition moments.`;
        context = 'For calm, reflective moments';
      } else if (dominant === 'energizing' || dominant === 'focusing') {
        explanation = `Perfect for productive work, study sessions, and focused activities that demand mental clarity. This tea delivers sustained energy without the jittery edge, making it ideal for creative projects, problem-solving, and deep work. It also shines during social gatherings where mental presence matters.`;
        context = 'For focus and productive energy';
      } else if (dominant === 'elevating') {
        explanation = `This tea is excellent for uplifting moments—when you need a mood boost, during social gatherings, or when embarking on creative endeavors. Its ${supporting || 'positive'} character makes it perfect for celebration, inspiration, and moments of joy.`;
        context = 'For elevating and joyful moments';
      } else if (dominant === 'grounding') {
        explanation = `This tea provides stability and connection, making it perfect for grounding practices, contemplative walks, or moments when you need to feel centered. Excellent for yoga, tai chi, or any practice that benefits from deep presence and stability.`;
        context = 'For grounding and centering';
      } else {
        explanation = `This tea brings ${dominant} qualities to your moment. Whether you're working, relaxing, or socializing, it adapts to enhance your experience with its unique character.`;
        context = `For moments benefiting from ${dominant} energy`;
      }
    }

    return {
      summary: `Perfect for ${topActivities[0] || 'focused moments'}`,
      explanation: explanation,
      suggestions: topActivities.slice(0, 3),
      context: context,
      bestFor: topActivities.slice(0, 2)
    };
  }

  /**
   * Generate overall summary narrative
   */
  generateOverallSummary(teaModel, analysis) {
    const type = teaModel.type;
    const typeDescriptor = this.teaTypeDescriptors[type]?.base?.description || '';

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
   * Generate brewing guidance with temperature, steeping time, and tips
   */
  generateBrewingGuidance(teaModel, analysis = {}) {
    const type = teaModel.type || 'green';

    // Extract caffeine level from compounds data if available
    let caffeine = teaModel.caffeineLevel || 0;
    if (!caffeine && analysis.compounds && analysis.compounds.caffeine) {
      caffeine = parseInt(analysis.compounds.caffeine.level) || 0;
    }

    // Tea-type specific brewing parameters
    const brewingParams = {
      'green': {
        temperature: '160-180°F (70-80°C)',
        time: '2-3 minutes',
        reinfusions: '3-5 times',
        tips: 'Use lower temperatures to preserve delicate flavors and prevent bitterness. Rinse leaves briefly before first infusion for optimal flavor clarity.',
        storage: 'Keep in an airtight container away from light and strong odors. Store in a cool place for maximum freshness.'
      },
      'white': {
        temperature: '160-170°F (70-75°C)',
        time: '3-5 minutes',
        reinfusions: '2-3 times',
        tips: 'The gentlest brewing approach—use cooler water to highlight subtle, sweet notes. White teas reward patience and exploration with each infusion.',
        storage: 'Highly sensitive to odors and light. Use opaque, airtight storage and consume within 1-2 years for best quality.'
      },
      'yellow': {
        temperature: '160-180°F (70-80°C)',
        time: '3-5 minutes',
        reinfusions: '3-4 times',
        tips: 'Similar to green tea but with a slightly higher temperature tolerance. The "resting" phase during processing creates unique, mellow characteristics.',
        storage: 'Store in an airtight, opaque container. Yellow teas maintain quality for 1-2 years with proper storage.'
      },
      'oolong': {
        temperature: '195-210°F (90-99°C)',
        time: '3-7 minutes (varies by style)',
        reinfusions: '5-8+ times',
        tips: 'Oolongs shine with multiple infusions—each reveals new flavor dimensions. The first infusion can be quick ("rinse") to fully open the leaves.',
        storage: 'Store in an airtight container away from heat and odors. Roasted oolongs age beautifully and improve over time.'
      },
      'black': {
        temperature: '200-212°F (93-100°C)',
        time: '3-5 minutes',
        reinfusions: '2-3 times',
        tips: 'Full boiling water brings out bold, robust character. Black teas are forgiving and can handle longer steeping without becoming overly bitter.',
        storage: 'Store in an airtight container. Black teas are stable and maintain quality for 2-3 years or longer.'
      },
      'red': {
        temperature: '195-212°F (90-100°C)',
        time: '3-5 minutes',
        reinfusions: '2-3 times',
        tips: 'Hot water releases the full spectrum of warming, comforting characteristics. Red teas offer natural sweetness without added ingredients.',
        storage: 'Keep in an airtight container in a cool, dry place. Red teas maintain quality for 2-3 years.'
      },
      'dark': {
        temperature: '200-212°F (93-100°C)',
        time: '4-6 minutes',
        reinfusions: '3-5 times',
        tips: 'Dark teas can handle bold brewing and extended steeping. Their deep, earthy character becomes more pronounced with hotter water and longer times.',
        storage: 'Excellent for aging. Store in a cool, dry place; dark teas can improve and develop complexity over many years.'
      },
      'puerh': {
        temperature: '200-212°F (93-100°C)',
        time: '5-10 minutes (first infusion longer)',
        reinfusions: '8-15+ times',
        tips: 'Puerh appreciates a quick rinse with hot water to awaken aged leaves. Each infusion reveals layers of flavor. Can be re-steeped until flavor fades completely.',
        storage: 'Store in a cool, dry place with good air circulation. Puerh improves with age—proper storage allows oxidative aging that enhances character.'
      },
      'herbal': {
        temperature: '200-212°F (93-100°C)',
        time: '5-10 minutes',
        reinfusions: '1-2 times',
        tips: 'Herbal infusions benefit from hotter water and longer steeping to fully extract beneficial properties. No caffeine concerns—perfect for evening enjoyment.',
        storage: 'Store dried herbs away from light and moisture. Keep in airtight containers. Most herbal blends remain fresh for 1-2 years.'
      },
      'tisane': {
        temperature: '200-212°F (93-100°C)',
        time: '5-10 minutes',
        reinfusions: '1-2 times',
        tips: 'Allow longer steeping than traditional tea to extract full benefit. Tisanes are caffeine-free and perfect for any time of day wellness moments.',
        storage: 'Store in airtight containers away from moisture and direct sunlight. Maintain freshness for 1-2 years.'
      }
    };

    const params = brewingParams[type] || brewingParams['green'];

    // Generate warnings based on characteristics
    let warnings = [];
    if (caffeine >= 50) {
      warnings.push('High caffeine content—ideal for morning or afternoon, but may affect sleep if consumed close to bedtime.');
    }
    if (type === 'black' || type === 'red' || type === 'dark') {
      warnings.push('Strong astringency possible with over-steeping. Start with shorter times and adjust to preference.');
    }
    if (['green', 'white', 'yellow'].includes(type)) {
      warnings.push('Delicate leaves are best enjoyed fresh. Consume within 6-12 months of purchase for optimal flavor and aroma.');
    }

    return {
      summary: `Brew at ${params.temperature} for ${params.time}`,
      temperature: params.temperature,
      steepingTime: params.time,
      reinfusions: params.reinfusions,
      tips: params.tips,
      storage: params.storage,
      warnings: warnings.length > 0 ? warnings : null,
      detailedGuide: `To prepare: Use fresh, filtered water heated to ${params.temperature}. Steep for ${params.time}. This tea can be re-steeped ${params.reinfusions}. ${params.tips}`
    };
  }

  /**
   * Enrich analysis with readable content
   */
  enrich(teaModel, analysis) {
    if (!analysis) {
      return analysis;
    }

    const enriched = { ...analysis };

    // Enrich effects
    if (enriched.effects) {
      // Extract dominant and supporting from various possible formats
      let dominant = null;
      let supporting = null;

      // Format 1: expectedEffects object with dominant/supporting strings
      if (enriched.effects.expectedEffects) {
        dominant = enriched.effects.expectedEffects.dominant;
        supporting = enriched.effects.expectedEffects.supporting;
      }
      // Format 2: Direct dominant/supporting properties (strings)
      else if (typeof enriched.effects.dominant === 'string') {
        dominant = enriched.effects.dominant;
        supporting = enriched.effects.supporting;
      }
      // Format 3: Object format with .name property
      else if (enriched.effects.dominant?.name) {
        dominant = enriched.effects.dominant.name;
        supporting = enriched.effects.supporting?.name;
      }

      // Only enrich if we have valid dominant and supporting effects
      if (dominant && supporting) {
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
      const foodData = enriched.food.recommendedFoods
        || enriched.food.recommendations
        || enriched.food;
      enriched.food = {
        ...enriched.food,
        narrative: this.generateFoodNarrative(
          foodData,
          teaModel.flavorProfile
        )
      };
    }

    // Enrich activities
    if (enriched.activities) {
      const activityData = enriched.activities.recommendedActivities
        || enriched.activities.suggestions
        || enriched.activities;
      enriched.activities = {
        ...enriched.activities,
        narrative: this.generateActivityNarrative(
          activityData,
          enriched.effects
        )
      };
    }

    // Add overall summary
    enriched.summary = this.generateOverallSummary(teaModel, analysis);

    // Add brewing guidance (with analysis data for compound information)
    enriched.brewingGuidance = this.generateBrewingGuidance(teaModel, analysis);

    return enriched;
  }
}

export const contentGenerationService = new ContentGenerationService();
