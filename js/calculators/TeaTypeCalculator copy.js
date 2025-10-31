// TeaTypeCalculator.js
// Handles determining baseline characteristics and tendencies based on tea type.

import { BaseCalculator } from './BaseCalculator.js';
// Assuming your revised reference data is here:
import {teaTypeDescriptors} from '../descriptors/TeaTypeDescriptors.js'; // Or '../reference-data/TeaTypeDescriptors.js'

// Helper function to get data for a type/subtype, falling back from subtype to primary type
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
    else if (teaType.includes('-') && descriptors[teaType.split('-')[0]]?.base) {
        const baseType = teaType.split('-')[0];
         // Attempt to find subtype data within the base type
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
    } else if (!data.description) {
         data.description = `Information for ${teaType} ${subType}.`;
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

    // Override infer method from BaseCalculator
    infer(tea) {
        // Initialize the trace array
        let trace = [];
        
        const teaType = tea?.type?.toLowerCase() || 'unknown';
        const subType = tea?.subType?.toLowerCase() || '';

        trace.push({ 
            step: "Type Identification", 
            reason: "Input tea data", 
            adjustment: `Identified Type: ${teaType}${subType ? ', SubType: ' + subType : ''}`,
            value: `${teaType}${subType ? '/' + subType : ''}`
        });

        if (teaType === 'unknown') {
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

        // Get the relevant data from reference (TeaTypeDescriptors.js)
        const typeData = getTypeData(teaType, subType);
        
        // Record which data source was used
        let dataSource = "Primary Type";
        if (subType && teaTypeDescriptors[teaType]?.subTypes?.[subType]) {
            dataSource = "SubType Override";
        } else if (teaType.includes('-') && teaTypeDescriptors[teaType.split('-')[0]]?.base) {
            dataSource = "Composite Type";
        }
        
        trace.push({ 
            step: "Descriptor Lookup", 
            reason: `Looked up '${teaType}'${subType ? '/' + subType : ''} in TeaTypeDescriptors`, 
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
            commonProcessing: typeData.commonProcessing // Good for context
        };
        
        trace.push({ 
            step: "Analysis Extraction", 
            reason: "Extracted from typeData", 
            adjustment: `Typical Caffeine: ${analysis.typicalCaffeine}, Theanine: ${analysis.typicalTheanine}`, 
            value: `Dominant flavors: ${analysis.dominantFlavorCategories?.join(', ') || 'None'}`
        });
        
        trace.push({ 
            step: "Activity Association", 
            reason: "Type characteristic", 
            adjustment: `Time preference: ${analysis.baseTimeOfDay?.join(', ') || 'None'}`, 
            value: `Activities: ${analysis.baseActivityHints?.join(', ') || 'None'}`
        });
        
        trace.push({ 
            step: "Processing Methods", 
            reason: "Type characteristic", 
            adjustment: `Common processing methods identified`, 
            value: `Methods: ${analysis.commonProcessing?.join(', ') || 'None'}`
        });

        return {
            teaType,
            subType,
            description: typeData.description, // Use description from reference data
            analysis, // This object holds the characteristics/tendencies
            trace
        };
    }

    // Override formatInference from BaseCalculator
    formatInference(inference) {
        if (!inference || inference.teaType === 'unknown') {
            return '## Tea Type Analysis\n\nNo tea type data available.';
        }

        let md = `## Tea Type Analysis: ${this.capitalizeFirstLetter(inference.teaType)}`;
        if (inference.subType) {
             md += ` (${this.capitalizeFirstLetter(inference.subType)})`;
        }
        md += '\n\n';

        // Add description
        md += `${inference.description || 'No description provided.'}\n\n`;

        // Add Type Characteristics & Tendencies section
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
         // Handle case where inference might be minimal due to unknown type
        const description = inference?.description || 'No tea type data available.';
        const analysis = inference?.analysis || {};
        const teaType = inference?.teaType || 'unknown';
        const subType = inference?.subType || '';

        // Structure the output consistently
        const serializedOutput = {
             description: description,
             primaryType: teaType,
             subType: subType,
             analysis: analysis, // Serialize the new analysis object
             _sectionRef: "teaType" // Keep if you use references
        };

         // Decide on a consistent top-level key.
         // If other calculators output { calculatorName: {...} }, use that pattern.
         // If they output directly, adjust accordingly. Let's assume a pattern.
         return {
             teaType: serializedOutput
         };

        /* // Alternative: If serializing directly without top-level key:
        return {
             description: description,
             primaryType: teaType,
             subType: subType,
             analysis: analysis,
             _sectionRef: "teaType"
         };
        */
    }

    // Helper method to capitalize first letter (can be moved to utils)
    capitalizeFirstLetter(string) {
        if (!string) return '';
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}