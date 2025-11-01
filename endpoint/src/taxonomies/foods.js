/**
 * foods.js
 *
 * Unified taxonomy for all foods and food categories
 * Single source of truth for food pairing definitions
 *
 * ID Convention: UPPERCASE_WITH_UNDERSCORES
 * Example: FOOD_LIGHT_DESSERTS, CUISINE_FRENCH, CATEGORY_DESSERTS
 *
 * ALIGNMENT NOTE: All foods below are referenced in FlavorTaxonomy.FLAVORS
 * and must be kept in sync when either file changes.
 */

export class FoodTaxonomy {
  /**
   * Food Categories
   * Broad groupings of foods by type
   */
  static CATEGORIES = {
    CATEGORY_DESSERTS: {
      id: 'CATEGORY_DESSERTS',
      displayName: 'Desserts & Sweets',
      description: 'Sweet treats and confections'
    },
    CATEGORY_BREADS_BAKED: {
      id: 'CATEGORY_BREADS_BAKED',
      displayName: 'Breads & Baked Goods',
      description: 'Bakery items, breads, and pastries'
    },
    CATEGORY_PROTEINS: {
      id: 'CATEGORY_PROTEINS',
      displayName: 'Proteins & Meats',
      description: 'Meat, seafood, and protein sources'
    },
    CATEGORY_VEGETABLES: {
      id: 'CATEGORY_VEGETABLES',
      displayName: 'Vegetables & Greens',
      description: 'Fresh and prepared vegetables'
    },
    CATEGORY_DAIRY_CHEESE: {
      id: 'CATEGORY_DAIRY_CHEESE',
      displayName: 'Dairy & Cheese',
      description: 'Cheese, yogurt, cream, and dairy products'
    },
    CATEGORY_FRUITS: {
      id: 'CATEGORY_FRUITS',
      displayName: 'Fruits & Berries',
      description: 'Fresh and preserved fruits'
    },
    CATEGORY_PREPARED_DISHES: {
      id: 'CATEGORY_PREPARED_DISHES',
      displayName: 'Prepared Dishes',
      description: 'Composed dishes and prepared foods'
    },
    CATEGORY_BEVERAGES: {
      id: 'CATEGORY_BEVERAGES',
      displayName: 'Beverages',
      description: 'Drinks and beverages'
    }
  };

  /**
   * Cuisines
   * Global cuisine styles
   */
  static CUISINES = {
    CUISINE_FRENCH: {
      id: 'CUISINE_FRENCH',
      displayName: 'French',
      description: 'French cuisine and cooking traditions'
    },
    CUISINE_ASIAN: {
      id: 'CUISINE_ASIAN',
      displayName: 'Asian',
      description: 'Asian cuisines including Chinese, Japanese, Thai, etc.'
    },
    CUISINE_MIDDLE_EASTERN: {
      id: 'CUISINE_MIDDLE_EASTERN',
      displayName: 'Middle Eastern',
      description: 'Middle Eastern and North African cuisines'
    },
    CUISINE_MEDITERRANEAN: {
      id: 'CUISINE_MEDITERRANEAN',
      displayName: 'Mediterranean',
      description: 'Mediterranean and Southern European cuisines'
    },
    CUISINE_AMERICAN_COMFORT: {
      id: 'CUISINE_AMERICAN_COMFORT',
      displayName: 'American & Comfort',
      description: 'American and comfort food styles'
    }
  };

