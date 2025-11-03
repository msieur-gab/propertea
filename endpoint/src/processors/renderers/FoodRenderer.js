/**
 * FoodRenderer.js
 *
 * Purpose: Render food pairing recommendations based on flavor inference
 * Input: FlavorInferrer output { analysis: { foodPairingHints, dominantCategories, intensityEstimate } }
 * Output: Food pairing recommendations with scores and cuisine grouping
 *
 * This Renderer uses the Unified Taxonomy System (FoodTaxonomy) for food definitions
 * and organization, replacing hardcoded food lists with dynamic registry data
 */

import { FoodTaxonomy, FlavorTaxonomy } from '../../taxonomies/index.js';

export class FoodRenderer {
  constructor(config = {}) {
    this.config = {
      maxRecommendations: config.maxRecommendations || 5,
      ...config
    };

    this.foodTaxonomy = FoodTaxonomy;
    this.flavorTaxonomy = FlavorTaxonomy;

    // Build food categories from FoodTaxonomy
    this.foodCategories = this._buildCategoriesFromTaxonomy();

    // Build flavor pairing strengths from FlavorTaxonomy
    this.flavorPairingStrengths = this._buildPairingStrengthsFromTaxonomy();
  }

  /**
   * Build food categories from FoodTaxonomy
   */
  _buildCategoriesFromTaxonomy() {
    const categories = {};

    // Group foods by their category
    Object.entries(this.foodTaxonomy.FOODS).forEach(([foodId, food]) => {
      const categoryId = food.category;
      const categoryKey = categoryId.replace(/^CATEGORY_/, '').toLowerCase();

      if (!categories[categoryKey]) {
        categories[categoryKey] = {
          foods: [],
          foodIds: [],
          pairing: this._getPairingTypeForCategory(categoryId),
          cuisines: this._getCuisinesForCategory(categoryId)
        };
      }

      categories[categoryKey].foods.push(food.displayName);
      categories[categoryKey].foodIds.push(foodId);
    });

    return categories;
  }

  /**
   * Build flavor-to-food pairing strengths from FlavorTaxonomy
   */
  _buildPairingStrengthsFromTaxonomy() {
    const pairingStrengths = {};

    // Iterate through all flavors and build pairing map
    Object.entries(this.flavorTaxonomy.FLAVORS).forEach(([flavorId, flavor]) => {
      const categoryName = flavor.category
        ? flavor.category.replace(/^CATEGORY_/, '').replace(/_/g, ' ')
        : 'Unknown';

      if (!pairingStrengths[flavor.displayName]) {
        pairingStrengths[flavor.displayName] = {
          strength: this._getStrengthLevel(flavor.foodPairingHints?.length || 0),
          pairedWith: [],
          foodIds: flavor.foodPairingHints || [],
          weight: this._calculateWeight(flavor.foodPairingHints?.length || 0)
        };

        // Convert food IDs to display names
        if (Array.isArray(flavor.foodPairingHints)) {
          flavor.foodPairingHints.forEach(foodId => {
            const food = this.foodTaxonomy.getFood(foodId);
            if (food) {
              pairingStrengths[flavor.displayName].pairedWith.push(food.displayName);
            }
          });
        }
      }
    });

    return pairingStrengths;
  }

  /**
   * Determine pairing type for a food category
   */
  _getPairingTypeForCategory(categoryId) {
    const typeMap = {
      'CATEGORY_DESSERTS_SWEETS': 'sweet',
      'CATEGORY_PROTEINS_MEATS': 'savory',
      'CATEGORY_VEGETABLES_GREENS': 'savory',
      'CATEGORY_STARCHES_GRAINS': 'neutral',
      'CATEGORY_DAIRY_CHEESE': 'rich',
      'CATEGORY_FRUITS_BERRIES': 'sweet',
      'CATEGORY_PREPARED_DISHES': 'savory',
      'CATEGORY_BREADS_BAKED': 'neutral'
    };
    return typeMap[categoryId] || 'neutral';
  }

