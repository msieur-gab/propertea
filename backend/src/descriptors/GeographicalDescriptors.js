// GeographicalDescriptors.js
// Descriptors and data for geographic influences on tea characteristics.
// Revised structure focusing on concrete impacts (flavor, mouthfeel, compounds).

// --- Factor Classifications ---

export const elevationLevels = {
    veryLow: {
        min: 0, max: 300,
        description: "Very low elevation gardens (<300m) tend towards robust teas with bold flavors and higher astringency.",
        flavorInfluence: ["bold flavors", "higher astringency"],
        mouthFeelInfluence: ["fuller body", "more robust"],
        compoundTendency: ["potentially higher caffeine", "faster growth cycle"]
    },
    low: {
        min: 300, max: 600,
        description: "Low elevation teas (300-600m) often have stronger flavors with moderate complexity.",
        flavorInfluence: ["strong flavors", "moderate complexity"],
        mouthFeelInfluence: ["good body"],
        compoundTendency: []
    },
    medium: {
        min: 600, max: 1200,
        description: "Medium elevation teas (600-1200m) typically balance complexity and strength.",
        flavorInfluence: ["balanced complexity", "developed flavors"],
        mouthFeelInfluence: ["medium body", "smoother texture"],
        compoundTendency: []
    },
    high: {
        min: 1200, max: 1800,
        description: "High elevation teas (1200-1800m) are known for complex, bright flavors and refined characteristics due to slower growth.",
        flavorInfluence: ["complex aromatics", "brighter notes", "enhanced sweetness"],
        mouthFeelInfluence: ["smoother texture", "more delicate body"],
        compoundTendency: ["increases amino acids (L-theanine)", "potentially lower caffeine"]
    },
    veryHigh: {
        min: 1800, max: Infinity,
        description: "Very high elevation teas (>1800m) grow slowly, developing exceptional complexity, delicate aromas, and often higher sweetness.",
        flavorInfluence: ["exceptional complexity", "delicate aromas", "subtle sweetness", "lingering finish (hui gan)"],
        mouthFeelInfluence: ["very smooth texture", "silky body"],
        compoundTendency: ["higher amino acids (L-theanine)", "concentrated flavor compounds"]
    }
};

export const latitudeZones = {
    tropical: {
        min: 0, max: 15,
        description: "Deep tropical zone (0-15°) teas grow year-round in warm, humid conditions, producing vibrant, rich flavors.",
        flavorInfluence: ["vibrant flavors", "rich character", "potentially fruity notes"],
        mouthFeelInfluence: ["full body"],
        compoundTendency: ["faster growth, potentially higher yield"]
    },
    subtropicalLow: {
        min: 15, max: 23.5,
        description: "Lower subtropical zone (15-23.5°) teas benefit from warm seasons and distinct (though mild) winters, creating balanced profiles.",
        flavorInfluence: ["balanced profiles", "good aromatic development"],
        mouthFeelInfluence: ["medium to full body"],
        compoundTendency: []
    },
    subtropicalHigh: {
        min: 23.5, max: 30,
        description: "Upper subtropical zone (23.5-30°) teas experience more noticeable seasonal variations, contributing to complexity.",
        flavorInfluence: ["good complexity", "distinct seasonal notes (flushes)"],
        mouthFeelInfluence: ["medium body"],
        compoundTendency: []
    },
    temperate: {
        min: 30, max: 45,
        description: "Temperate zone (30-45°) teas have distinct seasons, leading to slower growth and often more delicate, nuanced flavors.",
        flavorInfluence: ["delicate flavors", "nuanced profiles", "strong seasonal variation"],
        mouthFeelInfluence: ["lighter to medium body"],
        compoundTendency: ["slower growth concentrates compounds"]
    },
    subpolar: { // Tea growth is rare here
        min: 45, max: 90,
        description: "Subpolar zone (45°+) teas are very rare, growing in challenging conditions with short seasons, likely producing unique, hardy characteristics.",
        flavorInfluence: ["unique characteristics"],
        mouthFeelInfluence: ["variable"],
        compoundTendency: ["slowest growth"]
    }
};