  /**
   * Individual Foods
   * Each food has:
   * - id: unique identifier
   * - displayName: human-readable name
   * - category: references CATEGORIES by id
   * - aliases: alternative names/spellings
   */
  static FOODS = {
    // ========== DESSERTS & SWEETS ==========
    FOOD_LIGHT_DESSERTS: {
      id: 'FOOD_LIGHT_DESSERTS',
      displayName: 'Light Desserts',
      category: 'CATEGORY_DESSERTS',
      aliases: ['light desserts', 'light sweets', 'delicate desserts']
    },
    FOOD_CREAMY_DESSERTS: {
      id: 'FOOD_CREAMY_DESSERTS',
      displayName: 'Creamy Desserts',
      category: 'CATEGORY_DESSERTS',
      aliases: ['creamy desserts', 'cream desserts', 'custard', 'mousse']
    },
    FOOD_DARK_CHOCOLATE: {
      id: 'FOOD_DARK_CHOCOLATE',
      displayName: 'Dark Chocolate',
      category: 'CATEGORY_DESSERTS',
      aliases: ['dark chocolate', 'chocolate', 'cocoa']
    },
    FOOD_DESSERTS: {
      id: 'FOOD_DESSERTS',
      displayName: 'Desserts',
      category: 'CATEGORY_DESSERTS',
      aliases: ['desserts', 'sweets', 'sweet']
    },
    FOOD_RICH_DESSERTS: {
      id: 'FOOD_RICH_DESSERTS',
      displayName: 'Rich Desserts',
      category: 'CATEGORY_DESSERTS',
      aliases: ['rich desserts', 'heavy desserts', 'indulgent sweets']
    },
    FOOD_SPICED_DESSERTS: {
      id: 'FOOD_SPICED_DESSERTS',
      displayName: 'Spiced Desserts',
      category: 'CATEGORY_DESSERTS',
      aliases: ['spiced desserts', 'spiced cakes', 'spiced sweets']
    },
    FOOD_ICE_CREAM: {
      id: 'FOOD_ICE_CREAM',
      displayName: 'Ice Cream',
      category: 'CATEGORY_DESSERTS',
      aliases: ['ice cream', 'gelato', 'frozen dessert']
    },
    FOOD_SORBETS: {
      id: 'FOOD_SORBETS',
      displayName: 'Sorbets',
      category: 'CATEGORY_DESSERTS',
      aliases: ['sorbets', 'sorbet', 'frozen fruit']
    },
    FOOD_JELLIES: {
      id: 'FOOD_JELLIES',
      displayName: 'Jellies',
      category: 'CATEGORY_DESSERTS',
      aliases: ['jellies', 'jelly', 'gel desserts', 'aspic']
    },

    // ========== BREADS & BAKED GOODS ==========
    FOOD_PASTRIES: {
      id: 'FOOD_PASTRIES',
      displayName: 'Pastries',
      category: 'CATEGORY_BREADS_BAKED',
      aliases: ['pastries', 'pastry', 'puff pastry']
    },
    FOOD_LIGHT_CAKES: {
      id: 'FOOD_LIGHT_CAKES',
      displayName: 'Light Cakes',
      category: 'CATEGORY_BREADS_BAKED',
      aliases: ['light cakes', 'sponge cakes', 'angel cakes']
    },
    FOOD_SUBTLE_PASTRIES: {
      id: 'FOOD_SUBTLE_PASTRIES',
      displayName: 'Subtle Pastries',
      category: 'CATEGORY_BREADS_BAKED',
      aliases: ['subtle pastries', 'delicate pastries', 'fine pastries']
    },
    FOOD_LIGHT_FRUIT_TARTS: {
      id: 'FOOD_LIGHT_FRUIT_TARTS',
      displayName: 'Light Fruit Tarts',
      category: 'CATEGORY_BREADS_BAKED',
      aliases: ['light fruit tarts', 'fruit tarts', 'fresh tarts']
    },
    FOOD_MADELEINES: {
      id: 'FOOD_MADELEINES',
      displayName: 'Madeleines',
      category: 'CATEGORY_BREADS_BAKED',
      aliases: ['madeleines', 'madeleine', 'sponge cake']
    },
    FOOD_APRICOT_PASTRIES: {
      id: 'FOOD_APRICOT_PASTRIES',
      displayName: 'Apricot Pastries',
      category: 'CATEGORY_BREADS_BAKED',
      aliases: ['apricot pastries', 'fruit pastries', 'apricot danish']
    },
    FOOD_MOON_CAKES: {
      id: 'FOOD_MOON_CAKES',
      displayName: 'Moon Cakes',
      category: 'CATEGORY_BREADS_BAKED',
      aliases: ['moon cakes', 'mooncake', 'asian pastry']
    },
    FOOD_LIGHT_COOKIES: {
      id: 'FOOD_LIGHT_COOKIES',
      displayName: 'Light Cookies',
      category: 'CATEGORY_BREADS_BAKED',
      aliases: ['light cookies', 'biscuits', 'wafers']
    },
    FOOD_BAKED_GOODS: {
      id: 'FOOD_BAKED_GOODS',
      displayName: 'Baked Goods',
      category: 'CATEGORY_BREADS_BAKED',
      aliases: ['baked goods', 'bakery', 'bread']
    },
    FOOD_BISCUITS: {
      id: 'FOOD_BISCUITS',
      displayName: 'Biscuits',
      category: 'CATEGORY_BREADS_BAKED',
      aliases: ['biscuits', 'cookies', 'shortbread']
    },

    // ========== PROTEINS & MEATS ==========
    FOOD_WHITE_FISH: {
      id: 'FOOD_WHITE_FISH',
      displayName: 'White Fish',
      category: 'CATEGORY_PROTEINS',
      aliases: ['white fish', 'fish', 'cod', 'halibut', 'sole']
    },
    FOOD_SEAFOOD: {
      id: 'FOOD_SEAFOOD',
      displayName: 'Seafood',
      category: 'CATEGORY_PROTEINS',
      aliases: ['seafood', 'sea food', 'ocean', 'marine']
    },
    FOOD_SHELLFISH: {
      id: 'FOOD_SHELLFISH',
      displayName: 'Shellfish',
      category: 'CATEGORY_PROTEINS',
      aliases: ['shellfish', 'crustacean', 'crab', 'shrimp', 'lobster']
    },
    FOOD_OYSTERS: {
      id: 'FOOD_OYSTERS',
      displayName: 'Oysters',
      category: 'CATEGORY_PROTEINS',
      aliases: ['oysters', 'oyster', 'bivalve']
    },
    FOOD_SMOKED_SALMON: {
      id: 'FOOD_SMOKED_SALMON',
      displayName: 'Smoked Salmon',
      category: 'CATEGORY_PROTEINS',
      aliases: ['smoked salmon', 'lox', 'cured salmon']
    },
    FOOD_SUSHI: {
      id: 'FOOD_SUSHI',
      displayName: 'Sushi',
      category: 'CATEGORY_PROTEINS',
      aliases: ['sushi', 'sashimi', 'nigiri']
    },
    FOOD_CHICKEN: {
      id: 'FOOD_CHICKEN',
      displayName: 'Chicken',
      category: 'CATEGORY_PROTEINS',
      aliases: ['chicken', 'poultry', 'fowl']
    },
    FOOD_PORK_DISHES: {
      id: 'FOOD_PORK_DISHES',
      displayName: 'Pork Dishes',
      category: 'CATEGORY_PROTEINS',
      aliases: ['pork', 'pork dishes', 'pork meat']
    },
    FOOD_ROASTED_MEATS: {
      id: 'FOOD_ROASTED_MEATS',
      displayName: 'Roasted Meats',
      category: 'CATEGORY_PROTEINS',
      aliases: ['roasted meats', 'roast', 'grilled meats']
    },
    FOOD_GRILLED_MEATS: {
      id: 'FOOD_GRILLED_MEATS',
      displayName: 'Grilled Meats',
      category: 'CATEGORY_PROTEINS',
      aliases: ['grilled meats', 'bbq', 'barbecue']
    },
    FOOD_GAME_MEATS: {
      id: 'FOOD_GAME_MEATS',
      displayName: 'Game Meats',
      category: 'CATEGORY_PROTEINS',
      aliases: ['game meats', 'game', 'venison', 'duck', 'pheasant']
    },
    FOOD_DARK_MEATS: {
      id: 'FOOD_DARK_MEATS',
      displayName: 'Dark Meats',
      category: 'CATEGORY_PROTEINS',
      aliases: ['dark meats', 'red meat', 'beef', 'lamb']
    },
    FOOD_LAMB_DISHES: {
      id: 'FOOD_LAMB_DISHES',
      displayName: 'Lamb Dishes',
      category: 'CATEGORY_PROTEINS',
      aliases: ['lamb', 'lamb dishes', 'lamb meat']
    },
    FOOD_BACON: {
      id: 'FOOD_BACON',
      displayName: 'Bacon',
      category: 'CATEGORY_PROTEINS',
      aliases: ['bacon', 'pork bacon', 'cured pork']
    },
    FOOD_LIGHT_MEATS: {
      id: 'FOOD_LIGHT_MEATS',
      displayName: 'Light Meats',
      category: 'CATEGORY_PROTEINS',
      aliases: ['light meats', 'poultry', 'white meat', 'chicken']
    },
    FOOD_GRILLED_ROASTED_MEATS: {
      id: 'FOOD_GRILLED_ROASTED_MEATS',
      displayName: 'Grilled & Roasted Meats',
      category: 'CATEGORY_PROTEINS',
      aliases: ['grilled roasted meats', 'BBQ meats', 'cooked meats']
    },

    // ========== VEGETABLES & GREENS ==========
    FOOD_STEAMED_VEGETABLES: {
      id: 'FOOD_STEAMED_VEGETABLES',
      displayName: 'Steamed Vegetables',
      category: 'CATEGORY_VEGETABLES',
      aliases: ['steamed vegetables', 'steamed greens', 'vegetables']
    },
    FOOD_LIGHT_VEGETABLE_DISHES: {
      id: 'FOOD_LIGHT_VEGETABLE_DISHES',
      displayName: 'Light Vegetable Dishes',
      category: 'CATEGORY_VEGETABLES',
      aliases: ['light vegetable dishes', 'light vegetables', 'vegetable sides']
    },
    FOOD_FRESH_SALADS: {
      id: 'FOOD_FRESH_SALADS',
      displayName: 'Fresh Salads',
      category: 'CATEGORY_VEGETABLES',
      aliases: ['fresh salads', 'salads', 'greens']
    },
    FOOD_SALADS: {
      id: 'FOOD_SALADS',
      displayName: 'Salads',
      category: 'CATEGORY_VEGETABLES',
      aliases: ['salads', 'salad', 'mixed greens']
    },
    FOOD_SPRING_SALADS: {
      id: 'FOOD_SPRING_SALADS',
      displayName: 'Spring Salads',
      category: 'CATEGORY_VEGETABLES',
      aliases: ['spring salads', 'fresh greens', 'spring greens']
    },
    FOOD_STEAMED_GREENS: {
      id: 'FOOD_STEAMED_GREENS',
      displayName: 'Steamed Greens',
      category: 'CATEGORY_VEGETABLES',
      aliases: ['steamed greens', 'cooked greens', 'spinach', 'kale']
    },
    FOOD_GRILLED_VEGETABLES: {
      id: 'FOOD_GRILLED_VEGETABLES',
      displayName: 'Grilled Vegetables',
      category: 'CATEGORY_VEGETABLES',
      aliases: ['grilled vegetables', 'char grilled', 'roasted vegetables']
    },
    FOOD_ROASTED_VEGETABLES: {
      id: 'FOOD_ROASTED_VEGETABLES',
      displayName: 'Roasted Vegetables',
      category: 'CATEGORY_VEGETABLES',
      aliases: ['roasted vegetables', 'roasted', 'baked vegetables']
    },
    FOOD_ROOT_VEGETABLES: {
      id: 'FOOD_ROOT_VEGETABLES',
      displayName: 'Root Vegetables',
      category: 'CATEGORY_VEGETABLES',
      aliases: ['root vegetables', 'roots', 'potatoes', 'carrots', 'beets']
    },
    FOOD_MUSHROOMS: {
      id: 'FOOD_MUSHROOMS',
      displayName: 'Mushrooms',
      category: 'CATEGORY_VEGETABLES',
      aliases: ['mushrooms', 'mushroom', 'fungi']
    },
    FOOD_LIGHT_VEGETABLES: {
      id: 'FOOD_LIGHT_VEGETABLES',
      displayName: 'Light Vegetables',
      category: 'CATEGORY_VEGETABLES',
      aliases: ['light vegetables', 'delicate vegetables']
    },

    // ========== DAIRY & CHEESE ==========
    FOOD_YOGURT: {
      id: 'FOOD_YOGURT',
      displayName: 'Yogurt',
      category: 'CATEGORY_DAIRY_CHEESE',
      aliases: ['yogurt', 'yoghurt', 'greek yogurt']
    },
    FOOD_CHEESE: {
      id: 'FOOD_CHEESE',
      displayName: 'Cheese',
      category: 'CATEGORY_DAIRY_CHEESE',
      aliases: ['cheese', 'cheddar', 'brie']
    },
    FOOD_CHEESE_PLATES: {
      id: 'FOOD_CHEESE_PLATES',
      displayName: 'Cheese Plates',
      category: 'CATEGORY_DAIRY_CHEESE',
      aliases: ['cheese plates', 'cheese board', 'assorted cheese']
    },
    FOOD_STRONG_CHEESE: {
      id: 'FOOD_STRONG_CHEESE',
      displayName: 'Strong Cheese',
      category: 'CATEGORY_DAIRY_CHEESE',
      aliases: ['strong cheese', 'aged cheese', 'pungent cheese']
    },
    FOOD_HARD_CHEESE: {
      id: 'FOOD_HARD_CHEESE',
      displayName: 'Hard Cheese',
      category: 'CATEGORY_DAIRY_CHEESE',
      aliases: ['hard cheese', 'aged hard cheese', 'parmesan']
    },
    FOOD_LIGHT_CHEESE: {
      id: 'FOOD_LIGHT_CHEESE',
      displayName: 'Light Cheese',
      category: 'CATEGORY_DAIRY_CHEESE',
      aliases: ['light cheese', 'soft cheese', 'fresh cheese']
    },

    // ========== FRUITS & BERRIES ==========
    FOOD_FRUITS: {
      id: 'FOOD_FRUITS',
      displayName: 'Fruits',
      category: 'CATEGORY_FRUITS',
      aliases: ['fruits', 'fruit', 'fresh fruit']
    },
    FOOD_FRUIT_SALADS: {
      id: 'FOOD_FRUIT_SALADS',
      displayName: 'Fruit Salads',
      category: 'CATEGORY_FRUITS',
      aliases: ['fruit salads', 'fruit salad', 'mixed fruit']
    },
    FOOD_TROPICAL_FRUIT: {
      id: 'FOOD_TROPICAL_FRUIT',
      displayName: 'Tropical Fruit',
      category: 'CATEGORY_FRUITS',
      aliases: ['tropical fruit', 'tropical fruits', 'mango', 'pineapple', 'papaya']
    },
    FOOD_BERRIES: {
      id: 'FOOD_BERRIES',
      displayName: 'Berries',
      category: 'CATEGORY_FRUITS',
      aliases: ['berries', 'berry', 'strawberry', 'blueberry', 'raspberry']
    },

    // ========== PREPARED DISHES ==========
    FOOD_RICE_DISHES: {
      id: 'FOOD_RICE_DISHES',
      displayName: 'Rice Dishes',
      category: 'CATEGORY_PREPARED_DISHES',
      aliases: ['rice dishes', 'rice', 'pilaf', 'risotto']
    },
    FOOD_SOUPS: {
      id: 'FOOD_SOUPS',
      displayName: 'Soups',
      category: 'CATEGORY_PREPARED_DISHES',
      aliases: ['soups', 'soup', 'broth', 'stock']
    },
    FOOD_LIGHT_SOUPS: {
      id: 'FOOD_LIGHT_SOUPS',
      displayName: 'Light Soups',
      category: 'CATEGORY_PREPARED_DISHES',
      aliases: ['light soups', 'broth', 'consommé']
    },
    FOOD_HEARTY_SOUPS: {
      id: 'FOOD_HEARTY_SOUPS',
      displayName: 'Hearty Soups',
      category: 'CATEGORY_PREPARED_DISHES',
      aliases: ['hearty soups', 'chunky soups', 'stew soups']
    },
    FOOD_SAVORY_PASTRIES: {
      id: 'FOOD_SAVORY_PASTRIES',
      displayName: 'Savory Pastries',
      category: 'CATEGORY_PREPARED_DISHES',
      aliases: ['savory pastries', 'savory', 'quiche', 'empanada']
    },
    FOOD_SAVORY_SOUPS: {
      id: 'FOOD_SAVORY_SOUPS',
      displayName: 'Savory Soups',
      category: 'CATEGORY_PREPARED_DISHES',
      aliases: ['savory soups', 'meat soups', 'umami soups']
    },
    FOOD_STEWS: {
      id: 'FOOD_STEWS',
      displayName: 'Stews',
      category: 'CATEGORY_PREPARED_DISHES',
      aliases: ['stews', 'stew', 'braised', 'casserole']
    },
    FOOD_RICH_STEWS: {
      id: 'FOOD_RICH_STEWS',
      displayName: 'Rich Stews',
      category: 'CATEGORY_PREPARED_DISHES',
      aliases: ['rich stews', 'hearty stews', 'meat stews']
    },
    FOOD_CURRIES: {
      id: 'FOOD_CURRIES',
      displayName: 'Curries',
      category: 'CATEGORY_PREPARED_DISHES',
      aliases: ['curries', 'curry', 'spiced']
    },
    FOOD_RICH_DISHES: {
      id: 'FOOD_RICH_DISHES',
      displayName: 'Rich Dishes',
      category: 'CATEGORY_PREPARED_DISHES',
      aliases: ['rich dishes', 'heavy dishes', 'indulgent food']
    },
    FOOD_COMFORT_FOOD: {
      id: 'FOOD_COMFORT_FOOD',
      displayName: 'Comfort Food',
      category: 'CATEGORY_PREPARED_DISHES',
      aliases: ['comfort food', 'comfort foods', 'cozy food']
    },
    FOOD_COMFORT_FOODS: {
      id: 'FOOD_COMFORT_FOODS',
      displayName: 'Comfort Foods',
      category: 'CATEGORY_PREPARED_DISHES',
      aliases: ['comfort foods', 'comfort food', 'hearty']
    },
    FOOD_SPICED_FOODS: {
      id: 'FOOD_SPICED_FOODS',
      displayName: 'Spiced Foods',
      category: 'CATEGORY_PREPARED_DISHES',
      aliases: ['spiced foods', 'spiced', 'spicy']
    },
    FOOD_MIDDLE_EASTERN_SWEETS: {
      id: 'FOOD_MIDDLE_EASTERN_SWEETS',
      displayName: 'Middle Eastern Sweets',
      category: 'CATEGORY_PREPARED_DISHES',
      aliases: ['middle eastern sweets', 'baklava', 'turkish sweets']
    },
    FOOD_BREAKFAST_FOODS: {
      id: 'FOOD_BREAKFAST_FOODS',
      displayName: 'Breakfast Foods',
      category: 'CATEGORY_PREPARED_DISHES',
      aliases: ['breakfast foods', 'breakfast', 'oatmeal', 'cereal']
    },
    FOOD_OATMEAL: {
      id: 'FOOD_OATMEAL',
      displayName: 'Oatmeal',
      category: 'CATEGORY_PREPARED_DISHES',
      aliases: ['oatmeal', 'porridge', 'cereal', 'grain']
    },
    FOOD_SMOKED_FOODS: {
      id: 'FOOD_SMOKED_FOODS',
      displayName: 'Smoked Foods',
      category: 'CATEGORY_PREPARED_DISHES',
      aliases: ['smoked foods', 'smoked', 'cured']
    },
    FOOD_BBQ: {
      id: 'FOOD_BBQ',
      displayName: 'BBQ',
      category: 'CATEGORY_PREPARED_DISHES',
      aliases: ['bbq', 'barbecue', 'grilled']
    },

    // ========== BEVERAGES & EXTRAS ==========
    FOOD_COFFEE: {
      id: 'FOOD_COFFEE',
      displayName: 'Coffee',
      category: 'CATEGORY_BEVERAGES',
      aliases: ['coffee', 'espresso', 'coffee drink']
    },
    FOOD_NUTS: {
      id: 'FOOD_NUTS',
      displayName: 'Nuts',
      category: 'CATEGORY_FRUITS',
      aliases: ['nuts', 'almond', 'walnut', 'hazelnut']
    },
    FOOD_ROASTED_NUTS: {
      id: 'FOOD_ROASTED_NUTS',
      displayName: 'Roasted Nuts',
      category: 'CATEGORY_FRUITS',
      aliases: ['roasted nuts', 'roasted', 'toasted nuts']
    },
    FOOD_CARAMEL: {
      id: 'FOOD_CARAMEL',
      displayName: 'Caramel',
      category: 'CATEGORY_DESSERTS',
      aliases: ['caramel', 'toffee', 'caramel sauce']
    },
    FOOD_CHOCOLATE: {
      id: 'FOOD_CHOCOLATE',
      displayName: 'Chocolate',
      category: 'CATEGORY_DESSERTS',
      aliases: ['chocolate', 'cocoa', 'chocolate dessert']
    }
  };

