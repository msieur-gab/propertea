// GeographicalDescriptors.js
// Descriptors and data for geographic influences on tea characteristics

// Define elevation classifications (in meters)
export const elevationLevels = {
    veryLow: { 
        min: 0, 
        max: 300,
        description: "Very low elevation tea gardens (below 300m) produce robust, full-bodied teas with higher astringency and bold flavors.",
        effects: {
            energizing: 2.5,
            grounding: 2.0,
            comforting: 1.5
        }
    },
    low: { 
        min: 300, 
        max: 600,
        description: "Low elevation teas (300-600m) typically offer stronger flavors with moderate complexity and good body.",
        effects: {
            energizing: 2.0,
            grounding: 1.5,
            comforting: 1.0,
            harmonizing: 1.0
        }
    },
    medium: { 
        min: 600, 
        max: 1200,
        description: "Medium elevation teas (600-1200m) balance complexity and strength, with developed flavor profiles.",
        effects: {
            harmonizing: 2.0,
            focusing: 1.5,
            elevating: 1.0,
            energizing: 1.0
        }
    },
    high: { 
        min: 1200, 
        max: 1800,
        description: "High elevation teas (1200-1800m) develop complex flavor profiles with bright notes and refined characteristics.",
        effects: {
            focusing: 2.5,
            elevating: 2.0,
            harmonizing: 1.5,
            calming: 1.0
        }
    },
    veryHigh: { 
        min: 1800, 
        max: Infinity,
        description: "Very high elevation teas (above 1800m) grow slowly, developing exceptional complexity, delicate aromas, and subtle sweetness.",
        effects: {
            elevating: 3.0,
            focusing: 2.5,
            calming: 2.0,
            harmonizing: 1.0
        }
    }
};

// Define 5-level latitude classifications (in degrees)
export const latitudeZones = {
    tropical: { 
        min: 0, 
        max: 15,
        description: "Deep tropical zone teas grow in consistent warm temperatures with abundant rainfall, producing vibrant, rich flavors.",
        effects: {
            energizing: 2.5,
            grounding: 1.5,
            comforting: 1.0
        }
    },
    subtropicalLow: { 
        min: 15, 
        max: 23.5,
        description: "Lower subtropical zone teas benefit from warm growing seasons with moderate rainfall, creating balanced profiles.",
        effects: {
            energizing: 2.0,
            elevating: 1.5,
            focusing: 1.0
        }
    },
    subtropicalHigh: { 
        min: 23.5, 
        max: 30,
        description: "Upper subtropical zone teas develop unique characteristics from seasonal variations, with good complexity.",
        effects: {
            harmonizing: 2.0,
            elevating: 1.5,
            focusing: 1.0
        }
    },
    temperate: { 
        min: 30, 
        max: 45,
        description: "Temperate zone teas experience distinct seasonal changes that create delicate flavors with unique seasonal variations.",
        effects: {
            focusing: 2.0,
            harmonizing: 1.5,
            calming: 1.0
        }
    },
    subpolar: { 
        min: 45, 
        max: 90,
        description: "Subpolar zone teas are rare, growing in challenging conditions with short growing seasons, typically with distinctive character.",
        effects: {
            focusing: 2.5,
            calming: 1.5,
            restorative: 1.0
        }
    }
};