export const humidityLevels = {
    // Humidity influences evaporation, enzyme activity, and microbial life
    veryLow: {
        min: 0, max: 40,
        description: "Very low humidity (<40%) can stress plants, potentially concentrating flavors but hindering optimal growth.",
        flavorInfluence: ["concentrated flavors", "potentially sharp notes"],
        mouthFeelInfluence: ["can increase dryness/astringency"],
        compoundTendency: []
    },
    low: {
        min: 40, max: 55,
        description: "Low humidity (40-55%) can lead to more pronounced flavor intensity.",
        flavorInfluence: ["pronounced intensity", "clear profiles"],
        mouthFeelInfluence: [],
        compoundTendency: []
    },
    moderate: {
        min: 55, max: 70,
        description: "Moderate humidity (55-70%) often supports balanced growth and flavor development.",
        flavorInfluence: ["balanced development"],
        mouthFeelInfluence: ["smooth texture"],
        compoundTendency: []
    },
    high: {
        min: 70, max: 85,
        description: "High humidity (70-85%), often found in prime tea regions, promotes lush growth, smoother textures, and sometimes subtle sweetness.",
        flavorInfluence: ["subtle sweetness", "complex aromas (mist effect)"],
        mouthFeelInfluence: ["smoother texture", "fuller body"],
        compoundTendency: ["lush growth", "may support amino acid development (if cool)"]
    },
    veryHigh: {
        min: 85, max: 100,
        description: "Very high humidity (>85%) can create unique characteristics, sometimes mineral notes, but also risks mold/pests.",
        flavorInfluence: ["distinctive mineral notes (coastal/mist)", "potential for off-notes if poorly managed"],
        mouthFeelInfluence: ["very smooth", "potentially thicker"],
        compoundTendency: ["can affect microbial activity during processing/aging"]
    }
};

// Add temperatureLevels and solarRadiationLevels similarly, focusing on their
// impact on growth speed, compound development (e.g., catechins vs theanine), flavor intensity etc.
export const temperatureLevels = {
    veryLow: {
        min: 0, max: 10,
        description: "Very cool climate teas (0-10°C) are rare and develop slowly with unique characteristics.",
        flavorInfluence: ["very delicate flavors", "unique characteristics"],
        mouthFeelInfluence: ["very light body"],
        compoundTendency: ["highest amino acid concentration", "slowest catechin development"]
    },
    low: {
        min: 10, max: 16,
        description: "Cool climate teas (10-16°C) typically develop delicate flavors with good clarity due to slower growth.",
        flavorInfluence: ["delicate flavors", "good clarity", "enhanced aromatics"],
        mouthFeelInfluence: ["lighter body"],
        compoundTendency: ["promotes amino acids", "slower catechin development"]
    },
    moderate: {
        min: 16, max: 22,
        description: "Moderate temperature teas (16-22°C) offer balanced growth and flavor development.",
        flavorInfluence: ["balanced flavors", "good complexity"],
        mouthFeelInfluence: ["medium body"],
        compoundTendency: ["balanced compound development"]
    },
    high: {
        min: 22, max: 28,
        description: "Warm climate teas (22-28°C) grow faster with stronger flavors and potentially higher astringency.",
        flavorInfluence: ["stronger flavors", "potentially higher astringency"],
        mouthFeelInfluence: ["fuller body"],
        compoundTendency: ["faster catechin development", "potentially higher caffeine"]
    },
    veryHigh: {
        min: 28, max: Infinity,
        description: "Very warm climate teas (>28°C) grow rapidly and may have bolder, more robust characteristics.",
        flavorInfluence: ["bold flavors", "potentially less complexity"],
        mouthFeelInfluence: ["heaviest body", "potential roughness"],
        compoundTendency: ["rapid catechin development", "higher tannins", "reduced amino acids"]
    }
};

