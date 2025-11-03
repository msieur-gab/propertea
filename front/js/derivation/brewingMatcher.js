// File: js/derivation/brewingMatcher.js

// Import the recommendations data
// Adjust the path if your brewingRecommendations file is elsewhere
import brewingRecommendations from '../descriptors/brewingGuide.js';

export const brewingMatcher = {
    /**
     * Gets brewing information for a tea based on style by finding the first matching rule.
     * @param {Object} tea - The tea object (from TeaModel, including type, subType, processing.methods).
     * @param {string} brewingStyle - Preferred brewing style ('gongfu' or 'western').
     * @param {Object} [processingAnalysis={}] - Optional: Analysis results from ProcessingCalculator (needs at least { roastLevel: '...' }).
     * @returns {Object} - Brewing parameters object from the first matching rule, or an error object.
     */
    getBrewingInfo: function(tea, brewingStyle = 'gongfu', processingAnalysis = {}) {
        if (!tea || !brewingStyle) {
            console.error("Brewing Matcher: Tea object and brewing style are required.");
            return { error: "Tea object and brewing style are required." };
        }

        const normalizedStyle = brewingStyle.toLowerCase();
        // Use helper to normalize type, handle variations like 'puerh-sheng' -> 'puerh'
        const teaType = this.normalizeTeaType(tea.type, tea.subType); // Pass subtype for context

        if (!brewingRecommendations[normalizedStyle]?.[teaType]) {
             console.warn(`Brewing Matcher: No brewing rule array found for tea type '${teaType}' derived from '${tea.type}' in style '${normalizedStyle}'.`);
             return { error: `No brewing rule array found for tea type '${teaType}' in style '${normalizedStyle}'.` };
        }

        const rules = brewingRecommendations[normalizedStyle][teaType]; // Get the array of rules for this tea type

        if (!Array.isArray(rules) || rules.length === 0) {
             console.error(`Brewing Matcher: Brewing rules for ${teaType} (${normalizedStyle}) are not a valid array or are empty.`);
             return { error: `Brewing rules for ${teaType} (${normalizedStyle}) are not a valid array or are empty.` };
        }

        // Collect and normalize processing methods
        const normalizedProcessingMethods = this.getNormalizedProcessingMethods(tea, processingAnalysis);
        
        // --- Find the first matching rule ---
        for (const rule of rules) {
            // Check if the current tea meets all conditions defined in this rule
            if (this.checkConditions(tea, normalizedProcessingMethods, rule.conditions)) {
                console.log(`Brewing Matcher: Matched rule for ${tea.name || tea.type} (${normalizedStyle}) with conditions:`, rule.conditions);
                // Return a copy of the params from the first matching rule
                // Add the matched conditions for potential debugging/info
                return { 
                    ...rule.params, 
                    matchedConditions: rule.conditions,
                    _debug: {
                        teaType,
                        normalizedProcessingMethods: Array.from(normalizedProcessingMethods),
                        ruleIndex: rules.indexOf(rule)
                    }
                };
            }
        }

        // This should theoretically only be reached if no default rule (conditions: {}) exists
        console.warn(`Brewing Matcher: Could not find any matching brewing rule (including default) for ${tea.type} (${tea.subType || 'N/A'}) in ${normalizedStyle} style.`);
        return { 
            error: `Could not find any matching brewing rule (including default) for this specific ${tea.type} (${tea.subType || 'N/A'}).`,
            _debug: {
                teaType,
                normalizedProcessingMethods: Array.from(normalizedProcessingMethods)
            }
        };
    },

    /**
     * Collects and normalizes processing methods from tea object and analysis.
     * @param {Object} tea - The tea object
     * @param {Object} processingAnalysis - Results from ProcessingCalculator
     * @returns {Set} - Set of normalized processing method keywords
     */
    getNormalizedProcessingMethods: function(tea, processingAnalysis) {
        // Collect processing methods from tea object
        let processingMethods = [];
        
        // Get methods from tea.processing.methods if available
        if (Array.isArray(tea.processing?.methods)) {
            processingMethods = [...tea.processing.methods];
        } 
        // Or from tea.processingMethods if that's the structure
        else if (Array.isArray(tea.processingMethods)) {
            processingMethods = [...tea.processingMethods];
        }
        // If it's a string, split it (might be comma-separated)
        else if (typeof tea.processing?.methods === 'string') {
            processingMethods = tea.processing.methods.split(/,\s*/);
        }
        else if (typeof tea.processingMethods === 'string') {
            processingMethods = tea.processingMethods.split(/,\s*/);
        }
        
        // Create a set of normalized processing methods
        const normalizedMethods = new Set();
        
        // Add normalized versions of each processing method
        processingMethods.forEach(method => {
            if (method) {
                normalizedMethods.add(this.normalizeProcessingMethod(method));
            }
        });

        // --- Add Processing Information from Analysis ---
        
        // 1. Add oxidation level
        const oxidationLevel = tea.processing?.oxidationLevel || processingAnalysis.oxidationLevel;
        if (typeof oxidationLevel === 'number') {
            if (oxidationLevel < 20) normalizedMethods.add('light-oxidized');
            else if (oxidationLevel < 60) normalizedMethods.add('medium-oxidized');
            else if (oxidationLevel < 85) normalizedMethods.add('heavy-oxidized');
            else normalizedMethods.add('fully-oxidized');
        }
        
        // 2. Add roast level
        const roastLevel = processingAnalysis.roastLevel || tea.processing?.roastLevel;
        if (roastLevel) {
            const normalizedRoastLevel = roastLevel.toLowerCase();
            if (normalizedRoastLevel === 'medium') normalizedMethods.add('roasted');
            else if (normalizedRoastLevel === 'heavy' || normalizedRoastLevel === 'dark' || normalizedRoastLevel === 'charcoal') {
                normalizedMethods.add('roasted');
                normalizedMethods.add('heavy-roasted');
            }
            else if (normalizedRoastLevel === 'light') normalizedMethods.add('light-roasted');
        }
        
        // 3. Add age information
        const productionYear = tea.productionYear || tea.year;
        const currentYear = new Date().getFullYear();
        if (productionYear && currentYear - productionYear > 3) {
            normalizedMethods.add('aged');
            if (currentYear - productionYear > 10) normalizedMethods.add('well-aged');
        }
        
        // 4. Add storage conditions if available
        const storage = tea.storage?.conditions || tea.storageConditions;
        if (storage) {
            const normalizedStorage = storage.toLowerCase();
            if (normalizedStorage.includes('wet') || normalizedStorage.includes('humid')) {
                normalizedMethods.add('humid-stored');
            }
            if (normalizedStorage.includes('dry')) {
                normalizedMethods.add('dry-stored');
            }
        }
        
        // 5. Add unrolled for white teas or flat shaped teas
        if (tea.type?.toLowerCase() === 'white' || tea.type?.toLowerCase() === 'white tea') {
            normalizedMethods.add('unrolled');
        }
        
        // 6. Add withered for most tea types except green
        if (tea.type?.toLowerCase() !== 'green' && tea.type?.toLowerCase() !== 'green tea') {
            normalizedMethods.add('withered');
        }
        
        // 7. Add unwithered specifically for green teas
        if (tea.type?.toLowerCase() === 'green' || tea.type?.toLowerCase() === 'green tea') {
            normalizedMethods.add('unwithered');
        }
        
        // 8. Add compression information
        if (tea.form?.toLowerCase().includes('cake') || 
            tea.form?.toLowerCase().includes('brick') || 
            tea.form?.toLowerCase().includes('tuo') ||
            tea.shape?.toLowerCase().includes('compressed')) {
            normalizedMethods.add('compressed');
        }
        
        // 9. Ensure young/aged for puerh is added based on age
        if ((tea.type?.toLowerCase().includes('puerh') || tea.subType?.toLowerCase() === 'sheng') && 
            !normalizedMethods.has('aged')) {
            normalizedMethods.add('young');
        }
        
        return normalizedMethods;
    },

    /**
     * Helper function to check if a tea meets the conditions of a rule.
     * @param {Object} tea - The tea object
     * @param {Set} normalizedMethods - Set of normalized processing methods
     * @param {Object} conditions - The conditions object from the rule
     * @returns {boolean} - True if all conditions are met
     */
    checkConditions: function(tea, normalizedMethods, conditions) {
        // An empty condition object {} always matches (this is the default rule)
        if (!conditions || Object.keys(conditions).length === 0) {
            return true;
        }

        // Check each condition
        for (const key in conditions) {
            const conditionValue = conditions[key];
            let conditionMet = false;

            if (key === 'subtype') {
                // Check tea's subtype (e.g., 'sheng', 'shou')
                const teaSubtypeValue = tea.subType?.toLowerCase() || '';
            
                // Also check for subtype extracted from hyphenated type
                const extractedSubtype = this._extractedSubType || '';
                
                // Check if either the explicit subtype or extracted subtype matches
                conditionMet = (
                    conditionValue.toLowerCase() === teaSubtypeValue || 
                    conditionValue.toLowerCase() === extractedSubtype
                );
                console.log(`Subtype check: condition='${conditionValue.toLowerCase()}', tea.subType='${teaSubtypeValue}', extracted='${extractedSubtype}', met=${conditionMet}`);

            } 
            else if (key === 'processing') {
                // Check if ALL keywords in the condition array exist in the tea's compiled keywords
                if (!Array.isArray(conditionValue)) {
                    console.warn("Rule condition 'processing' should be an array:", conditionValue);
                    return false; // Malformed rule
                }
                
                // Check if every keyword required by the rule exists in the tea's processing methods
                conditionMet = conditionValue.every(condKeyword => 
                    normalizedMethods.has(this.normalizeProcessingMethod(condKeyword))
                );
            }
            else if (key === 'anyProcessing') {
                // Check if ANY of the keywords in the condition array exist in the tea's compiled keywords
                if (!Array.isArray(conditionValue)) {
                    console.warn("Rule condition 'anyProcessing' should be an array:", conditionValue);
                    return false; // Malformed rule
                }
                
                // Check if at least one keyword required by the rule exists in the tea's processing methods
                conditionMet = conditionValue.some(condKeyword => 
                    normalizedMethods.has(this.normalizeProcessingMethod(condKeyword))
                );
            }
            else if (key === 'notProcessing') {
                // Check that NONE of the keywords in the condition array exist in the tea's compiled keywords
                if (!Array.isArray(conditionValue)) {
                    console.warn("Rule condition 'notProcessing' should be an array:", conditionValue);
                    return false; // Malformed rule
                }
                
                // Check that none of the forbidden keywords exist in the tea's processing methods
                conditionMet = !conditionValue.some(condKeyword => 
                    normalizedMethods.has(this.normalizeProcessingMethod(condKeyword))
                );
            }
            else if (key === 'oxidationLevel') {
                // Check if tea's oxidation level falls within a range
                const teaOxidation = tea.processing?.oxidationLevel;
                if (Array.isArray(conditionValue) && conditionValue.length === 2) {
                    conditionMet = (
                        typeof teaOxidation === 'number' &&
                        teaOxidation >= conditionValue[0] &&
                        teaOxidation <= conditionValue[1]
                    );
                }
            }
            // Add other condition checks as needed
            
            // If any condition is not met, this rule doesn't match
            if (!conditionMet) {
                return false;
            }
        }

        // If we made it here, all conditions were met
        return true;
    },

    /**
     * Normalizes processing method terminology to match condition keys.
     * @param {string} method - The processing method to normalize
     * @returns {string} - Normalized processing method term
     */
    normalizeProcessingMethod: function(method) {
        if (!method) return '';
        const normalizedMethod = method.toLowerCase().trim();
        
        // Map variations to standardized terms
        const methodMap = {
            // Rolling styles
            'ball rolled': 'ball-rolled',
            'rolled': 'ball-rolled',
            'hand rolled': 'ball-rolled',
            'pearl': 'ball-rolled',
            'strip rolled': 'strip-rolled',
            'twisted': 'strip-rolled',
            'strip': 'strip-rolled',
            
            // Oxidation levels
            'light oxidation': 'light-oxidized',
            'medium oxidation': 'medium-oxidized', 
            'heavy oxidation': 'heavy-oxidized',
            'full oxidation': 'fully-oxidized',
            'fully oxidized': 'fully-oxidized',
            
            // Firing/Drying methods
            'pan fired': 'pan-fired',
            'wok fired': 'pan-fired',
            'sun dried': 'sun-dried',
            
            // Roast levels
            'minimal roast': 'minimal-roast',
            'light roast': 'light-roast',
            'medium roast': 'medium-roast',
            'heavy roast': 'heavy-roast',
            'dark roast': 'heavy-roast',
            'charcoal roasted': 'charcoal-roasted',
            'post processing roasted': 'post-processing-roasted',
            
            // Special processes
            'shade grown': 'shade-grown',
            'pile fermented': 'pile-fermented',
            'wet piled': 'pile-fermented',
            'basket aged': 'basket-aged',
            'fungal fermented': 'fungal-fermented',
            'yellow mold': 'fungal-fermented',
            'golden flowers': 'fungal-fermented',
            
            // Storage conditions
            'wet stored': 'humid-stored',
            'humid stored': 'humid-stored',
            'dry stored': 'dry-stored',
            
            // Age
            'well aged': 'well-aged',
            'aged tea': 'aged'
        };
        
        return methodMap[normalizedMethod] || normalizedMethod;
    },

    /**
     * Normalizes tea type to match brewing guide categories.
     * Handles base types and subtypes if relevant for initial key lookup.
     * @param {string} teaType - The tea type (e.g., 'puerh-sheng', 'oolong').
     * @param {string} [teaSubType] - Optional subtype (e.g., 'sheng', 'shou').
     * @returns {string} - Normalized base tea type (e.g., 'puerh', 'oolong').
     */
     normalizeTeaType: function(teaType, teaSubType = null) {
        if (!teaType) return 'unknown';
        const lowerType = teaType.toLowerCase().trim();
        // --- Extract subtype from hyphenated type if present ---
    // Handle cases like 'puerh-sheng' or 'puerh-shou'
        if (lowerType.includes('-')) {
            const [baseType, extractedSubType] = lowerType.split('-');
            // Store the extracted subtype for later use in condition checking
            this._extractedSubType = extractedSubType;
            return baseType; // Return just the base type part
        }

        // --- Prioritize Subtype for Mapping (if applicable) ---
        // If a subtype clearly indicates the primary category (like sheng/shou for puerh)
        if (teaSubType) {
            const lowerSubType = teaSubType.toLowerCase().trim();
            if (lowerSubType === 'sheng' || lowerSubType === 'shou') return 'puerh';
            // Add other subtype-to-basetype mappings if relevant
        }

        // --- Map Combined Types or Variations to Base Types ---
        const typeMap = {
            'green tea': 'green',
            'white tea': 'white',
            'oolong tea': 'oolong',
            'black tea': 'black',
            'puerh tea': 'puerh',
            'pu\'er': 'puerh',
            'pu-erh': 'puerh',
            'raw puerh': 'puerh',
            'ripe puerh': 'puerh',
            'puerh-sheng': 'puerh',
            'puerh-shou': 'puerh',
            'sheng puerh': 'puerh',
            'shou puerh': 'puerh',
            'yellow tea': 'yellow',
            'dark tea': 'dark',
            'hei cha': 'dark',
            'liu bao': 'dark',
            'liu an': 'dark',
            'fu zhuan': 'dark'
        };

        // Return mapped type or the lowercase original if no map entry exists
        return typeMap[lowerType] || lowerType;
    }
};

export default brewingMatcher;