// Define humidity level classifications (in percentage)
export const humidityLevels = {
    veryLow: { 
        min: 0, 
        max: 40,
        description: "Very low humidity regions produce teas with concentrated flavors and often distinct aromatic qualities.",
        effects: {
            focusing: 2.0,
            energizing: 1.5,
            grounding: 1.0
        }
    },
    low: { 
        min: 40, 
        max: 55,
        description: "Low humidity environments develop teas with more pronounced flavor intensity and clear profiles.",
        effects: {
            focusing: 1.5,
            energizing: 1.5,
            elevating: 1.0
        }
    },
    moderate: { 
        min: 55, 
        max: 70,
        description: "Moderate humidity creates balanced teas with good flavor development and moderate aromatics.",
        effects: {
            harmonizing: 2.0,
            focusing: 1.0,
            elevating: 1.0
        }
    },
    high: { 
        min: 70, 
        max: 85,
        description: "High humidity environments produce teas with smooth textures and often subtle sweetness.",
        effects: {
            calming: 1.5,
            restorative: 1.5,
            comforting: 1.0,
            harmonizing: 1.0
        }
    },
    veryHigh: { 
        min: 85, 
        max: 100,
        description: "Very high humidity regions develop unique characteristics in tea, often with distinctive mineral notes and soothing qualities.",
        effects: {
            calming: 2.0,
            restorative: 2.0,
            grounding: 1.5,
            comforting: 1.0
        }
    }
};

// Define temperature range classifications (in °C)
export const temperatureLevels = {
    veryLow: { 
        min: -Infinity, 
        max: 10,
        description: "Very cold climate teas grow slowly, developing unique character with often subtle complexity.",
        effects: {
            calming: 2.0,
            focusing: 1.5,
            harmonizing: 1.0
        }
    },
    low: { 
        min: 10, 
        max: 16,
        description: "Cool climate teas typically develop delicate flavors with good clarity and moderate complexity.",
        effects: {
            focusing: 2.0,
            calming: 1.5,
            elevating: 1.0
        }
    },
    moderate: { 
        min: 16, 
        max: 22,
        description: "Moderate temperature regions produce balanced teas with good complexity and structure.",
        effects: {
            harmonizing: 2.0, 
            focusing: 1.5,
            elevating: 1.0
        }
    },
    high: { 
        min: 22, 
        max: 28,
        description: "Warm climate teas often develop stronger flavor profiles with pronounced character.",
        effects: {
            energizing: 2.0,
            grounding: 1.5,
            comforting: 1.0
        }
    },
    veryHigh: { 
        min: 28, 
        max: Infinity,
        description: "Very hot climate teas typically produce robust, full-bodied characteristics with stronger effects.",
        effects: {
            energizing: 2.5,
            grounding: 2.0,
            comforting: 1.5
        }
    }
};

// Define solar radiation level classifications (in W/m²)
export const solarRadiationLevels = {
    veryLow: { 
        min: 0, 
        max: 130,
        description: "Very low solar radiation regions produce teas with delicate, subtle flavors and higher amino acid content including L-theanine.",
        effects: {
            calming: 3.0,
            focusing: 2.0,
            elevating: 1.0,
            energizing: -0.5 // negative modifier to reduce energizing effects
        }
    },
    low: { 
        min: 130, 
        max: 170,
        description: "Low solar radiation regions develop teas with balanced amino acids and moderate catechin levels.",
        effects: {
            calming: 2.5,
            focusing: 2.0,
            harmonizing: 1.5,
            elevating: 1.0
        }
    },
    moderate: { 
        min: 170, 
        max: 210,
        description: "Moderate solar radiation produces well-balanced teas with good complexity and moderate astringency.",
        effects: {
            focusing: 2.0,
            energizing: 1.5,
            harmonizing: 2.0,
            elevating: 1.0
        }
    },
    high: { 
        min: 210, 
        max: 250,
        description: "High solar radiation regions produce teas with robust flavors, more pronounced astringency and stimulating qualities.",
        effects: {
            energizing: 2.5,
            focusing: 1.5,
            grounding: 1.0,
            elevating: 1.0
        }
    },
    veryHigh: { 
        min: 250, 
        max: Infinity,
        description: "Very high solar radiation produces teas with intense characteristics, high antioxidant content and strong stimulating effects.",
        effects: {
            energizing: 3.0,
            focusing: 2.0,
            grounding: 1.5,
            comforting: 1.0
        }
    }
};

