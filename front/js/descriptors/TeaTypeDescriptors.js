// TeaTypeDescriptors.js
// Defines baseline characteristics and tendencies for tea types.

export const teaTypeDescriptors = {
    // Structure: { typeName: { base: {...}, subTypes: { subTypeName: {...} } } }
  
    green: {
      base: {
        description: "Green teas preserve the fresh character of the tea leaf through minimal oxidation. Processing typically involves quick heating (steaming or pan-firing) to prevent oxidation, producing vibrant, often vegetal or marine flavors.",
        typicalCaffeine: "Medium",      // e.g., 3-5 range
        typicalTheanine: "Medium-High", // e.g., 4-7 range
        dominantFlavorCategories: ["Vegetal", "Marine", "Nutty", "Grassy", "Sweet"],
        seasonalTendency: "cooling",
        baseTimeOfDay: ["Morning", "Afternoon"],
        baseActivityHints: ["Focus", "Gentle Energy", "Refreshment"],
        commonProcessing: ["Steamed", "Pan-fired", "Rolled", "Dried"]
      },
      subTypes: {
          // Example Subtype - Add more as needed
          matcha: {
               description: "Matcha is a stone-ground green tea powder made from shade-grown leaves, consumed whole.",
               typicalCaffeine: "High", // Higher due to consuming whole leaf
               typicalTheanine: "Very High", // Higher due to shading
               dominantFlavorCategories: ["Umami", "Sweet", "Vegetal", "Creamy"],
               seasonalTendency: "cooling", // Still green tea base
               baseTimeOfDay: ["Morning", "Ritual"],
               baseActivityHints: ["Focus", "Energy (Smooth)", "Ceremony"],
               commonProcessing: ["Shade-grown", "Steamed", "Stone-ground"]
          },
          gyokuro: {
               description: "Gyokuro is a premium shade-grown Japanese green tea known for its intense umami and sweetness.",
               typicalCaffeine: "Medium-High",
               typicalTheanine: "Very High", // Significant shading effect
               dominantFlavorCategories: ["Umami", "Marine", "Sweet", "Vegetal"],
               seasonalTendency: "cooling",
               baseTimeOfDay: ["Afternoon", "Special Occasion"],
               baseActivityHints: ["Focus", "Calm & Clear", "Contemplative"],
               commonProcessing: ["Shade-grown", "Steamed", "Rolled"]
          }
      }
    },
  
    black: {
      base: {
        description: "Black teas undergo full oxidation, transforming the leaf's chemistry to develop robust, often malty, fruity, or spicy flavors and typically higher caffeine levels.",
        typicalCaffeine: "High",          // e.g., 5-7 range
        typicalTheanine: "Low-Medium",    // e.g., 2-4 range
        dominantFlavorCategories: ["Malty", "Fruity", "Spicy", "Sweet", "Woody", "Roasted"],
        seasonalTendency: "warming",
        baseTimeOfDay: ["Morning", "Afternoon"],
        baseActivityHints: ["Energy", "Routine", "Focus", "Social"],
        commonProcessing: ["Withered", "Rolled", "Oxidized", "Fired/Dried"]
      },
      subTypes: {
          assam: {
              typicalCaffeine: "Very High",
              dominantFlavorCategories: ["Malty", "Bold", "Honey"],
              baseActivityHints: ["Strong Energy", "Morning Boost"]
          },
          darjeeling: { // Note: Varies hugely by flush
               typicalCaffeine: "Medium-High",
               typicalTheanine: "Medium",
               dominantFlavorCategories: ["Floral", "Fruity (Muscatel)", "Mineral"],
               seasonalTendency: "neutral-warming", // Depends on flush
               baseActivityHints: ["Focus", "Uplifting", "Social"]
          }
      }
    },
  
    oolong: {
      base: {
        description: "Oolong teas represent a diverse category with partial oxidation ranging from light (closer to green) to heavy (closer to black). This results in a wide spectrum of flavors and characteristics.",
        typicalCaffeine: "Medium-High",   // Highly variable: 4-6 range typical
        typicalTheanine: "Medium",        // Highly variable: 3-6 range typical
        dominantFlavorCategories: ["Floral", "Fruity", "Roasted", "Woody", "Mineral", "Creamy", "Honey"], // Very diverse
        seasonalTendency: "variable", // Depends heavily on oxidation/roast
        baseTimeOfDay: ["Afternoon", "Evening", "Social"],
        baseActivityHints: ["Social", "Contemplative", "Focus", "Relaxation"], // Very diverse
        commonProcessing: ["Withered", "Bruised/Rolled", "Partially Oxidized", "Fired/Roasted"]
      },
      subTypes: {
          'tie guan yin (light)': {
              description: "Lightly oxidized Tie Guan Yin, known for vibrant floral (orchid) notes.",
              typicalCaffeine: "Medium",
              typicalTheanine: "Medium-High",
              dominantFlavorCategories: ["Floral", "Creamy", "Sweet"],
              seasonalTendency: "cooling",
              baseTimeOfDay: ["Afternoon", "Spring"],
              baseActivityHints: ["Social", "Uplifting", "Relaxation"]
          },
          'da hong pao (heavy roast)': {
              description: "Da Hong Pao, a heavily roasted rock oolong with mineral and caramel notes.",
              typicalCaffeine: "Medium-High",
              typicalTheanine: "Medium",
              dominantFlavorCategories: ["Roasted", "Mineral", "Woody", "Caramel"],
              seasonalTendency: "warming",
              baseTimeOfDay: ["Afternoon", "Evening", "Fall/Winter"],
              baseActivityHints: ["Contemplative", "Warming", "Focus"]
          }
      }
    },
  
    white: {
      base: {
        description: "White teas undergo minimal processing (typically just withering and drying) with very little oxidation, preserving delicate flavors and high levels of antioxidants.",
        typicalCaffeine: "Low",           // e.g., 1-3 range
        typicalTheanine: "High",          // e.g., 5-7 range
        dominantFlavorCategories: ["Delicate", "Subtle Sweet", "Floral", "Fruity", "Hay"],
        seasonalTendency: "cooling",
        baseTimeOfDay: ["Afternoon", "Evening", "Anytime"],
        baseActivityHints: ["Relaxation", "Gentle Focus", "Unwinding", "Subtle"],
        commonProcessing: ["Withered", "Dried"]
      },
      subTypes: {
          'silver needle': {
              description: "Made only from unopened buds, offering the most delicate flavor.",
              typicalCaffeine: "Very Low", // Often lower than other whites
              typicalTheanine: "Very High",
              dominantFlavorCategories: ["Delicate", "Sweet", "Hay", "Floral"],
              baseActivityHints: ["Deep Relaxation", "Subtle", "Meditation"]
          }
      }
    },
  
    puerh: { // Combined base for Sheng and Shou, subtypes differentiate
      base: {
          description: "Puerh tea from Yunnan, China, undergoes post-fermentation (natural for Sheng, accelerated for Shou), developing complex earthy, woody, and often sweet characteristics over time.",
          typicalCaffeine: "Medium-High", // Can vary wildly with age/type
          typicalTheanine: "Medium",      // Can vary
          dominantFlavorCategories: ["Earthy", "Woody", "Camphor", "Sweet", "Aged", "Mineral"],
          seasonalTendency: "warming", // Especially Shou and aged Sheng
          baseTimeOfDay: ["Afternoon", "Evening", "After Meals"],
          baseActivityHints: ["Digestive", "Contemplative", "Grounding (Physical)", "Warming"],
          commonProcessing: ["Withered", "Pan-fired (Sheng)", "Sun-dried", "Fermented (Shou)", "Compressed", "Aged"]
      },
      subTypes: {
          sheng: {
              description: "Sheng (Raw) Puerh ages naturally over years, starting vibrant and potentially astringent, mellowing over time.",
              typicalCaffeine: "High", // Often higher when young
              seasonalTendency: "neutral-cooling (young) -> warming (aged)",
              baseActivityHints: ["Energy (young)", "Focus (young)", "Contemplative (aged)", "Digestive"]
          },
          shou: {
              description: "Shou (Ripe) Puerh undergoes accelerated fermentation, resulting in a dark, smooth, earthy profile achievable much faster.",
              typicalCaffeine: "Medium-High",
              seasonalTendency: "warming",
              baseActivityHints: ["Digestive", "Warming", "Grounding (Physical)", "Relaxation (Subtle)"]
          }
      }
    },
  
    yellow: {
      base: {
        description: "Yellow tea is a rare type processed similarly to green tea but with an added 'smothering' step (men huan) which induces gentle oxidation, resulting in unique smoothness and sweetness.",
        typicalCaffeine: "Medium-Low",    // e.g., 2-4 range
        typicalTheanine: "Medium-High",   // e.g., 4-6 range
        dominantFlavorCategories: ["Sweet", "Smooth", "Nutty", "Vegetal (Mellowed)"],
        seasonalTendency: "neutral",
        baseTimeOfDay: ["Afternoon", "Anytime"],
        baseActivityHints: ["Gentle Focus", "Relaxation", "Social", "Smooth"],
        commonProcessing: ["Pan-fired (light)", "Smothering (Men Huan)", "Dried"]
      }
    }
  
    // Add other types like Herbal Tisanes if needed, though their properties vary vastly by ingredient.
  };
  
  // Exporting the structure
  export default teaTypeDescriptors;