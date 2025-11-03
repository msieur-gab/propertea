// CompoundCalculator.js
// Handles calculations related to chemical compounds in tea and their potential impact.

import { BaseCalculator } from './BaseCalculator.js';

// --- Helper functions (Refined based on discussion) ---

// 6-Level Scale: None (0), Very Low (>0-1.5), Low (1.5-3.5), Moderate (3.5-5.5), High (5.5-7.5), Very High (>7.5)

function determineRatioCategory(ratio) {
    if (ratio <= 0) return "N/A";
    if (ratio >= 2.0) return "Theanine Dominant (>=2.0)";
    if (ratio >= 1.5 && ratio < 2.0) return "Theanine Leaning (1.5 to <2.0)";
    if (ratio >= 0.8) return "Balanced (0.8-1.5)";
    if (ratio >= 0.5) return "Caffeine Leaning (0.5-0.8)";
    return "Caffeine Dominant (<0.5)";
}

/**
 * Determines the stimulating effect level based on caffeine and theanine (6 Levels).
 * @param {number} caffeineLevel - Caffeine score (0-10)
 * @param {number} theanineLevel - L-theanine score (0-10)
 * @returns {string} - Stimulating effect level description
 */
function determineStimulatingEffect(caffeineLevel, theanineLevel) {
    if (caffeineLevel <= 0) return "None";
    if (caffeineLevel <= 1.5) return "Very Low";
    if (caffeineLevel <= 3.5) return "Low";
    if (caffeineLevel <= 5.5) return "Moderate"; // Moderate Caffeine (3.5 - 5.5)
    if (caffeineLevel <= 7.5) { // High Caffeine (5.5 - 7.5)
        // Moderated by High or Very High theanine? (Using >= 5.5 as threshold)
        if (theanineLevel >= 5.5) {
            return "High (Smooth)";
        } else {
            return "High";
        }
    }
    // Very High Caffeine (> 7.5)
    // Moderated by Very High theanine? (Using >= 7.5 as threshold)
    if (theanineLevel >= 7.5) {
         return "Very High (Smooth)";
    } else {
         return "Very High";
    }
}

/**
 * Determines the relaxing effect level based on L-theanine (6 Levels).
 * @param {number} theanineLevel - L-theanine score (0-10)
 * @returns {string} - Relaxing effect level description
 */
function determineRelaxingEffect(theanineLevel) {
    if (theanineLevel <= 0) return "None";
    if (theanineLevel <= 1.5) return "Very Low";
    if (theanineLevel <= 3.5) return "Low";
    if (theanineLevel <= 5.5) return "Moderate";
    if (theanineLevel <= 7.5) return "High";
    return "Very High"; // Levels > 7.5
}

/**
 * Determines the overall compound effect profile based on stimulation, relaxation, and ratio.
 * @param {string} stimulatingEffect - e.g., "High (Smooth)"
 * @param {string} relaxingEffect - e.g., "Moderate"
 * @param {string} ratioCategory - e.g., "Balanced (0.8-1.5)"
 * @returns {string} - Description of the resulting compound profile
 */
function determineCompoundProfile(stimulatingEffect, relaxingEffect, ratioCategory) {
    // Example logic - refine based on desired outcomes
    switch (ratioCategory) {
        case "Theanine Dominant (>=2.0)":
             return (stimulatingEffect === "None" || stimulatingEffect === "Very Low") ? "Deeply Calm" : "Calm & Clear";
        case "Theanine Leaning (1.5 to <2.0)":
             return (stimulatingEffect === "High (Smooth)" || stimulatingEffect === "Very High (Smooth)") ? "Smooth & Alert" : "Smooth & Sustained";
        case "Balanced (0.8-1.5)":
             return "Balanced & Focused";
        case "Caffeine Leaning (0.5-0.8)":
             return (relaxingEffect === "None" || relaxingEffect === "Very Low") ? "Sharp & Driven" : "Focused & Energized";
        case "Caffeine Dominant (<0.5)":
             return "Intense & Sharp";
        default:
            // Handle cases with only one compound significantly present
            if (stimulatingEffect >= "Moderate" && relaxingEffect <= "Low") return "Primarily Stimulating";
            if (relaxingEffect >= "Moderate" && stimulatingEffect <= "Low") return "Primarily Relaxing";
            return "Variable";
    }
}