// Geographic feature descriptions
export const geographicFeatureDescriptions = {
    'mountain': "Mountain terrain provides good drainage, temperature variation, and often mineral-rich soil, contributing to complex flavors with bright notes and good clarity.",
    'high-mountain': "High mountain environments offer intense sunlight, cool temperatures, significant day-night temperature variations, and often mist coverage, developing exceptional complexity, brightness, and subtle sweetness in teas.",
    'forest': "Forest environments provide natural shade, biodiversity, and rich organic soil composition, producing teas with depth, complexity, and often distinctive aromatic qualities.",
    'coastal': "Coastal regions offer mineral influences from sea breezes, moderate temperatures, and often higher humidity, creating teas with distinctive mineral notes and refreshing qualities.",
    'river-delta': "River deltas provide nutrient-rich alluvial soil, good water access, and typically lower elevations, producing teas with rich body, smooth texture, and often robust flavor profiles.",
    'valley': "Valley settings offer protection from extreme weather, good soil deposition, and often mist coverage, developing teas with balance, smoothness, and often a good harmony of characteristics.",
    'plateau': "Plateau regions provide consistent elevation, good sunlight exposure, and often distinctive soil compositions, producing teas with clarity, brightness, and regional uniqueness.",
    'volcanic': "Volcanic regions have mineral-rich soil with excellent drainage, contributing to teas with distinctive mineral notes, vibrancy, and often good structural characteristics."
};

// Soil type descriptions
export const soilTypeDescriptions = {
    'volcanic': "Volcanic soil is rich in minerals with excellent drainage, producing teas with vibrant character, good mineral notes, and often a distinctive brightness.",
    'mineral-rich': "Mineral-rich soils provide essential trace elements that enhance complexity and often add distinctive notes to teas grown in these conditions.",
    'loamy': "Loamy soil balances drainage and water retention with good nutrient content, supporting healthy tea plants that produce balanced, well-developed flavors.",
    'sandy-loam': "Sandy-loam soil offers good drainage while retaining moderate nutrients, creating teas with clean flavor profiles and often good clarity.",
    'alluvial': "Alluvial soil from river deposits is typically nutrient-rich and moisture-retentive, producing teas with full body, richness, and often stronger flavor characteristics.",
    'laterite': "Laterite soil is typically iron-rich, well-draining, and found in tropical regions, contributing to teas with distinctive regional character and often good structure.",
    'rocky': "Rocky soil provides excellent drainage and mineral content but challenges the plants, often resulting in teas with concentrated flavors, good structure, and mineral notes.",
    'volcanic-loam': "Volcanic-loam combines mineral content with good organic structure, producing teas with complex profiles that balance mineral brightness with depth.",
    'volcanic-alluvial': "Volcanic-alluvial soil merges mineral richness with nutrient density, creating teas with vibrant characteristics, good body, and often enhanced complexity."
};

// Climate type descriptions
export const climateDescriptions = {
    'tropical': "Tropical climates provide consistent warmth with abundant rainfall, producing teas with vibrant character, full development, and often distinctive regional notes.",
    'tropical-highland': "Tropical highland climates combine consistent temperatures with cooling effects of elevation, creating teas with complexity, brightness, and refined character.",
    'subtropical': "Subtropical climates offer warm growing conditions with moderate seasonal variation, producing well-balanced teas with good flavor development.",
    'subtropical-highland': "Subtropical highland climates provide moderated temperatures with elevation effects, ideal for developing complex, aromatic teas with excellent structure.",
    'temperate': "Temperate climates with distinct seasons create seasonal variation in tea growth, often producing more delicate flavors with unique characteristics between harvests.",
    'humid-subtropical': "Humid subtropical climates combine warmth with significant moisture, producing teas with full body, rich flavors, and often smooth mouthfeel."
};

