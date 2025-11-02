/**
 * teaTypes.js
 *
 * Unified taxonomy for tea types and subtypes
 * Single source of truth for tea family definitions, characteristics, and traditions
 *
 * ID Convention: UPPERCASE_WITH_UNDERSCORES
 * Example: TEA_TYPE_GREEN, TEA_SUBTYPE_MATCHA, TEA_TYPE_PUERH
 */

export class TeaTypeTaxonomy {
  /**
   * Tea Types (Base Categories)
   * Main families of tea with their base characteristics
   */
  static TYPES = {
    TEA_TYPE_WHITE: {
      id: 'TEA_TYPE_WHITE',
      displayName: 'White Tea',
      chineseName: '白茶',
      description: 'White teas undergo minimal processing (typically just withering and drying) with very little oxidation, preserving delicate flavors and high levels of antioxidants',
      aliases: ['white', 'white tea'],
      typicalCaffeine: { min: 1, max: 3, label: 'Low' },
      typicalTheanine: { min: 5, max: 7, label: 'High' },
      dominantFlavorCategories: ['Delicate', 'Subtle Sweet', 'Floral', 'Fruity', 'Hay'],
      seasonalTendency: 'cooling',
      baseTimeOfDay: ['Afternoon', 'Evening', 'Anytime'],
      baseTimeOfDayAffinities: {
        night: 10,          // 0-5am: Very low (high theanine, low caffeine)
        earlyMorning: 30,   // 6-8am: Low-moderate
        morning: 40,        // 9-11am: Moderate
        midday: 55,         // 12-14pm: Moderate-high
        afternoon: 80,      // 15-17pm: Peak (good for afternoon)
        evening: 70,        // 18-20pm: High (evening option)
        lateEvening: 60     // 21-23pm: Moderate (gentle evening)
      },
      baseActivityHints: ['ACTIVITY_RELAXATION', 'ACTIVITY_GENTLE_ENERGY', 'ACTIVITY_UNWINDING'],
      commonProcessing: ['PROCESSING_WITHERED', 'PROCESSING_SUN_DRIED', 'PROCESSING_MINIMAL_PROCESSING'],
      thermalEffect: 'cooling',
      seasonalAffinity: [
        { seasonId: 'SEASON_EARLY_SPRING', boost: 20 },
        { seasonId: 'SEASON_SPRING', boost: 25 },
        { seasonId: 'SEASON_LATE_SPRING', boost: 20 },
        { seasonId: 'SEASON_EARLY_SUMMER', boost: 15 },
        { seasonId: 'SEASON_SUMMER', boost: 12 },
        { seasonId: 'SEASON_LATE_SUMMER', boost: 8 }
      ]
    },

    TEA_TYPE_GREEN: {
      id: 'TEA_TYPE_GREEN',
      displayName: 'Green Tea',
      chineseName: '绿茶',
      description: 'Green teas preserve the fresh character of the tea leaf through minimal oxidation. Processing typically involves quick heating (steaming or pan-firing) to prevent oxidation, producing vibrant, often vegetal or marine flavors',
      aliases: ['green', 'green tea'],
      typicalCaffeine: { min: 3, max: 5, label: 'Medium' },
      typicalTheanine: { min: 4, max: 7, label: 'Medium-High' },
      dominantFlavorCategories: ['Vegetal', 'Marine', 'Nutty', 'Grassy', 'Sweet'],
      seasonalTendency: 'cooling',
      baseTimeOfDay: ['Morning', 'Afternoon'],
      baseTimeOfDayAffinities: {
        night: 5,           // 0-5am: Very low (not suitable)
        earlyMorning: 60,   // 6-8am: Moderate-high (morning tea)
        morning: 90,        // 9-11am: Peak (classic morning tea)
        midday: 85,         // 12-14pm: Very high (afternoon option)
        afternoon: 75,      // 15-17pm: High (afternoon)
        evening: 25,        // 18-20pm: Low (caffeine concern)
        lateEvening: 10     // 21-23pm: Very low (avoid)
      },
      baseActivityHints: ['ACTIVITY_FOCUS', 'ACTIVITY_GENTLE_ENERGY', 'ACTIVITY_REFRESHMENT'],
      commonProcessing: ['PROCESSING_STEAMED', 'PROCESSING_PAN_FIRED', 'PROCESSING_ROLLED', 'PROCESSING_SHADE_GROWN'],
      thermalEffect: 'cooling',
      seasonalAffinity: [
        { seasonId: 'SEASON_EARLY_SPRING', boost: 15 },
        { seasonId: 'SEASON_SPRING', boost: 25 },
        { seasonId: 'SEASON_LATE_SPRING', boost: 20 },
        { seasonId: 'SEASON_EARLY_SUMMER', boost: 18 },
        { seasonId: 'SEASON_SUMMER', boost: 15 },
        { seasonId: 'SEASON_LATE_SUMMER', boost: 10 }
      ]
    },

    TEA_TYPE_YELLOW: {
      id: 'TEA_TYPE_YELLOW',
      displayName: 'Yellow Tea',
      chineseName: '黄茶',
      description: 'Yellow teas are rare, involving a unique smothering step after kill-green that gives them a golden hue and sweet, delicate character between green and white',
      aliases: ['yellow', 'yellow tea'],
      typicalCaffeine: { min: 3, max: 5, label: 'Medium' },
      typicalTheanine: { min: 4, max: 6, label: 'Medium-High' },
      dominantFlavorCategories: ['Sweet', 'Nutty', 'Floral', 'Delicate'],
      seasonalTendency: 'neutral-cooling',
      baseTimeOfDay: ['Morning', 'Afternoon'],
      baseTimeOfDayAffinities: {
        night: 10,          // 0-5am: Very low
        earlyMorning: 55,   // 6-8am: Moderate (morning option)
        morning: 85,        // 9-11am: High (good morning tea)
        midday: 80,         // 12-14pm: High (afternoon option)
        afternoon: 70,      // 15-17pm: Moderate-high
        evening: 30,        // 18-20pm: Low (caffeine)
        lateEvening: 15     // 21-23pm: Very low
      },
      baseActivityHints: ['ACTIVITY_FOCUS', 'ACTIVITY_UPLIFTING', 'ACTIVITY_SOCIAL'],
      commonProcessing: ['PROCESSING_KILL_GREEN', 'PROCESSING_LIGHT_ROAST', 'PROCESSING_PARTIAL_OXIDATION'],
      thermalEffect: 'neutral-cooling',
      seasonalAffinity: [
        { seasonId: 'SEASON_SPRING', boost: 20 },
        { seasonId: 'SEASON_LATE_SPRING', boost: 18 },
        { seasonId: 'SEASON_EARLY_SUMMER', boost: 15 },
        { seasonId: 'SEASON_EARLY_AUTUMN', boost: 12 },
        { seasonId: 'SEASON_AUTUMN', boost: 10 }
      ]
    },

    TEA_TYPE_OOLONG: {
      id: 'TEA_TYPE_OOLONG',
      displayName: 'Oolong Tea',
      chineseName: '乌龙茶',
      description: 'Oolong teas represent a diverse category with partial oxidation ranging from light (closer to green) to heavy (closer to black). This results in a wide spectrum of flavors and characteristics',
      aliases: ['oolong', 'oolong tea', 'wulong', 'wu long'],
      typicalCaffeine: { min: 4, max: 6, label: 'Medium-High' },
      typicalTheanine: { min: 3, max: 6, label: 'Medium' },
      dominantFlavorCategories: ['Floral', 'Fruity', 'Roasted', 'Woody', 'Mineral', 'Creamy'],
      seasonalTendency: 'variable',
      baseTimeOfDay: ['Afternoon', 'Evening', 'Social'],
      baseTimeOfDayAffinities: {
        night: 15,          // 0-5am: Very low
        earlyMorning: 35,   // 6-8am: Low-moderate
        morning: 50,        // 9-11am: Moderate (social/brunch)
        midday: 65,         // 12-14pm: Moderate-high
        afternoon: 85,      // 15-17pm: Peak (traditional gongfu tea time)
        evening: 80,        // 18-20pm: High (after-dinner social)
        lateEvening: 50     // 21-23pm: Moderate (evening social)
      },
      baseActivityHints: ['ACTIVITY_SOCIAL', 'ACTIVITY_CONTEMPLATIVE', 'ACTIVITY_FOCUS', 'ACTIVITY_RELAXATION'],
      commonProcessing: ['PROCESSING_WITHERED', 'PROCESSING_ROLLED', 'PROCESSING_PARTIAL_OXIDATION', 'PROCESSING_LIGHT_ROAST', 'PROCESSING_MEDIUM_ROAST', 'PROCESSING_HEAVY_ROAST'],
      thermalEffect: 'neutral-warming',
      seasonalAffinity: [
        { seasonId: 'SEASON_SPRING', boost: 12 },
        { seasonId: 'SEASON_LATE_SPRING', boost: 10 },
        { seasonId: 'SEASON_EARLY_AUTUMN', boost: 15 },
        { seasonId: 'SEASON_AUTUMN', boost: 18 },
        { seasonId: 'SEASON_LATE_AUTUMN', boost: 15 },
        { seasonId: 'SEASON_ANYTIME', boost: 10 }
      ]
    },

    TEA_TYPE_BLACK: {
      id: 'TEA_TYPE_BLACK',
      displayName: 'Black Tea',
      chineseName: '红茶',
      description: 'Black teas undergo full oxidation, transforming the leaf\'s chemistry to develop robust, often malty, fruity, or spicy flavors and typically higher caffeine levels',
      aliases: ['black', 'black tea', 'red tea'],
      typicalCaffeine: { min: 5, max: 7, label: 'High' },
      typicalTheanine: { min: 2, max: 4, label: 'Low-Medium' },
      dominantFlavorCategories: ['Malty', 'Fruity', 'Spicy', 'Sweet', 'Woody'],
      seasonalTendency: 'warming',
      baseTimeOfDay: ['Morning', 'Afternoon'],
      baseTimeOfDayAffinities: {
        night: 5,           // 0-5am: Very low
        earlyMorning: 75,   // 6-8am: High (morning wake-up tea)
        morning: 95,        // 9-11am: Peak (traditional morning tea - breakfast tea)
        midday: 80,         // 12-14pm: High (afternoon option)
        afternoon: 60,      // 15-17pm: Moderate (afternoon but high caffeine)
        evening: 15,        // 18-20pm: Very low (caffeine concern)
        lateEvening: 5      // 21-23pm: Avoid
      },
      baseActivityHints: ['ACTIVITY_ENERGY', 'ACTIVITY_ROUTINE', 'ACTIVITY_FOCUS', 'ACTIVITY_MORNING'],
      commonProcessing: ['PROCESSING_WITHERED', 'PROCESSING_ROLLED', 'PROCESSING_FULL_OXIDATION'],
      thermalEffect: 'warming',
      seasonalAffinity: [
        { seasonId: 'SEASON_EARLY_AUTUMN', boost: 18 },
        { seasonId: 'SEASON_AUTUMN', boost: 22 },
        { seasonId: 'SEASON_LATE_AUTUMN', boost: 25 },
        { seasonId: 'SEASON_EARLY_WINTER', boost: 28 },
        { seasonId: 'SEASON_WINTER', boost: 25 },
        { seasonId: 'SEASON_LATE_WINTER', boost: 20 }
      ]
    },

    TEA_TYPE_PUERH: {
      id: 'TEA_TYPE_PUERH',
      displayName: 'Pu\'er Tea',
      chineseName: '普洱茶',
      description: 'Puerh tea from Yunnan, China, undergoes post-fermentation (natural for Sheng, accelerated for Shou), developing complex earthy, woody, and often sweet characteristics over time',
      aliases: ['puerh', 'pu er', 'pu-er', 'pu\'er', 'puer tea'],
      typicalCaffeine: { min: 4, max: 6, label: 'Medium-High' },
      typicalTheanine: { min: 3, max: 5, label: 'Medium' },
      dominantFlavorCategories: ['Earthy', 'Woody', 'Sweet', 'Aged', 'Mineral'],
      seasonalTendency: 'warming',
      baseTimeOfDay: ['Afternoon', 'Evening', 'After Meals'],
      baseTimeOfDayAffinities: {
        night: 20,          // 0-5am: Very low
        earlyMorning: 25,   // 6-8am: Low
        morning: 35,        // 9-11am: Low-moderate
        midday: 55,         // 12-14pm: Moderate (after-lunch option)
        afternoon: 80,      // 15-17pm: High (afternoon digestive tea)
        evening: 85,        // 18-20pm: Peak (after-dinner, evening contemplation)
        lateEvening: 70     // 21-23pm: High (evening digestive)
      },
      baseActivityHints: ['ACTIVITY_DIGESTIVE', 'ACTIVITY_CONTEMPLATIVE', 'ACTIVITY_GROUNDING', 'ACTIVITY_WARMING'],
      commonProcessing: ['PROCESSING_WITHERED', 'PROCESSING_SUN_DRIED', 'PROCESSING_COMPRESSED', 'PROCESSING_AGED', 'PROCESSING_FERMENTED'],
      thermalEffect: 'warming',
      seasonalAffinity: [
        { seasonId: 'SEASON_LATE_AUTUMN', boost: 25 },
        { seasonId: 'SEASON_EARLY_WINTER', boost: 30 },
        { seasonId: 'SEASON_WINTER', boost: 35 },
        { seasonId: 'SEASON_LATE_WINTER', boost: 30 },
        { seasonId: 'SEASON_EARLY_SPRING', boost: 15 }
      ]
    }
  };