  /**
   * Get food by ID or alias (case-insensitive)
   * @param {string} query - Food ID or alias
   * @returns {Object|null} - Food object or null if not found
   */
  static getFood(query) {
    if (!query) return null;

    const normalizedQuery = String(query).toLowerCase().trim();

    // Try direct ID match (case-insensitive)
    for (const [id, food] of Object.entries(this.FOODS)) {
      if (id.toLowerCase() === normalizedQuery) {
        return food;
      }
    }

    // Try alias match
    for (const food of Object.values(this.FOODS)) {
      if (food.aliases?.some(alias => alias.toLowerCase() === normalizedQuery)) {
        return food;
      }
    }

    return null;
  }

  /**
   * Get category by ID or displayName
   * @param {string} query - Category ID or displayName
   * @returns {Object|null} - Category object or null if not found
   */
  static getCategory(query) {
    if (!query) return null;

    const normalizedQuery = String(query).toLowerCase().trim();

    for (const category of Object.values(this.CATEGORIES)) {
      if (
        category.id.toLowerCase() === normalizedQuery ||
        category.displayName.toLowerCase() === normalizedQuery
      ) {
        return category;
      }
    }

    return null;
  }

  /**
   * Get cuisine by ID or displayName
   * @param {string} query - Cuisine ID or displayName
   * @returns {Object|null} - Cuisine object or null if not found
   */
  static getCuisine(query) {
    if (!query) return null;

    const normalizedQuery = String(query).toLowerCase().trim();

    for (const cuisine of Object.values(this.CUISINES)) {
      if (
        cuisine.id.toLowerCase() === normalizedQuery ||
        cuisine.displayName.toLowerCase() === normalizedQuery
      ) {
        return cuisine;
      }
    }

    return null;
  }