// Mapping specific regions to effects and descriptions
export const regionEffectMapping = {
    // China tea regions
    "Yunnan": {
        country: "China",
        effects: {
            grounding: 2.5, 
            energizing: 1.5,
            comforting: 1.5
        },
        description: "Yunnan's diverse ecosystem produces distinctive teas with notes of honey, malt, and earthy characteristics."
    },
    "Fujian": {
        country: "China",
        effects: {
            harmonizing: 2.0,
            elevating: 1.8,
            focusing: 1.5
        },
        description: "Fujian's mountainous coastal terrain creates complex teas with floral-fruity notes and mineral brightness."
    },
    "Guangdong": {
        country: "China",
        effects: {
            elevating: 2.5,
            focusing: 1.5, 
            energizing: 1.0
        },
        description: "Guangdong's subtropical climate produces teas with honey-orchid notes and distinctive floral character."
    },
    "Chaozhou": {
        country: "China",
        subregion: "Guangdong",
        effects: {
            elevating: 3.0,
            focusing: 1.8, 
            energizing: 1.5
        },
        description: "The Chaozhou region of Guangdong is known for producing highly aromatic dancong oolongs with pronounced elevating effects."
    },
    "Phoenix Mountain": {
        country: "China",
        subregion: "Guangdong",
        effects: {
            elevating: 3.0,
            focusing: 1.5, 
            energizing: 1.5
        },
        description: "Phoenix Mountain produces exceptional Dan Cong oolongs with distinctive honey-orchid character and strong elevating effects."
    },
    "Wuyi Mountains": {
        country: "China",
        subregion: "Fujian",
        effects: {
            grounding: 2.5,
            comforting: 2.0,
            focusing: 1.5
        },
        description: "Wuyi Mountains produce distinctive rock oolongs with mineral character and complex aromatic profiles that create grounding effects."
    },

    // Japan regions
    "Uji": {
        country: "Japan",
        effects: {
            focusing: 2.5,
            calming: 2.0,
            elevating: 2.0
        },
        description: "Uji region produces refined teas with umami richness and balanced sweetness, known especially for shade-grown varieties."
    },
    "Kyoto": {
        country: "Japan",
        effects: {
            focusing: 2.0,
            calming: 2.5,
            elevating: 1.8
        },
        description: "Kyoto Prefecture produces high-quality Japanese teas with refined character and balanced effects."
    },
    "Shizuoka": {
        country: "Japan",
        effects: {
            focusing: 2.0,
            energizing: 1.8,
            harmonizing: 1.5
        },
        description: "Shizuoka is Japan's largest tea-producing region, creating balanced, clean teas with refreshing character."
    },

    // India regions
    "Darjeeling": {
        country: "India",
        effects: {
            elevating: 2.0,
            focusing: 1.5,
            harmonizing: 1.5
        },
        description: "Darjeeling's high Himalayan slopes produce the 'champagne of teas' with muscatel notes and bright character."
    },
    "Assam": {
        country: "India",
        effects: {
            energizing: 2.5,
            grounding: 1.5,
            focusing: 1.0
        },
        description: "Assam's lowland valley creates bold, malty teas with robust body and brisk character."
    },

    // Taiwan regions
    "Taiwan": {
        country: "Taiwan",
        effects: {
            harmonizing: 2.0,
            elevating: 2.0,
            calming: 1.5
        },
        description: "Taiwan produces exceptional oolongs with remarkable complexity, silky texture and refined character."
    },
    "Ali Mountain": {
        country: "Taiwan",
        subregion: "Chiayi County",
        effects: {
            elevating: 2.5,
            harmonizing: 2.0,
            calming: 1.5
        },
        description: "Ali Mountain (Alishan) produces high mountain oolongs with delicate sweetness, creamy texture and floral complexity."
    }
};