  /**
   * Tea Subtypes
   * Specific varieties within each type with unique characteristics
   */
  static SUBTYPES = {
    // ========== WHITE TEA SUBTYPES ==========
    TEA_SUBTYPE_SILVER_NEEDLE: {
      id: 'TEA_SUBTYPE_SILVER_NEEDLE',
      displayName: 'Silver Needle',
      chineseName: '白毫银针',
      parentType: 'TEA_TYPE_WHITE',
      aliases: ['silver needle', 'silver needles', 'bai hao yin zhen'],
      description: 'Made only from unopened buds, offering the most delicate flavor',
      typicalCaffeine: { min: 1, max: 2, label: 'Very Low' },
      typicalTheanine: { min: 6, max: 8, label: 'Very High' },
      dominantFlavorCategories: ['Delicate', 'Sweet', 'Hay', 'Floral'],
      baseActivityHints: ['ACTIVITY_RELAXATION', 'ACTIVITY_CONTEMPLATIVE', 'ACTIVITY_UNWINDING'],
      thermalEffect: 'cooling',
      seasonalAffinity: [
        { seasonId: 'SEASON_EARLY_SPRING', boost: 25 },
        { seasonId: 'SEASON_SPRING', boost: 30 },
        { seasonId: 'SEASON_LATE_SPRING', boost: 25 },
        { seasonId: 'SEASON_EARLY_SUMMER', boost: 20 }
      ]
    },

    TEA_SUBTYPE_WHITE_PEONY: {
      id: 'TEA_SUBTYPE_WHITE_PEONY',
      displayName: 'White Peony',
      chineseName: '白牡丹',
      parentType: 'TEA_TYPE_WHITE',
      aliases: ['white peony', 'bai mu dan'],
      description: 'Blend of buds and one to two leaves, offering more body than Silver Needle while maintaining delicacy',
      typicalCaffeine: { min: 2, max: 3, label: 'Low' },
      typicalTheanine: { min: 5, max: 7, label: 'High' },
      dominantFlavorCategories: ['Floral', 'Sweet', 'Fruity', 'Delicate'],
      baseActivityHints: ['ACTIVITY_RELAXATION', 'ACTIVITY_SOCIAL', 'ACTIVITY_AFTERNOON_BREAK'],
      thermalEffect: 'cooling',
      seasonalAffinity: [
        { seasonId: 'SEASON_SPRING', boost: 22 },
        { seasonId: 'SEASON_LATE_SPRING', boost: 20 },
        { seasonId: 'SEASON_EARLY_SUMMER', boost: 18 },
        { seasonId: 'SEASON_SUMMER', boost: 15 }
      ]
    },

    // ========== GREEN TEA SUBTYPES ==========
    TEA_SUBTYPE_MATCHA: {
      id: 'TEA_SUBTYPE_MATCHA',
      displayName: 'Matcha',
      chineseName: '抹茶',
      parentType: 'TEA_TYPE_GREEN',
      aliases: ['matcha', 'powdered green tea'],
      description: 'A stone-ground green tea powder made from shade-grown leaves, consumed whole',
      typicalCaffeine: { min: 6, max: 8, label: 'High' },
      typicalTheanine: { min: 7, max: 9, label: 'Very High' },
      dominantFlavorCategories: ['Umami', 'Sweet', 'Vegetal', 'Creamy'],
      baseActivityHints: ['ACTIVITY_FOCUS', 'ACTIVITY_ENERGY', 'ACTIVITY_MORNING'],
      thermalEffect: 'cooling',
      seasonalAffinity: [
        { seasonId: 'SEASON_EARLY_SPRING', boost: 18 },
        { seasonId: 'SEASON_SPRING', boost: 22 },
        { seasonId: 'SEASON_LATE_SPRING', boost: 20 },
        { seasonId: 'SEASON_EARLY_SUMMER', boost: 15 }
      ]
    },

    TEA_SUBTYPE_GYOKURO: {
      id: 'TEA_SUBTYPE_GYOKURO',
      displayName: 'Gyokuro',
      chineseName: '玉露',
      parentType: 'TEA_TYPE_GREEN',
      aliases: ['gyokuro', 'jade dew'],
      description: 'A premium shade-grown Japanese green tea known for its intense umami and sweetness',
      typicalCaffeine: { min: 4, max: 6, label: 'Medium-High' },
      typicalTheanine: { min: 7, max: 8, label: 'Very High' },
      dominantFlavorCategories: ['Umami', 'Marine', 'Sweet', 'Vegetal'],
      baseActivityHints: ['ACTIVITY_FOCUS', 'ACTIVITY_CONTEMPLATIVE', 'ACTIVITY_CALM'],
      thermalEffect: 'cooling',
      seasonalAffinity: [
        { seasonId: 'SEASON_SPRING', boost: 25 },
        { seasonId: 'SEASON_LATE_SPRING', boost: 22 },
        { seasonId: 'SEASON_EARLY_SUMMER', boost: 18 }
      ]
    },

    TEA_SUBTYPE_SENCHA: {
      id: 'TEA_SUBTYPE_SENCHA',
      displayName: 'Sencha',
      chineseName: '煎茶',
      parentType: 'TEA_TYPE_GREEN',
      aliases: ['sencha', 'japanese green tea'],
      description: 'Standard Japanese green tea with a balance of freshness, vegetal notes, and slight sweetness',
      typicalCaffeine: { min: 3, max: 5, label: 'Medium' },
      typicalTheanine: { min: 4, max: 6, label: 'Medium' },
      dominantFlavorCategories: ['Vegetal', 'Marine', 'Sweet', 'Grassy'],
      baseActivityHints: ['ACTIVITY_FOCUS', 'ACTIVITY_REFRESHMENT', 'ACTIVITY_MORNING'],
      thermalEffect: 'cooling',
      seasonalAffinity: [
        { seasonId: 'SEASON_SPRING', boost: 20 },
        { seasonId: 'SEASON_LATE_SPRING', boost: 18 },
        { seasonId: 'SEASON_EARLY_SUMMER', boost: 15 },
        { seasonId: 'SEASON_SUMMER', boost: 12 }
      ]
    },

    TEA_SUBTYPE_LONGJING: {
      id: 'TEA_SUBTYPE_LONGJING',
      displayName: 'Longjing',
      chineseName: '龙井',
      parentType: 'TEA_TYPE_GREEN',
      aliases: ['longjing', 'dragon well', 'lung ching'],
      description: 'Premium Chinese green tea with a distinctive flat leaf shape and nutty, slightly sweet character',
      typicalCaffeine: { min: 3, max: 5, label: 'Medium' },
      typicalTheanine: { min: 4, max: 6, label: 'Medium' },
      dominantFlavorCategories: ['Nutty', 'Sweet', 'Grassy', 'Floral'],
      baseActivityHints: ['ACTIVITY_FOCUS', 'ACTIVITY_SOCIAL', 'ACTIVITY_AFTERNOON_BREAK'],
      thermalEffect: 'cooling',
      seasonalAffinity: [
        { seasonId: 'SEASON_EARLY_SPRING', boost: 22 },
        { seasonId: 'SEASON_SPRING', boost: 25 },
        { seasonId: 'SEASON_LATE_SPRING', boost: 20 },
        { seasonId: 'SEASON_EARLY_SUMMER', boost: 15 }
      ]
    },

    // ========== YELLOW TEA SUBTYPES ==========
    TEA_SUBTYPE_JUNSHAN_YINZHEN: {
      id: 'TEA_SUBTYPE_JUNSHAN_YINZHEN',
      displayName: 'Junshan Yinzhen',
      chineseName: '君山银针',
      parentType: 'TEA_TYPE_YELLOW',
      aliases: ['junshan yinzhen', 'junshan', 'silver needle yellow'],
      description: 'Premium yellow tea made from buds, known for its sweet and delicate character',
      typicalCaffeine: { min: 3, max: 5, label: 'Medium' },
      typicalTheanine: { min: 4, max: 6, label: 'Medium' },
      dominantFlavorCategories: ['Sweet', 'Delicate', 'Floral'],
      baseActivityHints: ['ACTIVITY_FOCUS', 'ACTIVITY_UPLIFTING', 'ACTIVITY_AFTERNOON_BREAK'],
      thermalEffect: 'neutral-cooling',
      seasonalAffinity: [
        { seasonId: 'SEASON_SPRING', boost: 22 },
        { seasonId: 'SEASON_LATE_SPRING', boost: 20 },
        { seasonId: 'SEASON_EARLY_SUMMER', boost: 18 },
        { seasonId: 'SEASON_EARLY_AUTUMN', boost: 15 }
      ]
    },

    // ========== OOLONG TEA SUBTYPES ==========
    TEA_SUBTYPE_TIE_GUAN_YIN_LIGHT: {
      id: 'TEA_SUBTYPE_TIE_GUAN_YIN_LIGHT',
      displayName: 'Tie Guan Yin (Light)',
      chineseName: '铁观音（轻焙）',
      parentType: 'TEA_TYPE_OOLONG',
      aliases: ['tie guan yin light', 'tie guan yin', 'iron goddess light'],
      description: 'Lightly oxidized Tie Guan Yin, known for vibrant floral (orchid) notes and creamy mouthfeel',
      typicalCaffeine: { min: 4, max: 5, label: 'Medium' },
      typicalTheanine: { min: 4, max: 6, label: 'Medium-High' },
      dominantFlavorCategories: ['Floral', 'Creamy', 'Sweet'],
      baseActivityHints: ['ACTIVITY_SOCIAL', 'ACTIVITY_UPLIFTING', 'ACTIVITY_RELAXATION'],
      thermalEffect: 'cooling',
      seasonalAffinity: [
        { seasonId: 'SEASON_SPRING', boost: 20 },
        { seasonId: 'SEASON_LATE_SPRING', boost: 18 },
        { seasonId: 'SEASON_EARLY_SUMMER', boost: 15 },
        { seasonId: 'SEASON_EARLY_AUTUMN', boost: 12 }
      ]
    },

    TEA_SUBTYPE_DA_HONG_PAO: {
      id: 'TEA_SUBTYPE_DA_HONG_PAO',
      displayName: 'Da Hong Pao',
      chineseName: '大红袍',
      parentType: 'TEA_TYPE_OOLONG',
      aliases: ['da hong pao', 'big red robe', 'heavy roast oolong'],
      description: 'Heavily roasted rock oolong with mineral and caramel notes, complex and deeply flavored',
      typicalCaffeine: { min: 5, max: 6, label: 'Medium-High' },
      typicalTheanine: { min: 3, max: 5, label: 'Medium' },
      dominantFlavorCategories: ['Roasted', 'Mineral', 'Woody', 'Caramel'],
      baseActivityHints: ['ACTIVITY_CONTEMPLATIVE', 'ACTIVITY_WARMING', 'ACTIVITY_FOCUS'],
      thermalEffect: 'warming',
      seasonalAffinity: [
        { seasonId: 'SEASON_AUTUMN', boost: 20 },
        { seasonId: 'SEASON_LATE_AUTUMN', boost: 25 },
        { seasonId: 'SEASON_EARLY_WINTER', boost: 28 },
        { seasonId: 'SEASON_WINTER', boost: 25 },
        { seasonId: 'SEASON_LATE_WINTER', boost: 20 }
      ]
    },

    TEA_SUBTYPE_DONG_DING: {
      id: 'TEA_SUBTYPE_DONG_DING',
      displayName: 'Dong Ding',
      chineseName: '冻顶',
      parentType: 'TEA_TYPE_OOLONG',
      aliases: ['dong ding', 'frozen peak'],
      description: 'Taiwanese high mountain oolong, medium-oxidized with floral and fruity notes',
      typicalCaffeine: { min: 4, max: 5, label: 'Medium' },
      typicalTheanine: { min: 4, max: 6, label: 'Medium' },
      dominantFlavorCategories: ['Floral', 'Fruity', 'Sweet', 'Creamy'],
      baseActivityHints: ['ACTIVITY_SOCIAL', 'ACTIVITY_AFTERNOON_BREAK', 'ACTIVITY_CONTEMPLATIVE'],
      thermalEffect: 'neutral-warming',
      seasonalAffinity: [
        { seasonId: 'SEASON_SPRING', boost: 15 },
        { seasonId: 'SEASON_EARLY_AUTUMN', boost: 18 },
        { seasonId: 'SEASON_AUTUMN', boost: 20 },
        { seasonId: 'SEASON_LATE_AUTUMN', boost: 18 }
      ]
    },

    TEA_SUBTYPE_BAOZHONG: {
      id: 'TEA_SUBTYPE_BAOZHONG',
      displayName: 'Baozhong',
      chineseName: '包种',
      parentType: 'TEA_TYPE_OOLONG',
      aliases: ['baozhong', 'wrapped leaf', 'pouchong'],
      description: 'Lightly oxidized Taiwanese oolong with fruity and floral characteristics',
      typicalCaffeine: { min: 4, max: 5, label: 'Medium' },
      typicalTheanine: { min: 4, max: 6, label: 'Medium' },
      dominantFlavorCategories: ['Fruity', 'Floral', 'Sweet'],
      baseActivityHints: ['ACTIVITY_SOCIAL', 'ACTIVITY_UPLIFTING', 'ACTIVITY_RELAXATION'],
      thermalEffect: 'cooling',
      seasonalAffinity: [
        { seasonId: 'SEASON_SPRING', boost: 18 },
        { seasonId: 'SEASON_LATE_SPRING', boost: 20 },
        { seasonId: 'SEASON_EARLY_SUMMER', boost: 18 },
        { seasonId: 'SEASON_EARLY_AUTUMN', boost: 15 }
      ]
    },

    // ========== BLACK TEA SUBTYPES ==========
    TEA_SUBTYPE_ASSAM: {
      id: 'TEA_SUBTYPE_ASSAM',
      displayName: 'Assam',
      chineseName: '阿萨姆',
      parentType: 'TEA_TYPE_BLACK',
      aliases: ['assam', 'assam black'],
      description: 'Bold, malty black tea from Assam, India with full body and high caffeine',
      typicalCaffeine: { min: 6, max: 8, label: 'Very High' },
      typicalTheanine: { min: 2, max: 3, label: 'Low' },
      dominantFlavorCategories: ['Malty', 'Bold', 'Honey', 'Sweet'],
      baseActivityHints: ['ACTIVITY_ENERGY', 'ACTIVITY_MORNING', 'ACTIVITY_FOCUS'],
      thermalEffect: 'warming',
      seasonalAffinity: [
        { seasonId: 'SEASON_EARLY_WINTER', boost: 25 },
        { seasonId: 'SEASON_WINTER', boost: 30 },
        { seasonId: 'SEASON_LATE_WINTER', boost: 25 },
        { seasonId: 'SEASON_EARLY_SPRING', boost: 15 }
      ]
    },

    TEA_SUBTYPE_DARJEELING: {
      id: 'TEA_SUBTYPE_DARJEELING',
      displayName: 'Darjeeling',
      chineseName: '大吉岭',
      parentType: 'TEA_TYPE_BLACK',
      aliases: ['darjeeling', 'champagne tea'],
      description: 'Delicate black tea from the foothills of the Himalayas with floral and fruity notes that vary by flush',
      typicalCaffeine: { min: 4, max: 6, label: 'Medium-High' },
      typicalTheanine: { min: 3, max: 4, label: 'Medium' },
      dominantFlavorCategories: ['Floral', 'Fruity', 'Mineral'],
      baseActivityHints: ['ACTIVITY_FOCUS', 'ACTIVITY_UPLIFTING', 'ACTIVITY_SOCIAL'],
      thermalEffect: 'neutral-warming',
      seasonalAffinity: [
        { seasonId: 'SEASON_EARLY_AUTUMN', boost: 20 },
        { seasonId: 'SEASON_AUTUMN', boost: 22 },
        { seasonId: 'SEASON_LATE_AUTUMN', boost: 20 },
        { seasonId: 'SEASON_EARLY_WINTER', boost: 18 }
      ]
    },

    TEA_SUBTYPE_KEEMUN: {
      id: 'TEA_SUBTYPE_KEEMUN',
      displayName: 'Keemun',
      chineseName: '祁门',
      parentType: 'TEA_TYPE_BLACK',
      aliases: ['keemun', 'qimen', 'chi men'],
      description: 'Elegant Chinese black tea with winey, fruity, and slightly floral characteristics',
      typicalCaffeine: { min: 4, max: 5, label: 'Medium-High' },
      typicalTheanine: { min: 3, max: 4, label: 'Medium' },
      dominantFlavorCategories: ['Fruity', 'Winey', 'Floral', 'Slightly Sweet'],
      baseActivityHints: ['ACTIVITY_AFTERNOON_BREAK', 'ACTIVITY_SOCIAL', 'ACTIVITY_CONTEMPLATIVE'],
      thermalEffect: 'warming',
      seasonalAffinity: [
        { seasonId: 'SEASON_AUTUMN', boost: 20 },
        { seasonId: 'SEASON_LATE_AUTUMN', boost: 22 },
        { seasonId: 'SEASON_EARLY_WINTER', boost: 25 },
        { seasonId: 'SEASON_WINTER', boost: 22 }
      ]
    },

    // ========== PUERH TEA SUBTYPES ==========
    TEA_SUBTYPE_SHENG_PUERH: {
      id: 'TEA_SUBTYPE_SHENG_PUERH',
      displayName: 'Sheng Pu\'er',
      chineseName: '生普洱',
      parentType: 'TEA_TYPE_PUERH',
      aliases: ['sheng puerh', 'raw puerh', 'sheng pu er'],
      description: 'Sheng (Raw) Puerh ages naturally over years, starting vibrant and potentially astringent, mellowing over time',
      typicalCaffeine: { min: 5, max: 7, label: 'High' },
      typicalTheanine: { min: 3, max: 5, label: 'Medium' },
      dominantFlavorCategories: ['Earthy', 'Fruity (young)', 'Sweet (aged)', 'Mineral'],
      baseActivityHints: ['ACTIVITY_ENERGY', 'ACTIVITY_FOCUS', 'ACTIVITY_CONTEMPLATIVE'],
      thermalEffect: 'variable',
      seasonalAffinity: [
        { seasonId: 'SEASON_EARLY_AUTUMN', boost: 18 },
        { seasonId: 'SEASON_AUTUMN', boost: 20 },
        { seasonId: 'SEASON_LATE_AUTUMN', boost: 22 },
        { seasonId: 'SEASON_EARLY_WINTER', boost: 20 },
        { seasonId: 'SEASON_SPRING', boost: 15 }
      ]
    },

    TEA_SUBTYPE_SHOU_PUERH: {
      id: 'TEA_SUBTYPE_SHOU_PUERH',
      displayName: 'Shou Pu\'er',
      chineseName: '熟普洱',
      parentType: 'TEA_TYPE_PUERH',
      aliases: ['shou puerh', 'ripe puerh', 'shou pu er'],
      description: 'Shou (Ripe) Puerh undergoes accelerated fermentation, resulting in a dark, smooth, earthy profile achievable much faster',
      typicalCaffeine: { min: 4, max: 6, label: 'Medium-High' },
      typicalTheanine: { min: 3, max: 4, label: 'Medium' },
      dominantFlavorCategories: ['Earthy', 'Woody', 'Sweet', 'Smooth'],
      baseActivityHints: ['ACTIVITY_DIGESTIVE', 'ACTIVITY_WARMING', 'ACTIVITY_RELAXATION', 'ACTIVITY_GROUNDING'],
      thermalEffect: 'warming',
      seasonalAffinity: [
        { seasonId: 'SEASON_LATE_AUTUMN', boost: 28 },
        { seasonId: 'SEASON_EARLY_WINTER', boost: 32 },
        { seasonId: 'SEASON_WINTER', boost: 35 },
        { seasonId: 'SEASON_LATE_WINTER', boost: 30 },
        { seasonId: 'SEASON_EARLY_SPRING', boost: 18 }
      ]
    }
  };