/**
 * Generates a description based on compound levels and the calculated analysis.
 * @param {object} levels - Object with compound levels and ratio.
 * @param {object} analysis - Object with calculated analysis fields (ratioCategory, stimulationLevel, relaxationLevel, compoundProfile).
 * @param {string} teaType - The type of tea.
 * @returns {string} - Descriptive text.
 */
function generateRevisedDescription(levels, analysis, teaType) {
    let desc = `This ${teaType || 'tea'} has `;
    // Describe levels
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

    // Describe ratio and potential impact using analysis fields
    if (levels.lTheanineToCaffeineRatio > 0 && analysis.ratioCategory !== "N/A") {
        desc += `The L-theanine to caffeine ratio (${levels.lTheanineToCaffeineRatio.toFixed(2)}) is categorized as '${analysis.ratioCategory}'. `;
        desc += `This indicates a '${analysis.stimulationLevel}' stimulation level and a '${analysis.relaxationLevel}' relaxation level, resulting in a compound profile best described as '${analysis.compoundProfile}'.`;
    } else if (levels.caffeineLevel > 0) {
        desc += `With primarily caffeine present, the stimulation level is '${analysis.stimulationLevel}'.`;
    } else if (levels.lTheanineLevel > 0) {
        desc += `With primarily L-theanine present, the relaxation level is '${analysis.relaxationLevel}'.`;
    }
    return desc;
}
// --- End Helper Functions ---


export class CompoundCalculator extends BaseCalculator {
    constructor(config) {
        super(config);
    }

    // Override infer method from BaseCalculator
    infer(tea) {
        // Initialize the trace array
        let trace = [];
        
        // Use default 0 if properties are missing or not numbers
        const caffeineLevel = typeof tea?.caffeineLevel === 'number' ? tea.caffeineLevel : 0;
        const lTheanineLevel = typeof tea?.lTheanineLevel === 'number' ? tea.lTheanineLevel : 0;

        // Check if both essential compounds are zero or absent
        if (caffeineLevel === 0 && lTheanineLevel === 0) {
             trace.push({ 
                 step: "Input Validation", 
                 reason: "Missing compound data", 
                 adjustment: "Using default values", 
                 value: "caffeineLevel: 0, lTheanineLevel: 0" 
             });
             
             return {
                 description: 'No significant caffeine or L-theanine data available.',
                 levels: { caffeineLevel: 0, lTheanineLevel: 0, lTheanineToCaffeineRatio: 0 },
                 analysis: { ratioCategory: "N/A", stimulationLevel: "None", relaxationLevel: "None", compoundProfile: "N/A" },
                 trace
             };
        }

        trace.push({ 
            step: "Input Processing", 
            reason: "Raw tea data", 
            adjustment: `Processing compound values`, 
            value: `caffeineLevel: ${caffeineLevel}, lTheanineLevel: ${lTheanineLevel}` 
        });

        const lTheanineToCaffeineRatio = caffeineLevel > 0 ? lTheanineLevel / caffeineLevel : 0;

        const levels = {
            caffeineLevel,
            lTheanineLevel,
            lTheanineToCaffeineRatio
        };

        trace.push({ 
            step: "Ratio Calculation", 
            reason: "Quantifying compound balance", 
            adjustment: `L-Theanine to Caffeine Ratio calculated`, 
            value: lTheanineToCaffeineRatio.toFixed(2) 
        });

        // --- Perform the new analysis ---
        const ratioCat = determineRatioCategory(lTheanineToCaffeineRatio);
        trace.push({ 
            step: "Ratio Category Determination", 
            reason: `Ratio: ${lTheanineToCaffeineRatio.toFixed(2)}`, 
            adjustment: `Categorized as '${ratioCat}'`, 
            value: ratioCat 
        });
        
        const stimEffect = determineStimulatingEffect(caffeineLevel, lTheanineLevel);
        trace.push({ 
            step: "Stimulation Level Determination", 
            reason: `Caffeine: ${caffeineLevel}, L-Theanine: ${lTheanineLevel}`, 
            adjustment: `Determined as '${stimEffect}'`, 
            value: stimEffect 
        });
        
        const relaxEffect = determineRelaxingEffect(lTheanineLevel);
        trace.push({ 
            step: "Relaxation Level Determination", 
            reason: `L-Theanine: ${lTheanineLevel}`, 
            adjustment: `Determined as '${relaxEffect}'`, 
            value: relaxEffect 
        });
        
        const compoundProf = determineCompoundProfile(stimEffect, relaxEffect, ratioCat);
        trace.push({ 
            step: "Compound Profile Determination", 
            reason: `Stim: ${stimEffect}, Relax: ${relaxEffect}, Ratio: ${ratioCat}`, 
            adjustment: `Determined as '${compoundProf}'`, 
            value: compoundProf 
        });
        
        // const durationHint = determineDurationHint(caffeineLevel, lTheanineLevel); // Keep commented out per user code

        const analysis = {
            ratioCategory: ratioCat,
            stimulationLevel: stimEffect,
            relaxationLevel: relaxEffect,
            compoundProfile: compoundProf,
            // energyDurationHint: durationHint // Keep commented out
        };

        // Generate the revised description
        const description = generateRevisedDescription(levels, analysis, tea?.type);
        trace.push({ 
            step: "Description Generation", 
            reason: "Summarizing compound analysis", 
            adjustment: "Generated human-readable description", 
            value: description.substring(0, 50) + "..." // Truncate for trace 
        });

        return {
            description,
            levels,
            analysis,
            trace
        };
    }

