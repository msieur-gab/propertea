/**
 * rendererRegistry.js
 *
 * Defines the dependencies between Renderers and Inferrers
 * Single source of truth for which analyses are needed for each recommendation type
 *
 * This allows the transport layer to run only necessary inferrers based on requested renderers
 */

export const rendererRegistry = {
  // Activity Recommendations: flavor-driven with compound & tea type context
  // Rebalanced to prioritize emotional/sensory associations over pure biochemistry
  activity: {
    displayName: 'Activity Recommendations',
    requiredInferrers: ['compound', 'teaType', 'flavor'],
    description: 'Flavor-driven recommendations (40% sensory/emotional), compound profile (35% biochemical), tea type tradition (25% cultural baseline). Captures why people really choose teas - flavor creates emotional associations that compound tells us how to experience'
  },

  // Food Pairing: flavor (primary) + compound (astringency) + tea type (specific templates)
  food: {
    displayName: 'Food Pairings',
    requiredInferrers: ['flavor', 'compound', 'teaType'],
    description: 'Suggests food pairings based on flavor (complementary), compound profile (astringency awareness), and tea type (specific templates). Higher confidence for tea-specific pairings.'
  },

  // Time of Day: needs compound + tea type (cultural traditions)
  time: {
    displayName: 'Time of Day',
    requiredInferrers: ['compound', 'teaType'],
    description: 'Suggests optimal times based on compound profile (85%) + tea type cultural tradition (15%)'
  },

  // Seasonal Recommendations: tea type + processing + geography for altitude awareness
  // Tier 1 (60%): Tea type seasonal affinity
  // Tier 2 (40%): Processing method seasonal affinity
  // Tier 3 (±15% modifier): Geographic/altitude awareness - high-mountain = extended spring, low-elevation = autumn focus
  season: {
    displayName: 'Seasonal Recommendations',
    requiredInferrers: ['teaType', 'processing', 'geography'],
    description: 'Suggests seasons based on tea type (60%), processing (40%), and geographic altitude (±15% modifier). High-mountain teas have extended spring seasons; low-elevation teas emphasize autumn/winter'
  },

  // Brewing Method: needs tea type + processing + geography + compound for full optimization
  brewing: {
    displayName: 'Brewing Recommendations',
    requiredInferrers: ['teaType', 'processing', 'geography', 'compound'],
    description: 'Suggests brewing parameters adjusted for processing (roast, oxidation), geography (altitude), and compound profile (astringency)'
  },

  // Terroir Presentation: needs geography + tea type (+ optional compound and flavor for context)
  terroir: {
    displayName: 'Terroir Presentation',
    requiredInferrers: ['geography', 'teaType'],
    description: 'Narrative presentation of geographic origin and environmental influence on tea properties'
  }
};

/**
 * All available inferrers in the system
 */
export const inferrersAvailable = {
  compound: {
    displayName: 'Compound Analysis',
    inputs: ['caffeineLevel', 'lTheanineLevel']
  },
  flavor: {
    displayName: 'Flavor Analysis',
    inputs: ['flavorProfile']
  },
  teaType: {
    displayName: 'Tea Type Analysis',
    inputs: ['type', 'subType']
  },
  geography: {
    displayName: 'Geography Analysis',
    inputs: ['geography']
  },
  processing: {
    displayName: 'Processing Analysis',
    inputs: ['processingMethods']
  }
};

/**
 * Get required inferrers for a set of renderers
 * @param {string[]} rendererNames - Names of requested renderers
 * @returns {Set<string>} - Set of required inferrer names
 */
export function getRequiredInferrers(rendererNames) {
  const required = new Set();

  if (!Array.isArray(rendererNames)) {
    rendererNames = [rendererNames];
  }

  rendererNames.forEach(name => {
    const renderer = rendererRegistry[name];
    if (renderer && Array.isArray(renderer.requiredInferrers)) {
      renderer.requiredInferrers.forEach(inferrer => {
        required.add(inferrer);
      });
    }
  });

  return required;
}

/**
 * Get all inferrer names needed for trace output
 * @param {string[]} rendererNames - Names of requested renderers
 * @returns {string[]} - Array of inferrer names needed for analysis output
 */
export function getTraceInferrerNames(rendererNames) {
  return Array.from(getRequiredInferrers(rendererNames));
}

/**
 * Validate that all requested renderers are available
 * @param {string[]} rendererNames - Names of requested renderers
 * @throws {Error} - If any renderer is unknown
 */
export function validateRenderers(rendererNames) {
  const invalid = rendererNames.filter(name => !rendererRegistry[name]);
  if (invalid.length > 0) {
    throw new Error(
      `Unknown renderers: ${invalid.join(', ')}\n` +
      `Available: ${Object.keys(rendererRegistry).join(', ')}`
    );
  }
}
