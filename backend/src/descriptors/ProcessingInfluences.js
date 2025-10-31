// processingInfluences.js
// Renamed from processingMethodMoodAlignment.js with updated terminology

import { effectNameSubstitution } from './EffectMapping.js';

const toNewEffects = effectNameSubstitution.toNewEffects;

export const processingInfluences = {
    // Heat Treatment Methods
    'steamed': {
        effects: {
            focusing: 3.0,   // Was 'clarifying' - updated to standard effect name
            calming: 2.5     // Was 'peaceful' - updated to standard effect name
        },
        intensity: 1.9,
        category: 'heat',
        description: 'Gentle heat preservation that maintains delicate compounds and promotes mental clarity',
        seasonalExplanations: {
            spring: "Steaming preserves the fresh, vegetal notes that align with spring preferences.",
            summer: "Steamed processing preserves cooling properties beneficial in summer.",
            fall: "Steamed processing creates lighter profiles less aligned with fall preferences.",
            winter: "Steamed teas typically lack the warming characteristics desired in winter."
        }
    },
    'pan-fired': {
        effects: toNewEffects({
            energizing: 2.6,   // Was 'revitalizing' - updated to standard effect name
            focusing: 2.2      // Was 'awakening' - updated to standard effect name
        }),
        intensity: 1.2,
        category: 'heat',
        description: 'Light toasting method that adds complexity, stimulation, and mental alertness'
    },
    'light-roast': {
        effects: toNewEffects({
            calming: 2.5,       // Was 'peaceful'
            grounding: 2.2      // Was 'reflective'
        }),
        intensity: 1.0,
        category: 'heat',
        description: 'Subtle roasting that enhances flavor subtleties and promotes gentle mental exploration'
    },
    'minimal-roast': {
        effects: {
            elevating: 4.5,     // Was original
            harmonizing: 2.0    // Was original
        },
        intensity: 1.2,
        category: 'heat',
        description: 'Very light roasting that preserves natural brightness and creates uplifting qualities'
    },
    'medium-roast': {
        effects: toNewEffects({
            comforting: 3.0,         // Was 'nurturing'
            harmonizing: 2.2         // Was 'balancing'
        }),
        intensity: 1.5,
        category: 'heat',
        description: 'Balanced roasting that develops rich, complex notes and provides centered energy',
        seasonalExplanations: {
            spring: "Medium roasting adds depth that can compete with spring's preference for lighter notes.",
            summer: "Medium roasted teas may be less refreshing during summer heat.",
            fall: "Medium roasting creates warm notes that align well with fall's deeper flavor preferences.",
            winter: "Medium roasted teas provide good warmth appropriate for winter enjoyment."
        }
    },
    'heavy-roast': {
        effects: toNewEffects({
            comforting: 3.8,         // Was 'nurturing'
            grounding: 3.5,          // Was 'centering'/'stabilizing'
            harmonizing: 1.5
        }),
        intensity: 1.8,
        category: 'heat',
        description: 'Intense roasting creating deep, transformative flavors and profound introspection',
        seasonalExplanations: {
            spring: "Heavy roasting creates flavors too intense for spring's lighter preferences.",
            summer: "Heavy roasted teas tend to be warming, counteracting summer's need for refreshment.",
            fall: "Heavy roasting creates nutty, toasty notes that perfectly complement fall.",
            winter: "Heavy roasted teas provide deeply warming comfort ideal for winter enjoyment."
        }
    },
    'charcoal-roasted': {
        effects: toNewEffects({
            comforting: 3.8,         // Was 'nurturing'
            grounding: 3.5,          // Was 'centering'/'stabilizing'
            harmonizing: 2.0
        }),
        intensity: 2.2,
        category: 'heat',
        description: 'Traditional roasting method with profound depth, promoting deep connection and inner stability'
    },
    // Sun Processing Methods
    'sun-dried': {
        effects: toNewEffects({
            calming: 2.5,            // Was 'peaceful'
            restorative: 2.2         // Was 'renewing'
        }),
        intensity: 1.6,
        category: 'drying',
        description: 'Natural drying process that preserves delicate characteristics while adding subtle complexity and brightness',
        seasonalExplanations: {
            spring: "Sun-drying preserves natural freshness that aligns with spring's character.",
            summer: "Sun-dried teas retain a brightness that's appealing during summer.",
            fall: "Sun-dried teas may lack the depth preferred during fall transitions.",
            winter: "Sun-dried teas often lack the warming intensity sought in winter."
        }
    },

    // Oxidation Methods
    'withered': {
        effects: toNewEffects({
            calming: 2.5,            // Was 'peaceful'
            harmonizing: 2.2,        // Was 'balancing'
            elevating: 2.0
        }),
        intensity: 1.2,
        category: 'oxidation',
        description: 'Initial processing that preserves natural essence and promotes gentle mental clarity',
        seasonalExplanations: {
            spring: "Withering preserves delicate qualities that harmonize with spring's freshness.",
            summer: "Withered teas maintain a gentleness suitable for summer enjoyment.",
            fall: "Withering creates subtle complexity that can complement fall's transitional nature.",
            winter: "Withered teas provide moderate warmth appropriate for winter."
        }
    },
    'oxidised': {
        effects: toNewEffects({
            energizing: 2.5,         // Was 'revitalizing'
            focusing: 2.5,           // Was 'awakening'
            elevating: 2.5
        }),
        intensity: 1.5,
        category: 'oxidation',
        description: 'Increases complexity, develops bold characteristics, and stimulates mental energy'
    },
    'partial-oxidation': {
        effects: toNewEffects({
            harmonizing: 3.0,        // Was 'balancing'
            grounding: 2.2,          // Was 'reflective'
            elevating: 2.5
        }),
        intensity: 1.3,
        category: 'oxidation',
        description: 'Balanced approach maintaining nuanced flavors and promoting mental equilibrium',
        seasonalExplanations: {
            spring: "Partial oxidation creates a balance that can work well with spring's character.",
            summer: "Partially oxidized teas offer moderate refreshment suitable for summer.",
            fall: "Partial oxidation provides nuanced depth that complements fall's transitional nature.",
            winter: "Partial oxidation offers moderate warmth appropriate for winter."
        }
    },
    'full-oxidation': {
        effects: toNewEffects({
            energizing: 2.5,         // Was 'revitalizing'
            comforting: 2.8,         // Was 'nurturing'
            grounding: 2.5          // Was 'centering'/'stabilizing'
        }),
        intensity: 1.7,
        category: 'oxidation',
        description: 'Complete transformation of leaf characteristics, creating robust and centering experiences',
        seasonalExplanations: {
            spring: "Full oxidation creates stronger flavors that can overwhelm spring's lighter preferences.",
            summer: "Fully oxidized teas tend to have warming properties less ideal for summer refreshment.",
            fall: "Full oxidation creates rich, robust flavors that harmonize with fall's deeper taste preferences.",
            winter: "Full oxidation creates warming comfort ideal for winter consumption."
        }
    },
    'kill-green': {
        effects: toNewEffects({
            focusing: 2.8,           // Was 'clarifying'
            calming: 2.2             // Was 'soothing'
        }),
        intensity: 1.4,
        category: 'oxidation',
        description: 'Halts enzymatic processes, preserving delicate compounds and promoting mental clarity'
    },

    // Growing and Processing Methods
    'shade-grown': {
        effects: {
            focusing: 3.0,      // Slight decrease from 3.5
            calming: 3.0,
            elevating: 3.5,     // Increase from 3.0
        },
        intensity: 2.5,
        category: 'growing',
        description: 'Increases amino acids and L-theanine content, promoting deep mental stillness',
        seasonalExplanations: {
            spring: "Shade-grown processing enhances umami and L-theanine content, perfect for spring.",
            summer: "Shade-grown tea's higher L-theanine content provides a cooling focus beneficial in summer.",
            fall: "Shade-grown characteristics are less relevant to fall's flavor preferences.",
            winter: "Shade-grown teas often lack the warming qualities desired in winter."
        }
    },
    'minimal-processing': {
        effects: toNewEffects({
            elevating: 3.5,     // Was original
            calming: 2.2,       // Was 'peaceful'
            focusing: 2.0        // Was 'clarifying'
        }),
        intensity: 2.0,
        category: 'processing',
        description: 'Preserves the most natural tea characteristics with holistic, gentle approach',
        seasonalExplanations: {
            spring: "Minimal processing preserves the fresh character that aligns with spring.",
            summer: "Minimally processed teas retain cooling properties beneficial in summer heat.",
            fall: "Minimal processing creates lighter profiles that may lack fall's deeper flavor preferences.",
            winter: "Minimally processed teas often lack the warming characteristics sought in winter."
        }
    },
    'gaba-processed': {
        effects: toNewEffects({
            calming: 3.5,       // Was 'soothing'
            grounding: 3.0      // Was 'centering'
        }),
        intensity: 2.5,
        category: 'special',
        description: 'Specifically designed to enhance relaxation and holistic well-being compounds'
    },

    // Post-processing Methods
    'aged': {
        effects: toNewEffects({
            grounding: 4.5,     // Increase from 3.8
            comforting: 3.0,    // Increase from 2.5
        }),
        intensity: 2.2,         // Increase from 1.9
        category: 'aged',
        description: 'Time-enhanced development of complex characteristics and deep mental stability',
        seasonalExplanations: {
            spring: "Aged teas present developed flavors that may contrast with spring's preference for freshness.",
            summer: "Aged teas tend to have warming properties less ideal for summer refreshment.",
            fall: "Aged teas create complex, developed notes that harmonize with fall's deeper preferences.",
            winter: "Aged teas provide warming comfort ideal for winter consumption."
        }
    },
    'compressed': {
        effects: toNewEffects({
            grounding: 2.8,         // Was 'centering'
            grounding: 2.5          // Was 'stabilizing'
        }),
        intensity: 1.6,
        category: 'post-processing',
        description: 'Traditional storage method that promotes slow development of grounding characteristics'
    },
    'fermented': {
        effects: toNewEffects({
            grounding: 5.0,         // Increase from 4.0
            comforting: 3.0,        // Increase from 2.5
        }),
        intensity: 2.0,             // Increase from 1.7
        category: 'aged',
        description: 'Controlled microbial transformation creating complex characteristics and grounding effects',
        seasonalExplanations: {
            spring: "Fermented teas present strong flavors that may overpower spring's preference for freshness.",
            summer: "Fermented teas tend to have warming properties less suited for summer refreshment.",
            fall: "Fermentation creates complex, earthy notes that harmonize perfectly with fall.",
            winter: "Fermented teas provide deep warming comfort ideal for winter consumption."
        }
    },
    'post-processing-roasted': {
        effects: toNewEffects({
            comforting: 3.2,        // Was 'nurturing'
            comforting: 2.8         // Was 'comforting'
        }),
        intensity: 2.2,
        category: 'post-processing',
        description: 'Secondary roasting that adds depth, complexity, and promotes comforting experiences'
    },

    // Scented Methods
    'jasmine-scented': {
        effects: toNewEffects({
            calming: 5.8,           // Combined 'peaceful' (3.0) and 'soothing' (2.8)
            elevating: 2.0          // Added elevating as secondary effect
        }),
        intensity: 2.2,
        category: 'scented',
        description: 'Traditional floral scenting that enhances calming properties and promotes relaxation'
    },
    'osmanthus-scented': {
        effects: {
            elevating: 2.8,         // Was original
            restorative: 2.5         // Was 'renewing'
        },
        intensity: 2.0,
        category: 'scented',
        description: 'Sweet, apricot-like scenting that enhances mood-lifting properties'
    },
    'rose-scented': {
        effects: toNewEffects({
            comforting: 2.5,        // Was 'nurturing'
            calming: 3.0            // Was 'soothing'
        }),
        intensity: 2.1,
        category: 'scented',
        description: 'Romantic floral scenting that promotes emotional balance and gentle comfort'
    },

    // Modern Methods
    'CTC': {
        effects: toNewEffects({
            energizing: 3.2,         // Was 'revitalizing'
            focusing: 2.8            // Was 'awakening'
        }),
        intensity: 1.6,
        category: 'modern',
        description: 'Crush-tear-curl processing creating quick-extracting tea with stimulating properties'
    },
    'modern-steaming': {
        effects: toNewEffects({
            focusing: 2.8,           // Was 'clarifying'
            harmonizing: 2.0         // Was 'balancing'
        }),
        intensity: 1.5,
        category: 'modern',
        description: 'Machine-controlled steaming that preserves fresh characteristics and promotes clarity'
    }
};