    // Override formatInference from BaseCalculator
    formatInference(inference) {
        if (!inference || !inference.levels || (inference.levels.caffeineLevel === 0 && inference.levels.lTheanineLevel === 0)) {
            return '## Compound Analysis\n\nNo significant compound data available.';
        }

        let md = '## Compound Analysis\n\n';

        // Add description
        md += `${inference.description}\n\n`;

        // Add compound level details
        md += '### Compound Levels\n';
        const { levels } = inference;
        md += `- **Caffeine**: ${levels.caffeineLevel?.toFixed(1) ?? '0.0'}/10\n`;
        md += `- **L-theanine**: ${levels.lTheanineLevel?.toFixed(1) ?? '0.0'}/10\n`;
        if (levels.lTheanineToCaffeineRatio > 0) {
           md += `- **L-theanine:Caffeine Ratio**: ${levels.lTheanineToCaffeineRatio.toFixed(2)}\n`;
        }

        // Add Compound Impact Analysis section
        md += `\n### Compound Impact Analysis\n`;
        const { analysis } = inference;
        if (analysis && Object.keys(analysis).length > 0 && analysis.ratioCategory !== "N/A") {
             md += `- **Ratio Category**: ${analysis.ratioCategory}\n`;
             md += `- **Stimulation Level**: ${analysis.stimulationLevel}\n`;
             md += `- **Relaxation Level**: ${analysis.relaxationLevel}\n`;
             md += `- **Resulting Compound Profile**: ${analysis.compoundProfile}\n`;
            // if(analysis.energyDurationHint) md += `- **Energy Duration Hint**: ${analysis.energyDurationHint}\n`; // Keep commented out
        } else if (analysis.stimulationLevel !== "None" || analysis.relaxationLevel !== "None") {
             // Handle cases with only caffeine or only theanine
             if (analysis.stimulationLevel !== "None") md += `- **Stimulation Level**: ${analysis.stimulationLevel}\n`;
             if (analysis.relaxationLevel !== "None") md += `- **Relaxation Level**: ${analysis.relaxationLevel}\n`;
        }
         else {
             md += 'No specific impact analysis available.\n';
        }

        return md;
    }

    // Override serialize from BaseCalculator
    serialize(inference) {
         // Handle case where inference might be minimal due to lack of data
        const description = inference?.description || 'No compound data available';
        const levels = inference?.levels || {};
        const analysis = inference?.analysis || {};

        if (Object.keys(levels).length === 0 && Object.keys(analysis).length === 0) {
             return {
                 compounds: {
                     description: description,
                     levels: {},
                     analysis: {},
                     _sectionRef: "compounds"
                 }
             };
        }

        return {
             compounds: {
                description: description,
                levels: levels,
                analysis: analysis, // Serialize the new analysis object
                _sectionRef: "compounds" // Keep if you use references
            }
        };
    }
}