  /**
   * Get all foods in a category
   * @param {string} categoryId - Category ID or displayName
   * @returns {Array} - Array of food objects
   */
  static getFoodsByCategory(categoryId) {
    const category = this.getCategory(categoryId);
    if (!category) return [];

    return Object.values(this.FOODS).filter(
      food => food.category === category.id
    );
  }

  /**
   * Get all categories
   * @returns {Array} - Array of all category objects
   */
  static getAllCategories() {
    return Object.values(this.CATEGORIES);
  }

  /**
   * Get all cuisines
   * @returns {Array} - Array of all cuisine objects
   */
  static getAllCuisines() {
    return Object.values(this.CUISINES);
  }

  /**
   * Get all foods
   * @returns {Array} - Array of all food objects
   */
  static getAllFoods() {
    return Object.values(this.FOODS);
  }

  /**
   * List all valid food IDs and aliases (for error messages)
   * @returns {Array} - Array of all valid identifiers
   */
  static listAllValid() {
    const valid = [];

    Object.values(this.FOODS).forEach(food => {
      valid.push(food.id);
      valid.push(...food.aliases);
    });

    return valid;
  }

  /**
   * Validate that a food exists
   * Throws helpful error if not found
   * @param {string} query - Food ID or alias
   * @throws {Error} - If food not found
   */
  static validateFood(query) {
    const food = this.getFood(query);

    if (!food) {
      throw new Error(
        `Unknown food: "${query}"\n` +
        `Valid foods: ${this.listAllValid().join(', ')}`
      );
    }

    return food;
  }
}

export default FoodTaxonomy;