  /**
   * Get tea type by ID or alias (case-insensitive)
   * @param {string} query - Tea type ID or alias
   * @returns {Object|null} - Tea type object or null if not found
   */
  static getType(query) {
    if (!query) return null;

    const normalizedQuery = String(query).toLowerCase().trim();

    // Try direct ID match
    for (const [id, type] of Object.entries(this.TYPES)) {
      if (id.toLowerCase() === normalizedQuery) {
        return type;
      }
    }

    // Try alias match
    for (const type of Object.values(this.TYPES)) {
      if (type.aliases?.some(alias => alias.toLowerCase() === normalizedQuery)) {
        return type;
      }
    }

    return null;
  }

  /**
   * Get tea subtype by ID or alias (case-insensitive)
   * @param {string} query - Subtype ID or alias
   * @returns {Object|null} - Subtype object or null if not found
   */
  static getSubtype(query) {
    if (!query) return null;

    const normalizedQuery = String(query).toLowerCase().trim();

    // Try direct ID match
    for (const [id, subtype] of Object.entries(this.SUBTYPES)) {
      if (id.toLowerCase() === normalizedQuery) {
        return subtype;
      }
    }

    // Try alias match
    for (const subtype of Object.values(this.SUBTYPES)) {
      if (subtype.aliases?.some(alias => alias.toLowerCase() === normalizedQuery)) {
        return subtype;
      }
    }

    return null;
  }