  /**
   * Get cuisines associated with a food category
   */
  _getCuisinesForCategory(categoryId) {
    const cuisineMap = {
      'CATEGORY_DESSERTS_SWEETS': ['French', 'Asian Fusion', 'European'],
      'CATEGORY_PROTEINS_MEATS': ['Mediterranean', 'Asian', 'European'],
      'CATEGORY_VEGETABLES_GREENS': ['Asian', 'Mediterranean', 'Vegetarian'],
      'CATEGORY_STARCHES_GRAINS': ['Asian', 'Mediterranean', 'Italian'],
      'CATEGORY_DAIRY_CHEESE': ['European', 'Mediterranean', 'French'],
      'CATEGORY_FRUITS_BERRIES': ['French', 'Mediterranean', 'Asian'],
      'CATEGORY_PREPARED_DISHES': ['Asian', 'European', 'Mediterranean'],
      'CATEGORY_BREADS_BAKED': ['European', 'Mediterranean', 'Asian']
    };
    return cuisineMap[categoryId] || ['International'];
  }

  /**
   * Determine strength level based on number of pairings
   */
  _getStrengthLevel(count) {
    if (count >= 5) return 'very-high';
    if (count >= 4) return 'high';
    if (count >= 2) return 'medium';
    return 'low';
  }

  /**
   * Calculate weight based on number of pairings
   */
  _calculateWeight(count) {
    return Math.min(25, 10 + count * 2);
  }

  /**
   * Get tea-type specific pairing templates
   * Returns high-confidence food IDs that are classically paired with a tea type
   * @param {string} teaType - Tea type ID (e.g., TEA_TYPE_BLACK)
   * @returns {Array} - Array of food IDs with tea-type affinity
   */
  _getTeaTypeSpecificPairings(teaType) {
    const templates = {
      'TEA_TYPE_BLACK': [
        'FOOD_AGED_CHEESE',      // Rich, fatty - balances astringency
        'FOOD_GRILLED_MEATS',    // Hearty - complements body
        'FOOD_ROASTED_NUTS',     // Warm, toasty - echo tea roast
        'FOOD_DARK_CHOCOLATE',   // Rich, bitter - contrasts/complements
        'FOOD_CARAMEL_SWEETS'    // Natural pairing with honey/malt notes
      ],
      'TEA_TYPE_GREEN': [
        'FOOD_WHITE_FISH',       // Delicate - respects tea's subtlety
        'FOOD_SUSHI_RICE',       // Complementary, traditional
        'FOOD_LIGHT_VEGETABLES', // Mild, vegetal - synergistic
        'FOOD_FRESH_FRUIT',      // Bright, fresh - echoes tea character
        'FOOD_RICE_CAKES'        // Neutral base to showcase tea
      ],
      'TEA_TYPE_OOLONG': [
        'FOOD_DARK_CHOCOLATE',   // Complex, roasted - matches oolong complexity
        'FOOD_GRILLED_MEATS',    // Medium-heavy - suits medium-heavy oolong
        'FOOD_ROOT_VEGETABLES',  // Earthy - mineral tea affinity
        'FOOD_AGED_CHEESE',      // Sophisticated pairing
        'FOOD_DIM_SUM'           // Traditional pairing, savory
      ],
      'TEA_TYPE_WHITE': [
        'FOOD_LIGHT_DESSERTS',   // Delicate - matches tea profile
        'FOOD_FRESH_FRUIT',      // Bright, floral - synergistic
        'FOOD_WHITE_FISH',       // Subtle - respects tea finesse
        'FOOD_RICE_CAKES',       // Neutral vehicle
        'FOOD_HONEY_SWEETS'      // Natural sweetness pairing
      ],
      'TEA_TYPE_YELLOW': [
        'FOOD_LIGHT_DESSERTS',   // Delicate, sweet character
        'FOOD_FRESH_FRUIT',      // Balanced sweetness
        'FOOD_HONEY_SWEETS',     // Natural honey affinity
        'FOOD_PASTRIES',         // Buttery - light richness
        'FOOD_WHITE_FISH'        // Subtle, delicate
      ],
      'TEA_TYPE_PUERH': [
        'FOOD_GRILLED_MEATS',    // Fatty cuts - astringency cuts through
        'FOOD_AGED_CHEESE',      // Strong flavor - matches puerh intensity
        'FOOD_ROASTED_NUTS',     // Earthy, roasted - echo fermentation
        'FOOD_DIM_SUM',          // Traditional, savory
        'FOOD_CARAMEL_SWEETS'    // Earthiness + sweetness
      ]
    };

    return templates[teaType] || [];
  }