// Region-specific characteristics and descriptions
export const regionCharacteristics = {
    // China regions
    'yunnan': { 
        description: "Yunnan's diverse ecosystem with ancient tea forests, high elevations, and mineral-rich soil produces distinctive teas with notes of honey, malt, and earthy characteristics, famous for puerh and golden-tipped black teas.",
        signature: "honeyed sweetness, earthy depth, peppery notes",
        famous_styles: ["puerh", "dian hong", "yunnan gold"]
    },
    'fujian': { 
        description: "Fujian's mountainous coastal terrain with rocky soil creates complex teas with floral-fruity notes and mineral brightness, home to oolong varieties and white teas with distinctive characteristics.",
        signature: "floral complexity, fruit notes, mineral brightness", 
        famous_styles: ["white peony", "silver needle", "tie guan yin", "da hong pao"]
    },
    'anhui': { 
        description: "Anhui's forested mountains with loamy soil and misty conditions produce teas with delicate complexity, subtle sweetness, and often smoky notes in some varieties.",
        signature: "subtle complexity, gentle sweetness, occasional smokiness",
        famous_styles: ["keemun", "huang shan mao feng"]
    },
    'zhejiang': { 
        description: "Zhejiang's varied landscape from coastal to mountainous regions creates teas with fresh vegetal notes, pleasant sweetness, and distinctive character, famous for Long Jing (Dragonwell).",
        signature: "fresh vegetal notes, nutty warmth, clean finish",
        famous_styles: ["long jing", "anji bai cha"]
    },
    'guangdong': { 
        description: "Guangdong's subtropical climate with rich soil produces teas with honey-orchid notes, smooth texture, and distinctive aromas, known for dancong oolongs with remarkable flavor diversity.",
        signature: "honey-orchid aroma, fruity complexity, smooth texture",
        famous_styles: ["phoenix dancong", "yingde black"]
    },
    
    // Japan regions
    'kyoto': { 
        description: "Kyoto's misty valleys with volcanic soil produce refined teas with umami richness, balanced sweetness, and fresh verdant notes, known for high-quality tencha and gyokuro.",
        signature: "umami depth, balanced sweetness, refined character",
        famous_styles: ["matcha", "gyokuro", "kabusecha"]
    },
    'uji': { 
        description: "Uji's river valley with volcanic-alluvial soil creates teas with exceptional umami depth, smooth texture, and complex sweetness, historically the first tea-growing region in Japan.",
        signature: "intense umami, complex sweetness, lingering finish",
        famous_styles: ["matcha", "gyokuro", "sencha"]
    },
    'kagoshima': { 
        description: "Kagoshima's volcanic influence with coastal exposure produces teas with bright character, clean flavor, and often subtle marine notes, known for larger-scale production with modern techniques.",
        signature: "bright character, clean flavor, subtle sweetness",
        famous_styles: ["sencha", "kabusecha", "bancha"]
    },
    'shizuoka': { 
        description: "Shizuoka's diverse terrain from coastal to mountainous areas creates Japan's most varied tea production, with balanced character, fresh notes, and good structure.",
        signature: "balanced character, fresh aroma, good structure",
        famous_styles: ["sencha", "fukamushi sencha", "kabusecha"]
    },
    
    // India regions
    'darjeeling': { 
        description: "Darjeeling's high Himalayan slopes with loamy soil and cool misty conditions produce the 'champagne of teas' with muscatel notes, floral complexity, and distinctive brightness.",
        signature: "muscatel character, floral complexity, bright finish",
        famous_styles: ["first flush", "second flush", "autumnal"]
    },
    'assam': { 
        description: "Assam's lowland river valley with humid conditions and alluvial soil creates bold, malty teas with robust body, brisk character, and often honey-like sweetness.",
        signature: "malty strength, robust body, brisk character",
        famous_styles: ["breakfast tea", "tippy golden flowery orange pekoe"]
    },
    'nilgiri': { 
        description: "Nilgiri's high plateaus in southern India produce aromatic teas with bright character, clean taste, and subtle fruity notes, often with less astringency than other Indian regions.",
        signature: "bright character, clean taste, subtle fruitiness",
        famous_styles: ["frost tea", "nilgiri oolong"]
    },
    
    // Taiwan
    'taiwan': { 
        description: "Taiwan's varied mountain terrain with mineral-rich soil creates exceptional oolongs with remarkable complexity, floral-fruity notes, and often a distinctive 'high mountain' character.",
        signature: "complex aromatics, silky texture, lingering sweetness",
        famous_styles: ["dong ding", "oriental beauty", "jin xuan"]
    },
    'alishan': { 
        description: "Alishan's high mountain environment with frequent mist coverage produces prized oolongs with delicate sweetness, floral complexity, and remarkable aromatics.",
        signature: "delicate sweetness, floral complexity, creamy mouthfeel",
        famous_styles: ["high mountain oolong", "jin xuan oolong"]
    },
    
    // Sri Lanka
    'ceylon': { 
        description: "Ceylon (Sri Lanka) tea varies by elevation, with distinctive regional differences producing teas ranging from bold and brisk lowland varieties to delicate, nuanced high-grown teas.",
        signature: "bright character, clean taste, brisk finish",
        famous_styles: ["orange pekoe", "ceylon black"]
    },
    'nuwara eliya': { 
        description: "Nuwara Eliya's high elevation with cool climate produces Ceylon's most delicate teas, with floral notes, light body, and bright character often called the 'champagne of Ceylon teas'.",
        signature: "delicate body, floral notes, bright character",
        famous_styles: ["high-grown ceylon", "silver tips"]
    }
};

