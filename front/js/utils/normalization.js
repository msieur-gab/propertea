// normalization.js
// Utility functions for effect score normalization and scaling

/**
 * Sigmoid function for non-linear score transformation
 * @param {number} x - Input score
 * @param {number} midpoint - Midpoint of the sigmoid curve (default 5)
 * @param {number} steepness - Steepness of the curve (default 1)
 * @returns {number} - Transformed score
 */
function sigmoid(x, midpoint = 5, steepness = 1) {
    return 10 / (1 + Math.exp(-steepness * (x - midpoint)));
}

/**
 * Normalizes scores to a 0-10 scale using a simpler, more transparent approach
 * @param {Object} scores - Raw effect scores
 * @returns {Object} Normalized scores
 */
export function normalizeScores(scores) {
    if (!scores || Object.keys(scores).length === 0) {
        return {};
    }

    // Find the maximum score
    const maxScore = Math.max(...Object.values(scores));
    
    // If all scores are 0, return the original scores
    if (maxScore === 0) {
        return scores;
    }

    // Calculate mean and standard deviation for more nuanced normalization
    const scoresArray = Object.values(scores).filter(score => score > 0);
    const mean = scoresArray.reduce((sum, score) => sum + score, 0) / scoresArray.length;
    const stdDev = Math.sqrt(
        scoresArray.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scoresArray.length
    );

    // Normalize scores using z-score based approach
    const normalized = {};
    Object.entries(scores).forEach(([effect, score]) => {
        if (score <= 0) {
            normalized[effect] = 0;
            return;
        }

        // Calculate z-score
        const zScore = (score - mean) / stdDev;

        // Transform z-score to 0-10 scale using sigmoid
        // This creates a more natural distribution while preventing extreme values
        let normalizedScore = sigmoid(zScore, 0, 0.5) * 10;

        // Ensure scores are within bounds
        normalized[effect] = Math.min(9.8, Math.max(0, normalizedScore));
    });

    return normalized;
}

/**
 * Enhance the dominant effect to make it stand out more clearly
 * @param {Object} scores - Effect scores object
 * @param {string} dominantId - ID of the dominant effect
 * @param {number} enhancementFactor - Factor to enhance the dominant effect by
 * @returns {Object} Enhanced scores
 */
export function enhanceDominantEffect(scores, dominantId, enhancementFactor = 1.1) {
    if (!scores || !dominantId || !scores[dominantId]) {
        return scores;
    }

    const enhanced = { ...scores };
    const dominantScore = enhanced[dominantId];

    // Calculate the average of non-dominant scores
    const otherScores = Object.entries(enhanced)
        .filter(([effect]) => effect !== dominantId)
        .map(([, score]) => score);
    
    const avgOtherScore = otherScores.reduce((sum, score) => sum + score, 0) / otherScores.length;

    // Only enhance if there's a meaningful difference
    if (dominantScore > avgOtherScore * 1.2) {
        // Enhance the dominant effect
        enhanced[dominantId] = Math.min(9.8, dominantScore * enhancementFactor);

        // Slightly reduce other effects to create more contrast
        Object.keys(enhanced).forEach(effect => {
            if (effect !== dominantId) {
                enhanced[effect] *= 0.95;
            }
        });
    }

    return enhanced;
}

/**
 * Advanced score normalization system with customizable parameters
 * @param {Object} config - Configuration object with normalization parameters
 * @returns {Object} - Object with normalization methods
 */
export function createScoreNormalizer(config = {}) {
    // Default configuration
    const defaultConfig = {
        normalizationFactor: 5,  // Midpoint for sigmoid function
        steepness: 0.5,          // Steepness of sigmoid curve
        maxEffectScore: 9.8,     // Maximum score cap
        enhancementFactor: 1.05  // Enhancement multiplier
    };
    
    // Merge with provided config
    const normalizeConfig = { ...defaultConfig, ...config };
    
    return {
        // Normalize a single score with sigmoid function
        normalizeScore(rawScore) {
            // Modified sigmoid function for better score distribution
            let score = 10 / (1 + Math.exp(-normalizeConfig.steepness * 
                (rawScore - normalizeConfig.normalizationFactor)));
            
            // Apply nonlinear transformation to increase differentiation in mid-range
            if (score > 2 && score < 8) {
                // Stretch the middle range
                const normalizedPos = (score - 2) / 6; // 0 to 1 across the range 2-8
                const stretchedPos = Math.pow(normalizedPos, 0.9); // Power less than 1 stretches middle
                score = 2 + (stretchedPos * 6);
            }
            
            // Hard cap to prevent too many 10s
            return Math.min(normalizeConfig.maxEffectScore, score);
        },
        
        // Normalize all scores in an object
        normalizeScores(scores) {
            const result = {};
            Object.entries(scores).forEach(([key, value]) => {
                result[key] = this.normalizeScore(value);
            });
            return result;
        },
        
        // Apply tea type specific modifiers
        applyTeaTypeModifiers(scores, teaType, modifiers) {
            if (!teaType || !modifiers || !modifiers[teaType]) {
                return scores;
            }
            
            const typeModifiers = modifiers[teaType];
            const modifiedScores = { ...scores };
            
            Object.entries(typeModifiers).forEach(([effect, modifier]) => {
                if (modifiedScores[effect] !== undefined) {
                    modifiedScores[effect] *= modifier;
                }
            });
            
            return modifiedScores;
        }
    };
}

export default {
    normalizeScores,
    enhanceDominantEffect,
    createScoreNormalizer
}; 