export const solarRadiationLevels = {
    veryLow: { // Shade-like conditions
        min: 0, max: 130,
        description: "Very low solar radiation (<130 W/m²) produces teas with delicate flavors and higher amino acid content (like shade-grown).",
        flavorInfluence: ["enhanced umami", "increased sweetness", "reduced bitterness"],
        mouthFeelInfluence: ["smoother"],
        compoundTendency: ["increases L-theanine", "reduces catechins"]
    },
    low: {
        min: 130, max: 170,
        description: "Low solar radiation (130-170 W/m²) promotes slower growth with higher amino acid content.",
        flavorInfluence: ["good sweetness", "reduced astringency"],
        mouthFeelInfluence: ["smooth texture"],
        compoundTendency: ["higher L-theanine to catechin ratio"]
    },
    moderate: {
        min: 170, max: 210,
        description: "Moderate solar radiation (170-210 W/m²) supports balanced compound development.",
        flavorInfluence: ["balanced flavor profile"],
        mouthFeelInfluence: ["medium body"],
        compoundTendency: ["balanced compound development"]
    },
    high: {
        min: 210, max: 250,
        description: "High solar radiation (210-250 W/m²) increases photosynthesis, leading to stronger flavors.",
        flavorInfluence: ["stronger flavors", "increased potential bitterness"],
        mouthFeelInfluence: ["increased astringency"],
        compoundTendency: ["higher catechin production", "reduced amino acids"]
    },
    veryHigh: {
        min: 250, max: Infinity,
        description: "Very high solar radiation (>250 W/m²) results in rapid growth with higher catechin content and astringency.",
        flavorInfluence: ["bold flavors", "heightened bitterness", "potentially less complexity"],
        mouthFeelInfluence: ["highest astringency"],
        compoundTendency: ["maximum catechin development", "lowest amino acid retention"]
    }
};


// --- Region-Specific Data ---

// Define influence notes for specific regions
// These notes combine typical flavor, mouthfeel, and compound tendencies for that region
export const regionInfluenceNotes = {
    "Uji, Japan": ["enhances umami", "smooth texture", "increases L-theanine (shade focus)", "sweet finish"],
    "Wuyi Mountains, China": ["adds minerality ('yan yun')", "roasted notes common", "complex aromatics", "lingering finish"],
    "Darjeeling, India": ["enhances brightness", "promotes complex florals (muscatel)", "delicate body", "seasonal variation strong"],
    "Assam, India": ["promotes boldness", "malty flavors", "full body", "increases caffeine potential"],
    "Alishan, Taiwan": ["enhances florals & sweetness", "creamy/silky mouthfeel", "increases amino acids (high mountain effect)"],
    "Yunnan, China": ["promotes sweetness (honey)", "earthy/woody notes common (esp. Puerh)", "fuller body"],
    // Add more regions...
};

// Function to identify region and return its profile
// (Assume this is more sophisticated, potentially using lat/lon bounding boxes
// and returning a structured object including the notes from regionInfluenceNotes)
export function identifyRegionFromCoordinates(latitude, longitude) {
    // Example simplified logic - replace with actual lookup/geo-fencing
    let region = "Unknown";
    let country = "Unknown";
    let subregion = null;
    let description = "Region could not be determined from coordinates.";
    let influenceNotes = [];

    // Simplified Uji Example
    if (latitude >= 34.7 && latitude <= 35.0 && longitude >= 135.6 && longitude <= 136.0) {
        region = "Uji"; country = "Japan";
        description = "Historic tea region near Kyoto, famed for high-grade matcha and gyokuro.";
        influenceNotes = regionInfluenceNotes["Uji, Japan"];
    }
    // Simplified Wuyi Example
    else if (latitude >= 27.5 && latitude <= 28.0 && longitude >= 117.5 && longitude <= 118.1) {
        region = "Wuyi Mountains"; country = "China"; subregion = "Fujian";
        description = "UNESCO site known for 'rock teas' (yancha) grown in mineral-rich soil.";
        influenceNotes = regionInfluenceNotes["Wuyi Mountains, China"];
    }
    // Add more regions...

    return {
        region,
        country,
        subregion,
        description,
        influenceNotes // Array of characteristic influences
    };
}

// You might still keep regionCharacteristics and other descriptive data separate
// if needed for generating longer descriptions, but the core influence data
// used by the calculator logic should be in the format above (flavorInfluence, etc.).
export const regionCharacteristics = { /* ... descriptive text ... */ };
export const geographicFeatureDescriptions = { /* ... descriptive text ... */ };
export const soilTypeDescriptions = { /* ... descriptive text ... */ };
export const climateDescriptions = { /* ... descriptive text ... */ };


// Combine all geographical descriptors for named export
export const geographicalDescriptors = {
    elevationLevels,
    latitudeZones,
    humidityLevels,
    temperatureLevels,
    solarRadiationLevels,
    regionInfluenceNotes, // Added example
    identifyRegionFromCoordinates,
    // Descriptive text can be kept separate if desired
    regionCharacteristics,
    geographicFeatureDescriptions,
    soilTypeDescriptions,
    climateDescriptions,
};

// Exporting the structure
export default geographicalDescriptors;