// Remap from processing methods to primary effects
export const processingToPrimaryEffectMap = {
    'steamed': {
        'focusing': 2.5,
        'calming': 2.0
    },
    'pan-fired': {
        'energizing': 2.2,
        'focusing': 1.8
    },
    'light-roast': {
        'calming': 2.5,
        'grounding': 2.2
    },
    'medium-roast': {
        'comforting': 2.8,
        'harmonizing': 2.2
    },
    'heavy-roast': {
        'comforting': 3.0,
        'grounding': 3.5
    },
    'charcoal-roasted': {
        'comforting': 2.5,
        'grounding': 3.0
    },
    'sun-dried': {
        'elevating': 1.8,
        'calming': 1.5
    },
    'withered': {
        'calming': 1.5,
        'harmonizing': 1.2
    },
    'oxidised': {
        'energizing': 2.5,
        'focusing': 2.0
    },
    'partial-oxidation': {
        'harmonizing': 2.5,
        'focusing': 1.5
    },
    'full-oxidation': {
        'energizing': 2.8,
        'comforting': 2.0
    },
    'kill-green': {
        'focusing': 2.2,
        'calming': 1.5
    },
    'shade-grown': {
        'focusing': 3.0,
        'calming': 3.0,
        'elevating': 3.5
    },
    'minimal-processing': {
        'elevating': 2.0,
        'calming': 1.8
    },
    'gaba-processed': {
        'calming': 3.0,
        'restorative': 2.5
    },
    'aged': {
        'grounding': 4.5,
        'comforting': 3.0
    },
    'compressed': {
        'grounding': 2.2,
        'comforting': 1.8
    },
    'fermented': {
        'grounding': 5.0,
        'comforting': 3.0
    },
    'post-processing-roasted': {
        'comforting': 2.8,
        'grounding': 2.5
    },
    'jasmine-scented': {
        'calming': 2.5,
        'elevating': 2.0
    },
    'osmanthus-scented': {
        'elevating': 2.5,
        'harmonizing': 2.0
    },
    'rose-scented': {
        'calming': 2.2,
        'comforting': 2.0
    },
    'CTC': {
        'energizing': 3.0,
        'focusing': 2.0
    },
    'modern-steaming': {
        'focusing': 2.0,
        'calming': 1.5
    }
};

export default {
    processingInfluences,
    processingToPrimaryEffectMap
};