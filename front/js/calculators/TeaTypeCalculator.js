// TeaTypeCalculator.js
// Handles determining baseline characteristics and tendencies based on tea type.
// Includes fallback logic for subtype identification (explicit -> hyphenated type -> name).

import { BaseCalculator } from './BaseCalculator.js';
// Assuming your revised reference data is here:
import { teaTypeDescriptors } from '../descriptors/TeaTypeDescriptors.js'; // Or '../reference-data/TeaTypeDescriptors.js'

// Helper function to get data for a type/subtype, falling back from subtype to primary type
// This function remains largely the same, relying on the identifiedType/identifiedSubType passed from infer.
function getTypeData(teaType, subType = '') {
    const descriptors = teaTypeDescriptors; // Use imported reference data
    let data = {};

    // Try subtype first if provided and exists
    if (subType && descriptors[teaType]?.subTypes?.[subType]) {
        // Combine subtype data with primary type data (subtype overrides)
        data = { ...descriptors[teaType]?.base, ...descriptors[teaType]?.subTypes[subType] };
    }
    // Fallback to primary type if subtype not found or not provided
    else if (descriptors[teaType]?.base) {
        data = { ...descriptors[teaType]?.base };
    }
    // Fallback for type variations like 'puerh-shou' if primary 'puerh' exists
    // This might be less needed if infer handles hyphenation, but kept for robustness
    else if (teaType.includes('-') && descriptors[teaType.split('-')[0]]?.base) {
        const baseType = teaType.split('-')[0];
         const potentialSubTypeKey = teaType.split('-')[1];
         if (descriptors[baseType]?.subTypes?.[potentialSubTypeKey]) {
             data = { ...descriptors[baseType]?.base, ...descriptors[baseType]?.subTypes[potentialSubTypeKey] };
         } else {
             data = { ...descriptors[baseType]?.base };
         }
    }

    // Add general description if not overridden by specific data
    if (!data.description && teaTypeDescriptors.generalDescriptions?.[teaType]) {
         data.description = teaTypeDescriptors.generalDescriptions[teaType];
    } else if (!data.description && (teaType !== 'unknown')) {
         // Provide a default description if none exists
         data.description = `Information for ${teaType}${subType ? ` (${subType})` : ''}.`;
    } else if (!data.description) {
         data.description = 'No description available.';
    }


    // Ensure all expected fields have default values if missing
    const defaults = {
        typicalCaffeine: "unknown",
        typicalTheanine: "unknown",
        dominantFlavorCategories: [],
        seasonalTendency: "neutral",
        baseTimeOfDay: ["anytime"],
        baseActivityHints: [],
        commonProcessing: []
    };

    // Merge fetched data with defaults
    return { ...defaults, ...data };
}


export class TeaTypeCalculator extends BaseCalculator {
    constructor(config) {
        super(config);
        // Reference data is now imported directly
    }

