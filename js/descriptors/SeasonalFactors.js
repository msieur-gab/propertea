// SeasonalFactors.js
// Defines typical characteristics associated with different tea harvest seasons.

// Descriptions of optimal tea alignment for each season
export const seasonalDescriptions = {
    "Early Spring": "Early Spring (First Flush) teas capture the potent, fresh energy after winter dormancy. Often considered the highest quality harvest, yielding delicate, aromatic teas high in amino acids with vibrant, nuanced flavors.",
    "Late Spring": "Late Spring harvests continue to offer fresh flavors, though potentially less intensely aromatic or complex than the very first flush. Quality remains generally high.",
    "Summer": "Summer harvests typically produce teas with stronger, bolder flavors and more robust character due to increased sunlight and warmth. May have higher astringency.",
    "Autumn": "Autumn harvests often yield teas with deeper, mellower, and sometimes sweeter or more roasted notes as the plant prepares for dormancy. Can offer unique complexity.",
    "Late Autumn": "Late Autumn teas can be similar to Autumn flush but potentially with even deeper, more mature notes. Less common.",
    "Winter": "Winter harvests are rare, typically only possible in warmer climates. Teas harvested in winter often have a unique, sometimes thicker character, potentially lower caffeine, and may be focused on specific cultivars.",
    "Unknown": "The impact of the harvest season is unknown or not applicable."
};

// Profiles defining typical quality and flavor for each season
// Note: These are generalizations; specific regions (like Darjeeling flushes) have unique profiles.
export const seasonalProfiles = {
    "Early Spring": {
        qualityIndicator: "Prime / First Flush",
        typicalFlavorNotes: ["Fresh", "Delicate", "Floral", "Vegetal (light)", "Sweet", "Umami (esp. shaded)", "Bright", "Aromatic"]
    },
    "Late Spring": {
        qualityIndicator: "High / Late First Flush",
        typicalFlavorNotes: ["Fresh", "Floral", "Vegetal", "Sweet", "Balanced"]
    },
    "Summer": {
        qualityIndicator: "Standard / Second Flush",
        typicalFlavorNotes: ["Robust", "Bold", "Fruity", "Malty (for black teas)", "Full-bodied", "More Astringent"]
    },
    "Autumn": {
        qualityIndicator: "Good / Autumn Flush",
        typicalFlavorNotes: ["Mellow", "Sweet", "Nutty", "Roasted (if applicable)", "Woody", "Complex", "Smooth"]
    },
    "Late Autumn": {
        qualityIndicator: "Variable / Late Flush",
        typicalFlavorNotes: ["Deep", "Mature", "Mellow", "Sweet", "Woody"]
    },
    "Winter": {
        qualityIndicator: "Specialty / Winter Harvest",
        typicalFlavorNotes: ["Unique", "Thick", "Subtle Sweetness", "Mineral", "Sometimes Lower Aroma"]
    },
    "Unknown": {
        qualityIndicator: "Unknown",
        typicalFlavorNotes: ["Variable"]
    }
};


export default {
    seasonalDescriptions,
    seasonalProfiles
};

// Example usage within GeographyCalculator:
// import { seasonalProfiles, seasonalDescriptions } from '../descriptors/SeasonalFactors.js';
//
// function getSeasonalProfileData(seasonName) {
//    const profile = seasonalProfiles[seasonName] || seasonalProfiles["Unknown"];
//    const description = seasonalDescriptions[seasonName] || seasonalDescriptions["Unknown"];
//    return {
//        qualityIndicator: profile.qualityIndicator,
//        flavorProfileDescription: profile.typicalFlavorNotes.join(', '), // Or return array
//        fullDescription: description
//    };
// }