  /**
   * Get astringency-based food recommendations
   * High astringency needs fatty, protein-rich foods
   * @param {Object} compoundAnalysis - Compound analysis with caffeine/L-theanine raw values
   * @returns {Array} - Food IDs suitable for astringency level
   */
  _getAstringencyBasedPairings(compoundAnalysis) {
    // Simple heuristic: higher caffeine (relative to L-theanine) often = higher astringency
    const { caffeineLevel = 0, lTheanineLevel = 0 } = compoundAnalysis;

    const astringencyMap = {
      'High': [
        'FOOD_AGED_CHEESE',      // Fat and umami
        'FOOD_GRILLED_MEATS',    // Protein, fat
        'FOOD_RICH_PASTRIES',    // Butter, richness
        'FOOD_DARK_CHOCOLATE'    // Fat, bitterness
      ],
      'Medium': [
        'FOOD_CARAMEL_SWEETS',   // Balanced sweetness
        'FOOD_PASTRIES',         // Medium richness
        'FOOD_ROOT_VEGETABLES',  // Earthiness
        'FOOD_ROASTED_NUTS'      // Richness
      ],
      'Low': [
        'FOOD_LIGHT_DESSERTS',   // Gentle pairing
        'FOOD_FRESH_FRUIT',      // Light, bright
        'FOOD_WHITE_FISH',       // Delicate
        'FOOD_RICE_CAKES'        // Subtle
      ]
    };

    // Rough astringency classification based on compound profile
    // Numeric thresholds: Low (<3), Medium (3-6), High (>6)
    let astringencyLevel = "Medium";
    if (caffeineLevel > 6 && lTheanineLevel < 3) {
      astringencyLevel = "High";
    } else if (caffeineLevel < 3 || lTheanineLevel > 6) {
      astringencyLevel = "Low";
    }

    return astringencyMap[astringencyLevel] || astringencyMap['Medium'];
  }

