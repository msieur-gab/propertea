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
   * Render food pairing recommendations from flavor inference
   * @param {Object} flavorInference - Output from FlavorInferrer
   * @returns {Object} - Food pairing recommendations with grouping
   */
  render(flavorInference) {
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

    // Step 3: Apply intensity adjustment
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

    // Step 4: Rank and select top foods
    const sortedFoods = Array.from(foodScores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, this.config.maxRecommendations);

    const recommendations = sortedFoods.map(([foodId, score]) => {
      const foodObj = this.foodTaxonomy.getFood(foodId);
      const foodName = foodObj ? foodObj.displayName : foodId;

      return {
        food: foodName,
        foodId: foodId,
        score: Math.min(100, score),
        rationale: this._getRationale(foodName, dominantFlavors, dominantCategories),
        category: this._getFoodCategory(foodName)
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
        hintCount: foodPairingHints.length
      },

      // Metadata
      trace,
      confidence: flavorInference.confidence || 0.85,
      rendererVersion: '1.0'
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