    // Override infer method from BaseCalculator - WITH FALLBACK LOGIC
    infer(tea) {
        // Initialize the trace array
        let trace = [];

        // --- Refined Type and Subtype Identification ---
        let explicitSubType = tea?.subType?.toLowerCase() || '';
        let identifiedType = tea?.type?.toLowerCase() || 'unknown';
        let identifiedSubType = explicitSubType; // Start with explicit subtype
        let identificationSource = 'Explicit tea.subType field';

        // Fallback 1: Check hyphenated type if explicitSubType is missing
        if (!identifiedSubType && identifiedType.includes('-')) {
            const parts = identifiedType.split('-');
            identifiedType = parts[0]; // e.g., 'puerh'
            identifiedSubType = parts[1]; // e.g., 'sheng'
            identificationSource = 'Hyphenated tea.type field';
            trace.push({
                step: "Subtype Identification",
                reason: "No explicit subType, checked hyphenated type",
                adjustment: `Identified Type: ${identifiedType}, SubType: ${identifiedSubType} from '${tea.type}'`,
                value: identifiedSubType
            });
        }

        // Fallback 2: Check tea name if subtype is still missing
        if (!identifiedSubType && tea.name) {
            const nameLower = tea.name.toLowerCase();
            let foundSubtype = '';
            identificationSource = 'Keyword in tea.name';

            // Iterate through known types and their subtypes from the imported descriptors
            for (const baseType in teaTypeDescriptors) {
                if (teaTypeDescriptors[baseType]?.subTypes) {
                    for (const subTypeName in teaTypeDescriptors[baseType].subTypes) {
                        // Check if the tea name includes the subtype keyword
                        if (nameLower.includes(subTypeName.toLowerCase())) {
                             if (!foundSubtype) { // Take the first match
                                foundSubtype = subTypeName.toLowerCase();
                                trace.push({
                                    step: "Subtype Identification",
                                    reason: "No explicit subType or hyphenated type, checked tea name",
                                    adjustment: `Found keyword '${foundSubtype}' in name '${tea.name}'`,
                                    value: foundSubtype
                                });
                            } else {
                                trace.push({
                                    step: "Subtype Identification Warning",
                                    reason: "Multiple subtype keywords found in name",
                                    adjustment: `Found '${subTypeName}', but already identified '${foundSubtype}'. Using first match.`,
                                    value: foundSubtype
                                });
                            }
                        }
                    }
                }
                 // Optimization: if we found a subtype and the current baseType matches the identifiedType, stop searching
                 // Note: This might prevent finding a subtype if the base type was wrong initially (e.g., type='oolong', name='Matcha Oolong')
                 // Keep it simple for now: continue searching all known subtypes.
                 // if (foundSubtype && baseType === identifiedType) {
                 //     break;
                 // }
            }
            identifiedSubType = foundSubtype; // Assign the found subtype (or empty if none found)
        }

        // Final trace log for identification outcome
         if (!explicitSubType && !identifiedSubType) {
            identificationSource = 'None found';
            trace.push({
                step: "Subtype Identification",
                reason: "No explicit, hyphenated, or name-based subtype found.",
                adjustment: `Using Type: ${identifiedType}, SubType: (None)`,
                value: ""
            });
        } else if (!explicitSubType && identifiedSubType) {
             trace.push({
                 step: "Subtype Identification Summary",
                 reason: `Used fallback: ${identificationSource}`,
                 adjustment: `Final Identified Type: ${identifiedType}, SubType: ${identifiedSubType}`,
                 value: identifiedSubType
            });
        }
         else { // Used explicit subtype
             trace.push({
                 step: "Subtype Identification Summary",
                 reason: `Used explicit tea.subType`,
                 adjustment: `Final Identified Type: ${identifiedType}, SubType: ${identifiedSubType}`,
                 value: identifiedSubType
            });
         }

        // --- Original Logic Continues ---

        if (identifiedType === 'unknown') {
            trace.push({
                step: "Type Validation",
                reason: "Missing type data",
                adjustment: "Using default values",
                value: "No tea type identified"
            });

            return {
                teaType: 'unknown',
                subType: '',
                description: 'No tea type data available.',
                analysis: {}, // Return empty analysis for unknown type
                trace
            };
        }

        // Get the relevant data using identified values
        const typeData = getTypeData(identifiedType, identifiedSubType);

        let dataSource = "Primary Type";
         if (identifiedSubType && teaTypeDescriptors[identifiedType]?.subTypes?.[identifiedSubType]) {
            dataSource = "SubType Override";
         } else if (identifiedType.includes('-') && teaTypeDescriptors[identifiedType.split('-')[0]]?.base) {
            dataSource = "Composite Type"; // May be less relevant now
         }

        trace.push({
            step: "Descriptor Lookup",
            reason: `Looked up '${identifiedType}'${identifiedSubType ? '/' + identifiedSubType : ''} in TeaTypeDescriptors`,
            adjustment: `Found data source: ${dataSource}`,
            value: Object.keys(typeData).join(', ')
        });

        // Prepare the analysis object
        const analysis = {
            typicalCaffeine: typeData.typicalCaffeine,
            typicalTheanine: typeData.typicalTheanine,
            dominantFlavorCategories: typeData.dominantFlavorCategories,
            seasonalTendency: typeData.seasonalTendency,
            baseTimeOfDay: typeData.baseTimeOfDay,
            baseActivityHints: typeData.baseActivityHints,
            commonProcessing: typeData.commonProcessing
        };

        trace.push({ step: "Analysis Extraction", reason: "Extracted from typeData", adjustment: `Typical Caffeine: ${analysis.typicalCaffeine}, Theanine: ${analysis.typicalTheanine}`, value: `Dominant flavors: ${analysis.dominantFlavorCategories?.join(', ') || 'None'}` });
        trace.push({ step: "Activity Association", reason: "Type characteristic", adjustment: `Time preference: ${analysis.baseTimeOfDay?.join(', ') || 'None'}`, value: `Activities: ${analysis.baseActivityHints?.join(', ') || 'None'}` });
        trace.push({ step: "Processing Methods", reason: "Type characteristic", adjustment: `Common processing methods identified`, value: `Methods: ${analysis.commonProcessing?.join(', ') || 'None'}` });


        return {
            // Return the identified type and subtype
            teaType: identifiedSubType ? identifiedSubType : identifiedType, // Use 'matcha' if found, else 'green'
            subType: identifiedSubType, // Keep subtype separate too if needed elsewhere
            description: typeData.description,
            analysis,
            trace
        };
    }

