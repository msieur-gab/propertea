/**
 * rendererRegistry.js
 *
 * Defines the dependencies between Renderers and Inferrers
 * Single source of truth for which analyses are needed for each recommendation type
 *
 * This allows the transport layer to run only necessary inferrers based on requested renderers
 */

export const rendererRegistry = {
  // Activity Recommendations: needs compound analysis (caffeine/theanine levels)
  activity: {
    displayName: 'Activity Recommendations',
    requiredInferrers: ['compound'],
    description: 'Suggests activities based on caffeine/theanine stimulation profile'
  },

  // Food Pairing: needs flavor analysis
  food: {
    displayName: 'Food Pairings',
    requiredInferrers: ['flavor'],
    description: 'Suggests food pairings based on flavor profile'
  },

  // Time of Day: needs compound analysis
  time: {
    displayName: 'Time of Day',
    requiredInferrers: ['compound'],
    description: 'Suggests optimal times to drink based on caffeine content'
  },

  // Seasonal Recommendations: needs tea type + processing only (tea's intrinsic nature)
  season: {
    displayName: 'Seasonal Recommendations',
    requiredInferrers: ['teaType', 'processing'],
    description: 'Suggests seasons based on tea type and processing method'
  },

  // Brewing Method: needs tea type
  brewing: {
    displayName: 'Brewing Recommendations',
    requiredInferrers: ['teaType'],
    description: 'Suggests brewing methods based on tea type'
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