// Seasonal characteristics by region
export const regionalSeasonality = {
    'darjeeling': {
        spring: "First flush (March-April) teas are delicate with floral notes and astringent brightness",
        summer: "Second flush (May-June) teas develop the famous muscatel character with fuller body",
        fall: "Autumnal flush (October-November) offers deeper, mellower flavors with less brightness",
        winter: "Winter dormancy, no significant production"
    },
    'assam': {
        spring: "First flush (March-April) is lighter with floral notes and mild character",
        summer: "Second flush (May-June) provides the classic malty, full-bodied character",
        fall: "Autumnal teas offer deep flavor with less brightness and more richness",
        winter: "Limited winter production with distinctive character"
    },
    'uji': {
        spring: "Spring harvest (April-May) produces the finest gyokuro and matcha with peak umami",
        summer: "Summer harvest offers more robust flavor with increased astringency",
        fall: "Autumn harvest provides balanced character with moderate umami",
        winter: "Winter dormancy, no significant production"
    },
    'yunnan': {
        spring: "Spring harvest produces the most prized teas with delicate aromatics and sweet notes",
        summer: "Summer harvest offers fuller flavor with more robust characteristics",
        fall: "Autumn harvest creates balanced teas with good complexity and moderate body",
        winter: "Limited winter production with unique characteristics"
    }
};

// Mapping geographic features to tea effects
export const geographicFeatureToEffectMapping = {
    'high-mountain': {
        effects: {
            'focusing': 1.8,
            'calming': 1.5,
            'elevating': 2.0
        },
        description: "High mountain teas typically promote mental clarity and calm focus with uplifting qualities due to their unique balance of compounds developed in challenging growing conditions."
    },
    'mountain': {
        effects: {
            'focusing': 1.5,
            'energizing': 1.2,
            'elevating': 1.5
        },
        description: "Mountain-grown teas often support alertness and cognitive function with gentle energy due to their balanced growth environment."
    },
    'forest': {
        effects: {
            'calming': 1.8,
            'grounding': 1.5,
            'restorative': 1.2
        },
        description: "Forest-grown teas typically offer calming and restorative effects with grounding qualities due to the shaded growing conditions that promote L-theanine development."
    },
    'coastal': {
        effects: {
            'focusing': 1.4,
            'calming': 1.2,
            'harmonizing': 1.5
        },
        description: "Coastal-grown teas often provide balanced alertness with calming undertones due to the mineral influences and moderate growing conditions."
    },
    'river-delta': {
        effects: {
            'grounding': 1.6,
            'energizing': 1.4,
            'comforting': 1.2
        },
        description: "River delta teas typically offer robust energy with grounding qualities and a comforting nature due to rich soil and consistent growing conditions."
    },
    'volcanic': {
        effects: {
            'energizing': 1.7,
            'focusing': 1.5,
            'elevating': 1.5
        },
        description: "Teas from volcanic regions often promote vibrant energy and mental clarity due to the mineral-rich growing conditions that enhance the tea's vitality."
    }
};