  /**
   * Render food pairing recommendations from flavor inference
   * @param {Object} inferences - Object containing inference results
   *   - inferences.flavor: Output from FlavorInferrer (primary)
   *   - inferences.compound: Output from CompoundInferrer (astringency context, optional)
   *   - inferences.teaType: Output from TeaTypeInferrer (tea-type templates, optional)
   * @returns {Object} - Food pairing recommendations with grouping
   */
  render(inferences = {}) {
    const {
      flavor: flavorInference = {},
      compound: compoundInference = {},
      teaType: teaTypeInference = {}
    } = inferences;

    const trace = [];

    // Extract flavor analysis data
    if (!flavorInference?.analysis) {
      return this._failedRender("No flavor inference data provided", trace);
    }

    const analysis = flavorInference.analysis;
    const {
      foodPairingHints = [],
      dominantCategories = [],
      dominantFlavors = [],
      intensityEstimate = "N/A"
    } = analysis;

    // Extract compound profile (astringency awareness)
    const compoundAnalysis = compoundInference?.analysis || {};
    const {
      caffeineLevel = 0,
      lTheanineLevel = 0,
      compoundProfile = "Unknown"
    } = compoundAnalysis;

    // Extract tea type for template-based pairings
    const teaTypeAnalysis = teaTypeInference?.analysis || {};
    const { teaType = null, teaSubType = null } = teaTypeAnalysis;

    trace.push({
      step: "Data Reception",
      reason: "Received flavor inference",
      adjustment: `Food hints: ${foodPairingHints.length}, Categories: ${dominantCategories.length}`,
      value: `Sample hints: ${foodPairingHints.slice(0, 3).join(', ')}`
    });

    // Handle empty food hints
    if (foodPairingHints.length === 0) {
      return this._emptyRender(trace);
    }

    // Step 1: Create food score map from hints
    const foodScores = new Map();

    // Initialize all foods with their base scores from hints
    foodPairingHints.forEach(hint => {
      if (!foodScores.has(hint)) {
        foodScores.set(hint, 50); // Base score
      }
    });

    trace.push({
      step: "Food Initialization",
      reason: "Extract unique foods from hints",
      adjustment: `Initialized ${foodScores.size} unique foods with base score 50`,
      value: foodScores.size.toString()
    });

    // Step 2: Boost scores based on flavor categories
    let categoryBoosts = 0;
    dominantCategories.forEach(category => {
      const pairing = this.flavorPairingStrengths[category];
      if (pairing) {
        pairing.pairedWith.forEach(food => {
          if (foodScores.has(food)) {
            const currentScore = foodScores.get(food);
            foodScores.set(food, currentScore + pairing.weight);
            categoryBoosts++;
          }
        });
      }
    });

    trace.push({
      step: "Category Matching",
      reason: `Matched ${dominantCategories.length} categories`,
      adjustment: `Boosted ${categoryBoosts} food pairings`,
      value: dominantCategories.join(', ')
    });

    // Step 3: Apply tea-type specific boosts (high confidence)
    let typeBoosts = 0;
    const typeSpecificFoods = this._getTeaTypeSpecificPairings(teaType);
    typeSpecificFoods.forEach(foodId => {
      if (foodScores.has(foodId)) {
        const currentScore = foodScores.get(foodId);
        // Strong boost (+15) for tea-type specific pairings
        foodScores.set(foodId, currentScore + 15);
        typeBoosts++;
      } else {
        // Add to map if not already present
        foodScores.set(foodId, 65);
        typeBoosts++;
      }
    });

    trace.push({
      step: "Tea-Type Specific Pairings (Tier 1 - High Confidence)",
      reason: `Tea type: ${teaType || 'Unknown'}`,
      adjustment: `Applied +15 boost to ${typeBoosts} tea-type specific foods`,
      value: typeBoosts > 0 ? `Tea-type specific pairings activated` : 'No tea-type template available'
    });

    // Step 4: Apply astringency-based boosts
    let astringencyBoosts = 0;
    const astringencyFoods = this._getAstringencyBasedPairings(compoundAnalysis);
    astringencyFoods.forEach(foodId => {
      if (foodScores.has(foodId)) {
        const currentScore = foodScores.get(foodId);
        // Moderate boost (+8) for astringency-appropriate foods
        foodScores.set(foodId, currentScore + 8);
        astringencyBoosts++;
      } else {
        // Add to map if not already present
        foodScores.set(foodId, 58);
        astringencyBoosts++;
      }
    });

    trace.push({
      step: "Astringency-Based Matching (Tier 2 - Biochemistry)",
      reason: `Caffeine: ${caffeineLevel}, L-Theanine: ${lTheanineLevel}`,
      adjustment: `Applied +8 boost to ${astringencyBoosts} astringency-appropriate foods`,
      value: astringencyBoosts > 0 ? `Astringency matching activated` : 'No astringency profile'
    });

    // Step 5: Apply intensity adjustment
    const intensityBonus = this._getIntensityBonus(intensityEstimate);
    let intensityAdjusted = 0;

    foodScores.forEach((score, food) => {
      const newScore = score + intensityBonus;
      foodScores.set(food, newScore);
      intensityAdjusted++;
    });

    trace.push({
      step: "Intensity Adjustment",
      reason: `Profile intensity: ${intensityEstimate}`,
      adjustment: `Applied +${intensityBonus} bonus to all foods`,
      value: `${intensityAdjusted} foods adjusted`
    });

    // Step 6: Rank and select top foods
    const sortedFoods = Array.from(foodScores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, this.config.maxRecommendations);

    const recommendations = sortedFoods.map(([foodId, score]) => {
      const foodObj = this.foodTaxonomy.getFood(foodId);
      const foodName = foodObj ? foodObj.displayName : foodId;

      return {
        food: foodName,
        foodId: foodId,
        description: foodObj?.description || 'A complementary food pairing',
        score: Math.min(100, score),
        rationale: this._getRationale(foodName, dominantFlavors, dominantCategories),
        narrative: this._buildNarrative(foodObj, teaType, dominantFlavors, astringencyFoods.includes(foodId)),
        category: this._getFoodCategory(foodName),
        flavorProfile: foodObj?.flavorProfile || [],
        pairingTechnique: this._getPairingTechnique(foodName, dominantFlavors)
      };
    });

    trace.push({
      step: "Ranking & Selection",
      reason: "Select top food pairings",
      adjustment: `Selected ${recommendations.length} top recommendations`,
      value: recommendations.map(r => r.food).join(', ')
    });

    // Step 5: Group by cuisine and category
    const cuisineGrouping = this._groupByCuisine(recommendations);
    const categoryGrouping = this._groupByFoodCategory(recommendations);

    trace.push({
      step: "Grouping",
      reason: "Organize recommendations",
      adjustment: `Created ${cuisineGrouping.length} cuisine groups and ${categoryGrouping.length} food category groups`,
      value: `Cuisines: ${cuisineGrouping.map(g => g.cuisine).join(', ')}`
    });

    // Calculate composite confidence based on multi-source agreement
    let compositeConfidence = flavorInference.confidence || 0.75;

    // Boost confidence if we have tea-type specific matches
    if (typeBoosts > 0) {
      compositeConfidence = Math.min(0.95, compositeConfidence + 0.10);
    }

    // Boost confidence if we have astringency-based matches
    if (astringencyBoosts > 0) {
      compositeConfidence = Math.min(0.95, compositeConfidence + 0.08);
    }

    // Reduce confidence if flavor hints are sparse
    if (foodPairingHints.length < 3) {
      compositeConfidence = Math.max(0.50, compositeConfidence - 0.15);
    }

    trace.push({
      step: "Confidence Calculation",
      reason: "Multi-source agreement scoring",
      adjustment: `Base: ${(flavorInference.confidence || 0.75).toFixed(2)}, Tea-type: +${typeBoosts > 0 ? '0.10' : '0.00'}, Astringency: +${astringencyBoosts > 0 ? '0.08' : '0.00'}`,
      value: `Final confidence: ${compositeConfidence.toFixed(2)}`
    });

    return {
      // Top recommended foods
      recommendations,

      // Organized by cuisine type
      cuisineGroupings: cuisineGrouping,

      // Organized by food category
      categoryGroupings: categoryGrouping,

      // Supporting data
      analysis: {
        flavorCategories: dominantCategories,
        dominantFlavors,
        intensityEstimate,
        hintCount: foodPairingHints.length,
        teaTypeSpecificBoosts: typeBoosts,
        astringencyBoosts: astringencyBoosts
      },

      // Metadata
      trace,
      confidence: compositeConfidence,
      rendererVersion: '2.0'
    };
  }

