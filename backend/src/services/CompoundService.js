/**
 * CompoundService.js
 *
 * Analyzes chemical compounds (caffeine & L-theanine) in tea
 * Extracted from: js/calculators/CompoundCalculator.js
 *
 * Input: TeaModel with caffeineLevel and lTheanineLevel
 * Output: Structured analysis with levels, ratios, and descriptions
 */

// --- Helper Functions ---

function determineRatioCategory(ratio) {
  if (ratio <= 0) return 'N/A';
  if (ratio >= 2.0) return 'Theanine Dominant (>=2.0)';
  if (ratio >= 1.5 && ratio < 2.0) return 'Theanine Leaning (1.5 to <2.0)';
  if (ratio >= 0.8) return 'Balanced (0.8-1.5)';
  if (ratio >= 0.5) return 'Caffeine Leaning (0.5-0.8)';
  return 'Caffeine Dominant (<0.5)';
}

function determineStimulatingEffect(caffeineLevel, theanineLevel) {
  if (caffeineLevel <= 0) return 'None';
  if (caffeineLevel <= 1.5) return 'Very Low';
  if (caffeineLevel <= 3.5) return 'Low';
  if (caffeineLevel <= 5.5) return 'Moderate';
  if (caffeineLevel <= 7.5) {
    if (theanineLevel >= 5.5) {
      return 'High (Smooth)';
    } else {
      return 'High';
    }
  }
  if (theanineLevel >= 7.5) {
    return 'Very High (Smooth)';
  } else {
    return 'Very High';
  }
}

function determineRelaxingEffect(theanineLevel) {
  if (theanineLevel <= 0) return 'None';
  if (theanineLevel <= 1.5) return 'Very Low';
  if (theanineLevel <= 3.5) return 'Low';
  if (theanineLevel <= 5.5) return 'Moderate';
  if (theanineLevel <= 7.5) return 'High';
  return 'Very High';
}

function determineCompoundProfile(stimulatingEffect, relaxingEffect, ratioCategory) {
  switch (ratioCategory) {
    case 'Theanine Dominant (>=2.0)':
      return stimulatingEffect === 'None' || stimulatingEffect === 'Very Low'
        ? 'Deeply Calm'
        : 'Calm & Clear';
    case 'Theanine Leaning (1.5 to <2.0)':
      return stimulatingEffect === 'High (Smooth)' ||
        stimulatingEffect === 'Very High (Smooth)'
        ? 'Smooth & Alert'
        : 'Smooth & Sustained';
    case 'Balanced (0.8-1.5)':
      return 'Balanced & Focused';
    case 'Caffeine Leaning (0.5-0.8)':
      return relaxingEffect === 'None' || relaxingEffect === 'Very Low'
        ? 'Sharp & Driven'
        : 'Focused & Energized';
    case 'Caffeine Dominant (<0.5)':
      return 'Intense & Sharp';
    default:
      if (stimulatingEffect >= 'Moderate' && relaxingEffect <= 'Low')
        return 'Primarily Stimulating';
      if (relaxingEffect >= 'Moderate' && stimulatingEffect <= 'Low')
        return 'Primarily Relaxing';
      return 'Variable';
  }
}

function generateDescription(levels, analysis, teaType) {
  let desc = `This ${teaType || 'tea'} has `;

  if (levels.caffeineLevel >= 7.5) desc += 'very high caffeine';
  else if (levels.caffeineLevel >= 5.5) desc += 'high caffeine';
  else if (levels.caffeineLevel >= 3.5) desc += 'moderate caffeine';
  else if (levels.caffeineLevel >= 1.5) desc += 'low caffeine';
  else if (levels.caffeineLevel > 0) desc += 'very low caffeine';
  else desc += 'negligible caffeine';

  if (levels.lTheanineLevel > 0) {
    desc += ' and ';
    if (levels.lTheanineLevel >= 7.5) desc += 'very high L-theanine';
    else if (levels.lTheanineLevel >= 5.5) desc += 'high L-theanine';
    else if (levels.lTheanineLevel >= 3.5) desc += 'moderate L-theanine';
    else if (levels.lTheanineLevel >= 1.5) desc += 'low L-theanine';
    else desc += 'very low L-theanine';
  }
  desc += '. ';

  if (
    levels.lTheanineToCaffeineRatio > 0 &&
    analysis.ratioCategory !== 'N/A'
  ) {
    desc += `The L-theanine to caffeine ratio (${levels.lTheanineToCaffeineRatio.toFixed(2)}) is categorized as '${analysis.ratioCategory}'. `;
    desc += `This indicates a '${analysis.stimulationLevel}' stimulation level and a '${analysis.relaxationLevel}' relaxation level, resulting in a compound profile best described as '${analysis.compoundProfile}'.`;
  } else if (levels.caffeineLevel > 0) {
    desc += `With primarily caffeine present, the stimulation level is '${analysis.stimulationLevel}'.`;
  } else if (levels.lTheanineLevel > 0) {
    desc += `With primarily L-theanine present, the relaxation level is '${analysis.relaxationLevel}'.`;
  }

  return desc;
}