// Combine all geographical descriptors for named export
export const geographicalDescriptors = {
    elevationLevels,
    latitudeZones,
    geographicFeatureDescriptions,
    soilTypeDescriptions,
    climateDescriptions, 
    regionCharacteristics,
    regionalSeasonality,
    geographicFeatureToEffectMapping,
    regionEffectMapping
};

// Export all mappings
export default {
    elevationLevels,
    latitudeZones,
    geographicFeatureDescriptions,
    soilTypeDescriptions,
    climateDescriptions,
    regionCharacteristics,
    regionalSeasonality,
    geographicFeatureToEffectMapping,
    regionEffectMapping
};

// Enhanced region detection based on coordinates
export function identifyRegionFromCoordinates(latitude, longitude) {
    // China tea regions
    if (latitude >= 20 && latitude <= 35 && longitude >= 100 && longitude <= 122) {
        // Yunnan
        if (latitude >= 21 && latitude <= 29 && longitude >= 97 && longitude <= 106) {
            return regionEffectMapping["Yunnan"];
        }
        // Fujian
        else if (latitude >= 23.5 && latitude <= 28 && longitude >= 115 && longitude <= 120) {
            return regionEffectMapping["Fujian"];
        }
        // Guangdong (including Chaozhou/Phoenix Mountain)
        else if (latitude >= 20 && latitude <= 25 && longitude >= 110 && longitude <= 117) {
            // Phoenix Mountain / Chaozhou is a specific area in Guangdong
            if (latitude >= 23.5 && latitude <= 24.2 && longitude >= 116 && longitude <= 117) {
                return regionEffectMapping["Phoenix Mountain"];
            }
            return regionEffectMapping["Guangdong"];
        }
        // Wuyi Mountains
        else if (latitude >= 27.5 && latitude <= 28.0 && longitude >= 117.5 && longitude <= 118.0) {
            return regionEffectMapping["Wuyi Mountains"];
        }
    }
    
    // Japan
    else if (latitude >= 30 && latitude <= 38 && longitude >= 129 && longitude <= 146) {
        // Kyoto/Uji
        if (latitude >= 34.5 && latitude <= 35.5 && longitude >= 135 && longitude <= 136) {
            return regionEffectMapping["Uji"];
        }
        // Shizuoka
        else if (latitude >= 34.5 && latitude <= 35.5 && longitude >= 138 && longitude <= 139) {
            return regionEffectMapping["Shizuoka"];
        }
    }
    
    // India
    else if (latitude >= 8 && latitude <= 35 && longitude >= 70 && longitude <= 95) {
        // Darjeeling
        if (latitude >= 26.5 && latitude <= 27.2 && longitude >= 88 && longitude <= 88.5) {
            return regionEffectMapping["Darjeeling"];
        }
        // Assam
        else if (latitude >= 26 && latitude <= 28 && longitude >= 89.5 && longitude <= 96) {
            return regionEffectMapping["Assam"];
        }
    }
    
    // Taiwan
    else if (latitude >= 22 && latitude <= 25.5 && longitude >= 120 && longitude <= 122) {
        // Ali Mountain
        if (latitude >= 23.2 && latitude <= 23.6 && longitude >= 120.5 && longitude <= 121) {
            return regionEffectMapping["Ali Mountain"];
        }
        // General Taiwan
        return regionEffectMapping["Taiwan"];
    }
    
    // If no specific region is identified, determine continental region
    if (latitude >= 8 && latitude <= 40 && longitude >= 70 && longitude <= 145) {
        return {
            region: "East Asia",
            effects: {
                harmonizing: 1.0,
                focusing: 1.0
            },
            description: "East Asian tea growing regions typically produce teas with distinctive regional characteristics."
        };
    }
    
    // Default fallback
    return {
        region: "Unknown",
        effects: {},
        description: "Region could not be determined from coordinates."
    };
} 