  // ========== Helper Methods ==========

  /**
   * Get intensity bonus for scoring
   */
  _getIntensityBonus(intensity) {
    const bonuses = {
      "Complex": 15,
      "Pronounced": 10,
      "Moderate": 5,
      "Subtle": 2,
      "N/A": 0
    };
    return bonuses[intensity] || 0;
  }

  /**
   * Build dynamic narrative for food pairing using taxonomy hint
   * Combines narrativeHint from taxonomy with context (tea type, flavor match, astringency)
   * to create pedagogical one-line explanations
   */
  _buildNarrative(foodObj, teaType, dominantFlavors, isAstringencyMatch) {
    if (!foodObj || !foodObj.narrativeHint) {
      return null; // No narrative hint available
    }

    const hint = foodObj.narrativeHint;

    // Simple case: just return the hint as-is if it's already pedagogical
    // (most hints are already written in narrative form)
    if (isAstringencyMatch) {
      // Add emphasis when astringency is a key match
      return `${hint} (astringency balance)`;
    }

    if (teaType && hint.toLowerCase().includes('puerh')) {
      return `${hint} (especially with aged puerh)`;
    }

    if (dominantFlavors.length > 0 && hint.toLowerCase().includes(dominantFlavors[0])) {
      return `${hint} (enhances ${dominantFlavors[0]} notes)`;
    }

    return hint;
  }

  /**
   * Get food category from food name or ID
   */
  _getFoodCategory(foodNameOrId) {
    // First try to find by display name in foodCategories
    for (const [categoryName, categoryData] of Object.entries(this.foodCategories)) {
      if (categoryData.foods.includes(foodNameOrId)) {
        return categoryName;
      }
    }

    // If not found, try to look up the food object and use its category
    const foodObj = this.foodTaxonomy.getFood(foodNameOrId);
    if (foodObj && foodObj.category) {
      const categoryId = foodObj.category;
      const categoryKey = categoryId.replace(/^CATEGORY_/, '').toLowerCase();
      return categoryKey;
    }

    return "other";
  }