  /**
   * Get all subtypes for a specific tea type
   * @param {string} typeId - Tea type ID or alias
   * @returns {Array} - Array of subtype objects
   */
  static getSubtypesByType(typeId) {
    const type = this.getType(typeId);
    if (!type) return [];

    return Object.values(this.SUBTYPES).filter(
      subtype => subtype.parentType === type.id
    );
  }

  /**
   * Get all tea types
   * @returns {Array} - Array of all tea type objects
   */
  static getAllTypes() {
    return Object.values(this.TYPES);
  }

  /**
   * Get all subtypes
   * @returns {Array} - Array of all subtype objects
   */
  static getAllSubtypes() {
    return Object.values(this.SUBTYPES);
  }

  /**
   * List all valid tea type IDs and aliases
   * @returns {Array} - Array of all valid identifiers
   */
  static listAllValid() {
    const valid = [];

    Object.values(this.TYPES).forEach(type => {
      valid.push(type.id);
      valid.push(...type.aliases);
    });

    return valid;
  }

  /**
   * Validate that a tea type exists
   * Throws helpful error if not found
   * @param {string} query - Type ID or alias
   * @throws {Error} - If type not found
   */
  static validateType(query) {
    const type = this.getType(query);

    if (!type) {
      throw new Error(
        `Unknown tea type: "${query}"\n` +
        `Valid types: ${this.listAllValid().join(', ')}`
      );
    }

    return type;
  }
}

export default TeaTypeTaxonomy;