// --- CompoundService ---

export class CompoundService {
  constructor(config = {}) {
    this.config = config;
  }

  /**
   * Main entry point: Analyze tea compounds
   *
   * @param {TeaModel} teaModel - Normalized tea model
   * @returns {Promise<Object>} Analysis result
   */
  async analyze(teaModel) {
    return this.infer(teaModel);
  }

  /**
   * Perform compound analysis
   *
   * @param {TeaModel} teaModel - Tea to analyze
   * @returns {Object} Analysis result
   */
  infer(teaModel) {
    // Extract compound levels with defaults
    const caffeineLevel = typeof teaModel?.caffeineLevel === 'number' ? teaModel.caffeineLevel : 0;
    const lTheanineLevel = typeof teaModel?.lTheanineLevel === 'number' ? teaModel.lTheanineLevel : 0;

    // Handle case with no compound data
    if (caffeineLevel === 0 && lTheanineLevel === 0) {
      return {
        description: 'No significant caffeine or L-theanine data available.',
        levels: {
          caffeineLevel: 0,
          lTheanineLevel: 0,
          lTheanineToCaffeineRatio: 0
        },
        analysis: {
          ratioCategory: 'N/A',
          stimulationLevel: 'None',
          relaxationLevel: 'None',
          compoundProfile: 'N/A'
        }
      };
    }

    // Calculate ratio
    const lTheanineToCaffeineRatio =
      caffeineLevel > 0 ? lTheanineLevel / caffeineLevel : 0;

    const levels = {
      caffeineLevel,
      lTheanineLevel,
      lTheanineToCaffeineRatio
    };

    // Determine analysis
    const ratioCat = determineRatioCategory(lTheanineToCaffeineRatio);
    const stimEffect = determineStimulatingEffect(caffeineLevel, lTheanineLevel);
    const relaxEffect = determineRelaxingEffect(lTheanineLevel);
    const compoundProf = determineCompoundProfile(stimEffect, relaxEffect, ratioCat);

    const analysis = {
      ratioCategory: ratioCat,
      stimulationLevel: stimEffect,
      relaxationLevel: relaxEffect,
      compoundProfile: compoundProf
    };

    // Generate description
    const description = generateDescription(levels, analysis, teaModel?.type);

    return {
      description,
      levels,
      analysis
    };
  }

  /**
   * Serialize inference for JSON output
   *
   * @param {Object} inference - Raw inference result
   * @returns {Object} Serialized result
   */
  serialize(inference) {
    const description = inference?.description || 'No compound data available';
    const levels = inference?.levels || {};
    const analysis = inference?.analysis || {};

    return {
      description,
      levels,
      analysis
    };
  }

  /**
   * Format inference for markdown display
   *
   * @param {Object} inference - Raw inference result
   * @returns {string} Markdown formatted text
   */
  formatMarkdown(inference) {
    if (!inference || !inference.levels ||
        (inference.levels.caffeineLevel === 0 &&
          inference.levels.lTheanineLevel === 0)) {
      return '## Compound Analysis\n\nNo significant compound data available.';
    }

    let md = '## Compound Analysis\n\n';
    md += `${inference.description}\n\n`;

    md += '### Compound Levels\n';
    const { levels } = inference;
    md += `- **Caffeine**: ${levels.caffeineLevel?.toFixed(1) ?? '0.0'}/10\n`;
    md += `- **L-theanine**: ${levels.lTheanineLevel?.toFixed(1) ?? '0.0'}/10\n`;
    if (levels.lTheanineToCaffeineRatio > 0) {
      md += `- **L-theanine:Caffeine Ratio**: ${levels.lTheanineToCaffeineRatio.toFixed(2)}\n`;
    }

    md += '\n### Compound Impact Analysis\n';
    const { analysis } = inference;
    if (
      analysis &&
      Object.keys(analysis).length > 0 &&
      analysis.ratioCategory !== 'N/A'
    ) {
      md += `- **Ratio Category**: ${analysis.ratioCategory}\n`;
      md += `- **Stimulation Level**: ${analysis.stimulationLevel}\n`;
      md += `- **Relaxation Level**: ${analysis.relaxationLevel}\n`;
      md += `- **Resulting Compound Profile**: ${analysis.compoundProfile}\n`;
    } else if (
      analysis.stimulationLevel !== 'None' ||
      analysis.relaxationLevel !== 'None'
    ) {
      if (analysis.stimulationLevel !== 'None')
        md += `- **Stimulation Level**: ${analysis.stimulationLevel}\n`;
      if (analysis.relaxationLevel !== 'None')
        md += `- **Relaxation Level**: ${analysis.relaxationLevel}\n`;
    } else {
      md += 'No specific impact analysis available.\n';
    }

    return md;
  }
}

// Export singleton instance for convenience
export const compoundService = new CompoundService();