    // Override formatInference from BaseCalculator
    formatInference(inference) {
        // This formatting logic should remain the same as the original file
        if (!inference || inference.teaType === 'unknown') {
            return '## Tea Type Analysis\n\nNo tea type data available.';
        }

        let md = `## Tea Type Analysis: ${this.capitalizeFirstLetter(inference.teaType)}`;
        if (inference.subType) {
             md += ` (${this.capitalizeFirstLetter(inference.subType)})`;
        }
        md += '\n\n';

        md += `${inference.description || 'No description provided.'}\n\n`;

        md += '### Baseline Characteristics & Tendencies\n';
        const { analysis } = inference;
        if (analysis && Object.keys(analysis).length > 0) {
            md += `- **Typical Caffeine:** ${analysis.typicalCaffeine || 'N/A'}\n`;
            md += `- **Typical L-Theanine:** ${analysis.typicalTheanine || 'N/A'}\n`;
            md += `- **Dominant Flavor Families:** ${analysis.dominantFlavorCategories?.join(', ') || 'N/A'}\n`;
            md += `- **Common Processing:** ${analysis.commonProcessing?.join(', ') || 'N/A'}\n`;
            md += `- **Seasonal Tendency:** ${analysis.seasonalTendency || 'N/A'}\n`;
            md += `- **Typical Time of Day:** ${analysis.baseTimeOfDay?.join(', ') || 'N/A'}\n`;
            md += `- **Common Activity Associations:** ${analysis.baseActivityHints?.join(', ') || 'N/A'}\n`;
        } else {
            md += 'No specific characteristics analysis available.\n';
        }

        return md;
    }

    // Override serialize from BaseCalculator
    serialize(inference) {
        // This serialization logic should remain the same as the original file
        const description = inference?.description || 'No tea type data available.';
        const analysis = inference?.analysis || {};
        const teaType = inference?.teaType || 'unknown'; // Use the identified teaType
        const subType = inference?.subType || ''; // Use the identified subType

        const serializedOutput = {
             description: description,
             primaryType: teaType, // Use the potentially corrected base type
             subType: subType, // Use the identified subtype
             analysis: analysis,
             _sectionRef: "teaType"
        };

         return {
             teaType: serializedOutput // Keep consistent structure
         };
    }

    // Helper method to capitalize first letter (can be moved to utils)
    capitalizeFirstLetter(string) {
        if (!string) return '';
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}