  /**
   * Get rationale for food pairing
   */
  _getRationale(food, dominantFlavors, dominantCategories) {
    const flavorMatch = dominantFlavors.length > 0
      ? `complements ${dominantFlavors.slice(0, 2).join(' and ')}`
      : `pairs well with this profile`;

    const categoryMatch = dominantCategories.length > 0
      ? `${dominantCategories[0].toLowerCase()} notes`
      : `overall profile`;

    return `${food} ${flavorMatch}, enhancing ${categoryMatch}`;
  }

  /**
   * Get pairing technique guidance for specific food and flavors
   */
  _getPairingTechnique(foodName, dominantFlavors) {
    const techniqueMap = {
      // Light Desserts
      'Light Desserts': 'Serve tea before dessert to cleanse palate, then enjoy together for subtle flavor harmony',
      'Pastries': 'The tea\'s complexity complements delicate pastry layers without overwhelming',
      'Fruit Desserts': 'Fruity tea notes echo fruit-based dessert flavors',

      // Proteins
      'White Fish': 'Lighter, delicate tea pairs perfectly with mild fish - each enhances the other\'s subtlety',
      'Poultry': 'Tea\'s complexity pairs well with poultry\'s neutral canvas',
      'Shellfish': 'Mineral notes align with oceanic flavors',

      // Vegetables
      'Steamed Vegetables': 'Tea\'s warmth complements fresh, light vegetable preparations',
      'Leafy Greens': 'Herbaceous tea notes mirror green vegetable characters',
      'Root Vegetables': 'Earthy tea components resonate with vegetable earthiness',

      // Prepared Dishes
      'Rice Dishes': 'Tea cleanses palate between spoonfuls while complementing rice\'s subtle flavors',
      'Noodle Dishes': 'Traditional pairing - tea and noodles have long been companions',
      'Breakfast Foods': 'Morning tea ritual pairs harmoniously with breakfast preparation',

      // Default
      'default': 'Enjoy tea alongside food for complementary flavor experience'
    };

    return techniqueMap[foodName] || techniqueMap['default'];
  }

  /**
   * Group recommendations by cuisine type
   */
  _groupByCuisine(recommendations) {
    const cuisineMap = new Map();

    recommendations.forEach(rec => {
      const foodCategory = this._getFoodCategory(rec.food);
      const categoryData = this.foodCategories[foodCategory];

      if (categoryData && categoryData.cuisines) {
        categoryData.cuisines.forEach(cuisine => {
          if (!cuisineMap.has(cuisine)) {
            cuisineMap.set(cuisine, []);
          }
          cuisineMap.get(cuisine).push(rec.food);
        });
      }
    });

    return Array.from(cuisineMap.entries()).map(([cuisine, foods]) => ({
      cuisine,
      foods: [...new Set(foods)], // Remove duplicates
      count: [...new Set(foods)].length
    }));
  }

  /**
   * Group recommendations by food category
   */
  _groupByFoodCategory(recommendations) {
    const categoryMap = new Map();

    recommendations.forEach(rec => {
      const category = rec.category;
      if (!categoryMap.has(category)) {
        categoryMap.set(category, []);
      }
      categoryMap.get(category).push(rec.food);
    });

    return Array.from(categoryMap.entries()).map(([category, foods]) => ({
      category,
      foods,
      count: foods.length
    }));
  }

  /**
   * Return failed render when inference fails
   */
  _failedRender(reason, trace) {
    return {
      recommendations: [],
      cuisineGroupings: [],
      categoryGroupings: [],
      analysis: {
        flavorCategories: [],
        dominantFlavors: [],
        intensityEstimate: "Unknown",
        hintCount: 0
      },
      trace: [{
        step: "Error",
        reason,
        adjustment: "Unable to render recommendations",
        value: "Failed"
      }],
      confidence: 0.0,
      rendererVersion: '1.0'
    };
  }

  /**
   * Return default render when no food hints available
   */
  _emptyRender(trace) {
    trace.push({
      step: "Empty Data",
      reason: "No food pairing hints provided",
      adjustment: "Returning minimal recommendations",
      value: "No hints"
    });

    return {
      recommendations: [],
      cuisineGroupings: [],
      categoryGroupings: [],
      analysis: {
        flavorCategories: [],
        dominantFlavors: [],
        intensityEstimate: "N/A",
        hintCount: 0
      },
      trace,
      confidence: 0.0,
      rendererVersion: '1.0'
    };
  }
}
