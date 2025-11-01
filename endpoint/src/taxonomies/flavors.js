/**
 * flavors.js
 *
 * Unified taxonomy for all tea flavors
 * Single source of truth for flavor definitions, categories, and associations
 *
 * ID Convention: UPPERCASE_WITH_UNDERSCORES
 * Example: FLAVOR_JASMINE, CATEGORY_FLORAL, ACTIVITY_RELAXATION
 */

export class FlavorTaxonomy {
  /**
   * Flavor Categories
   * Groups flavors into broader flavor families
   */
  static CATEGORIES = {
    CATEGORY_FLORAL: {
      id: 'CATEGORY_FLORAL',
      displayName: 'Floral',
      description: 'Light, delicate, aromatic flavors reminiscent of flowers'
    },
    CATEGORY_FRUITY: {
      id: 'CATEGORY_FRUITY',
      displayName: 'Fruity',
      description: 'Sweet, vibrant flavors reminiscent of fresh and dried fruits'
    },
    CATEGORY_VEGETAL: {
      id: 'CATEGORY_VEGETAL',
      displayName: 'Vegetal',
      description: 'Fresh, grassy, leafy, herbal flavors'
    },
    CATEGORY_NUTTY_TOASTY: {
      id: 'CATEGORY_NUTTY_TOASTY',
      displayName: 'Nutty & Toasty',
      description: 'Warm, toasted, nutty, grainy flavors'
    },
    CATEGORY_SPICY: {
      id: 'CATEGORY_SPICY',
      displayName: 'Spicy',
      description: 'Warm pungent or cooling spice flavors'
    },
    CATEGORY_SWEET: {
      id: 'CATEGORY_SWEET',
      displayName: 'Sweet',
      description: 'Sweet, sugary, dessert-like flavors'
    },
    CATEGORY_EARTHY: {
      id: 'CATEGORY_EARTHY',
      displayName: 'Earthy',
      description: 'Mineral, soil, woody, aged flavors'
    },
    CATEGORY_WOODY: {
      id: 'CATEGORY_WOODY',
      displayName: 'Woody',
      description: 'Wood, cedar, pine, bark flavors'
    },
    CATEGORY_ROASTED: {
      id: 'CATEGORY_ROASTED',
      displayName: 'Roasted',
      description: 'Charred, toasted, smoky, coffee flavors'
    },
    CATEGORY_UMAMI: {
      id: 'CATEGORY_UMAMI',
      displayName: 'Umami/Savory',
      description: 'Savory, marine, umami, broth flavors'
    }
  };

  /**
   * Individual Flavors
   * Each flavor has:
   * - id: unique identifier
   * - displayName: human-readable name
   * - category: references CATEGORIES
   * - aliases: alternative names/spellings
   * - hints: references to activities, foods, seasons (by ID, not string)
   */
  static FLAVORS = {
    // ========== FLORAL FLAVORS ==========
    FLAVOR_JASMINE: {
      id: 'FLAVOR_JASMINE',
      displayName: 'Jasmine',
      category: 'CATEGORY_FLORAL',
      aliases: ['jasmine', 'jasmine flower', 'jasmine scent', 'floral'],
      foodPairingHints: ['FOOD_LIGHT_DESSERTS', 'FOOD_STEAMED_VEGETABLES', 'FOOD_WHITE_FISH', 'FOOD_RICE_DISHES'],
      seasonalAffinityHints: ['SEASON_SPRING', 'SEASON_SUMMER'],
      activityHints: ['ACTIVITY_RELAXATION', 'ACTIVITY_SOCIAL', 'ACTIVITY_EVENING', 'ACTIVITY_UNWINDING']
    },
    FLAVOR_ROSE: {
      id: 'FLAVOR_ROSE',
      displayName: 'Rose',
      category: 'CATEGORY_FLORAL',
      aliases: ['rose', 'rose petal', 'floral rose'],
      foodPairingHints: ['FOOD_PASTRIES', 'FOOD_FRUIT_SALADS', 'FOOD_MIDDLE_EASTERN_SWEETS', 'FOOD_YOGURT'],
      seasonalAffinityHints: ['SEASON_SPRING', 'SEASON_SUMMER'],
      activityHints: ['ACTIVITY_RELAXATION', 'ACTIVITY_SOCIAL', 'ACTIVITY_ROMANTIC']
    },
    FLAVOR_ORCHID: {
      id: 'FLAVOR_ORCHID',
      displayName: 'Orchid',
      category: 'CATEGORY_FLORAL',
      aliases: ['orchid', 'orchid floral'],
      foodPairingHints: ['FOOD_CREAMY_DESSERTS', 'FOOD_LIGHT_CAKES', 'FOOD_TROPICAL_FRUIT', 'FOOD_SUBTLE_PASTRIES'],
      seasonalAffinityHints: ['SEASON_SPRING', 'SEASON_ANYTIME'],
      activityHints: ['ACTIVITY_RELAXATION', 'ACTIVITY_CONTEMPLATIVE', 'ACTIVITY_SOCIAL']
    },
    FLAVOR_LILAC: {
      id: 'FLAVOR_LILAC',
      displayName: 'Lilac',
      category: 'CATEGORY_FLORAL',
      aliases: ['lilac', 'lilac flower'],
      foodPairingHints: ['FOOD_SPRING_SALADS', 'FOOD_LIGHT_FRUIT_TARTS', 'FOOD_MADELEINES'],
      seasonalAffinityHints: ['SEASON_SPRING'],
      activityHints: ['ACTIVITY_UPLIFTING', 'ACTIVITY_SOCIAL', 'ACTIVITY_CREATIVE']
    },
    FLAVOR_OSMANTHUS: {
      id: 'FLAVOR_OSMANTHUS',
      displayName: 'Osmanthus',
      category: 'CATEGORY_FLORAL',
      aliases: ['osmanthus', 'sweet osmanthus'],
      foodPairingHints: ['FOOD_APRICOT_PASTRIES', 'FOOD_MOON_CAKES', 'FOOD_JELLIES', 'FOOD_LIGHT_COOKIES'],
      seasonalAffinityHints: ['SEASON_AUTUMN', 'SEASON_SPRING'],
      activityHints: ['ACTIVITY_UPLIFTING', 'ACTIVITY_SOCIAL', 'ACTIVITY_RELAXATION']
    },
    FLAVOR_HONEYSUCKLE: {
      id: 'FLAVOR_HONEYSUCKLE',
      displayName: 'Honeysuckle',
      category: 'CATEGORY_FLORAL',
      aliases: ['honeysuckle', 'honeysuckle flower'],
      foodPairingHints: ['FOOD_FRUIT_SALADS', 'FOOD_LIGHT_CAKES', 'FOOD_SORBETS'],
      seasonalAffinityHints: ['SEASON_SPRING', 'SEASON_SUMMER'],
      activityHints: ['ACTIVITY_UPLIFTING', 'ACTIVITY_RELAXATION', 'ACTIVITY_SOCIAL']
    },

    // ========== FRUITY FLAVORS ==========
    FLAVOR_APPLE: {
      id: 'FLAVOR_APPLE',
      displayName: 'Apple',
      category: 'CATEGORY_FRUITY',
      aliases: ['apple', 'red apple', 'green apple'],
      foodPairingHints: ['FOOD_CHEESE_PLATES', 'FOOD_PORK_DISHES', 'FOOD_OATMEAL', 'FOOD_LIGHT_CAKES'],
      seasonalAffinityHints: ['SEASON_AUTUMN', 'SEASON_SPRING'],
      activityHints: ['ACTIVITY_SOCIAL', 'ACTIVITY_AFTERNOON_BREAK', 'ACTIVITY_GENTLE_ENERGY']
    },
    FLAVOR_CITRUS: {
      id: 'FLAVOR_CITRUS',
      displayName: 'Citrus',
      category: 'CATEGORY_FRUITY',
      aliases: ['citrus', 'lemon', 'orange', 'grapefruit', 'lime', 'citrus peel'],
      foodPairingHints: ['FOOD_SEAFOOD', 'FOOD_SALADS', 'FOOD_CHICKEN', 'FOOD_LIGHT_DESSERTS'],
      seasonalAffinityHints: ['SEASON_SUMMER', 'SEASON_SPRING'],
      activityHints: ['ACTIVITY_ENERGY', 'ACTIVITY_FOCUS', 'ACTIVITY_MORNING', 'ACTIVITY_REFRESHMENT']
    },
    FLAVOR_BERRY: {
      id: 'FLAVOR_BERRY',
      displayName: 'Berry',
      category: 'CATEGORY_FRUITY',
      aliases: ['berry', 'strawberry', 'raspberry', 'blueberry', 'blackberry'],
      foodPairingHints: ['FOOD_DESSERTS', 'FOOD_YOGURT', 'FOOD_BREAKFAST_FOODS', 'FOOD_SALADS'],
      seasonalAffinityHints: ['SEASON_SUMMER', 'SEASON_SPRING'],
      activityHints: ['ACTIVITY_ENERGY', 'ACTIVITY_SOCIAL', 'ACTIVITY_UPLIFTING']
    },
    FLAVOR_DARK_FRUITS: {
      id: 'FLAVOR_DARK_FRUITS',
      displayName: 'Dark Fruits',
      category: 'CATEGORY_FRUITY',
      aliases: ['dark fruits', 'dark fruit', 'raisin', 'prune', 'fig', 'cherry', 'plum'],
      foodPairingHints: ['FOOD_DARK_CHOCOLATE', 'FOOD_GAME_MEATS', 'FOOD_ROASTED_MEATS', 'FOOD_STRONG_CHEESE', 'FOOD_SPICED_DESSERTS', 'FOOD_RICH_STEWS'],
      seasonalAffinityHints: ['SEASON_AUTUMN', 'SEASON_WINTER'],
      activityHints: ['ACTIVITY_EVENING', 'ACTIVITY_SOCIAL', 'ACTIVITY_CONTEMPLATIVE', 'ACTIVITY_RELAXATION']
    },

    // ========== VEGETAL FLAVORS ==========
    FLAVOR_GRASSY: {
      id: 'FLAVOR_GRASSY',
      displayName: 'Grassy',
      category: 'CATEGORY_VEGETAL',
      aliases: ['grassy', 'fresh cut grass', 'hay', 'green', 'vegetal', 'vegetable'],
      foodPairingHints: ['FOOD_FRESH_SALADS', 'FOOD_LIGHT_VEGETABLE_DISHES', 'FOOD_WHITE_FISH'],
      seasonalAffinityHints: ['SEASON_SPRING', 'SEASON_EARLY_SUMMER'],
      activityHints: ['ACTIVITY_MORNING', 'ACTIVITY_FOCUS', 'ACTIVITY_CLEANSING']
    },
    FLAVOR_LEAFY: {
      id: 'FLAVOR_LEAFY',
      displayName: 'Leafy',
      category: 'CATEGORY_VEGETAL',
      aliases: ['leafy', 'spinach', 'kale', 'lettuce', 'grass'],
      foodPairingHints: ['FOOD_SALADS', 'FOOD_STEAMED_GREENS', 'FOOD_LIGHT_SOUPS'],
      seasonalAffinityHints: ['SEASON_SPRING'],
      activityHints: ['ACTIVITY_FOCUS', 'ACTIVITY_DETOX_CLEANSING']
    },
    FLAVOR_HERBACEOUS: {
      id: 'FLAVOR_HERBACEOUS',
      displayName: 'Herbaceous',
      category: 'CATEGORY_VEGETAL',
      aliases: ['herbaceous', 'parsley', 'thyme', 'mint', 'sage', 'basil'],
      foodPairingHints: ['FOOD_GRILLED_VEGETABLES', 'FOOD_SAVORY_PASTRIES', 'FOOD_CHEESE', 'FOOD_SOUPS'],
      seasonalAffinityHints: ['SEASON_SPRING', 'SEASON_SUMMER'],
      activityHints: ['ACTIVITY_FOCUS', 'ACTIVITY_REFRESHMENT', 'ACTIVITY_CALM']
    },

    // ========== NUTTY & TOASTY FLAVORS ==========
    FLAVOR_NUTTY: {
      id: 'FLAVOR_NUTTY',
      displayName: 'Nutty',
      category: 'CATEGORY_NUTTY_TOASTY',
      aliases: ['nutty', 'almond', 'hazelnut', 'walnut', 'chestnut', 'creamy', 'peanut'],
      foodPairingHints: ['FOOD_BAKED_GOODS', 'FOOD_CHEESE', 'FOOD_ROASTED_VEGETABLES', 'FOOD_LIGHT_MEATS', 'FOOD_ROASTED_NUTS', 'FOOD_HARD_CHEESE'],
      seasonalAffinityHints: ['SEASON_AUTUMN', 'SEASON_WINTER'],
      activityHints: ['ACTIVITY_WARMING', 'ACTIVITY_COMFORT', 'ACTIVITY_RELAXATION', 'ACTIVITY_FOCUS']
    },
    FLAVOR_TOASTED: {
      id: 'FLAVOR_TOASTED',
      displayName: 'Toasted',
      category: 'CATEGORY_NUTTY_TOASTY',
      aliases: ['toasted', 'bread', 'grain', 'barley', 'rice', 'toast', 'buttery', 'butter'],
      foodPairingHints: ['FOOD_BREAKFAST_FOODS', 'FOOD_ROASTED_NUTS', 'FOOD_COMFORT_FOOD', 'FOOD_BAKED_GOODS', 'FOOD_GRILLED_MEATS'],
      seasonalAffinityHints: ['SEASON_AUTUMN', 'SEASON_WINTER'],
      activityHints: ['ACTIVITY_WARMING', 'ACTIVITY_COMFORT', 'ACTIVITY_ROUTINE']
    },

    // ========== SPICY FLAVORS ==========
    FLAVOR_PUNGENT: {
      id: 'FLAVOR_PUNGENT',
      displayName: 'Pungent',
      category: 'CATEGORY_SPICY',
      aliases: ['pungent', 'pepper', 'ginger', 'cinnamon', 'clove', 'anise', 'licorice'],
      foodPairingHints: ['FOOD_RICH_DESSERTS', 'FOOD_SPICED_DESSERTS', 'FOOD_CURRIES', 'FOOD_STEWS', 'FOOD_SPICED_FOODS'],
      seasonalAffinityHints: ['SEASON_AUTUMN', 'SEASON_WINTER'],
      activityHints: ['ACTIVITY_WARMING', 'ACTIVITY_ENERGY', 'ACTIVITY_DIGESTIVE']
    },
    FLAVOR_COOLING_SPICE: {
      id: 'FLAVOR_COOLING_SPICE',
      displayName: 'Cooling Spice',
      category: 'CATEGORY_SPICY',
      aliases: ['cooling', 'menthol', 'camphor', 'mint'],
      foodPairingHints: ['FOOD_FRUIT_SALADS', 'FOOD_CHOCOLATE', 'FOOD_LAMB_DISHES', 'FOOD_YOGURT'],
      seasonalAffinityHints: ['SEASON_SUMMER', 'SEASON_SPRING'],
      activityHints: ['ACTIVITY_REFRESHMENT', 'ACTIVITY_FOCUS', 'ACTIVITY_DIGESTIVE']
    },

    // ========== SWEET FLAVORS ==========
    FLAVOR_CARAMEL: {
      id: 'FLAVOR_CARAMEL',
      displayName: 'Caramel',
      category: 'CATEGORY_SWEET',
      aliases: ['caramel', 'brown sugar', 'toffee', 'burnt sugar', 'molasses'],
      foodPairingHints: ['FOOD_DESSERTS', 'FOOD_ROASTED_NUTS', 'FOOD_CHEESE', 'FOOD_COFFEE', 'FOOD_DARK_CHOCOLATE', 'FOOD_BAKED_GOODS', 'FOOD_NUTS', 'FOOD_ICE_CREAM'],
      seasonalAffinityHints: ['SEASON_AUTUMN', 'SEASON_WINTER'],
      activityHints: ['ACTIVITY_COMFORT', 'ACTIVITY_WARMING', 'ACTIVITY_RELAXATION', 'ACTIVITY_EVENING', 'ACTIVITY_SOCIAL']
    },
    FLAVOR_HONEY: {
      id: 'FLAVOR_HONEY',
      displayName: 'Honey',
      category: 'CATEGORY_SWEET',
      aliases: ['honey', 'sweet', 'sugary', 'malt'],
      foodPairingHints: ['FOOD_LIGHT_DESSERTS', 'FOOD_FRUITS', 'FOOD_PASTRIES', 'FOOD_YOGURT'],
      seasonalAffinityHints: ['SEASON_ANYTIME'],
      activityHints: ['ACTIVITY_COMFORT', 'ACTIVITY_RELAXATION', 'ACTIVITY_SOCIAL', 'ACTIVITY_TREAT']
    },
    FLAVOR_CHOCOLATE: {
      id: 'FLAVOR_CHOCOLATE',
      displayName: 'Chocolate',
      category: 'CATEGORY_SWEET',
      aliases: ['chocolate', 'cocoa', 'dark chocolate'],
      foodPairingHints: ['FOOD_DESSERTS', 'FOOD_BERRIES', 'FOOD_COFFEE', 'FOOD_NUTS', 'FOOD_DARK_CHOCOLATE', 'FOOD_BAKED_GOODS', 'FOOD_ROASTED_NUTS'],
      seasonalAffinityHints: ['SEASON_WINTER', 'SEASON_AUTUMN'],
      activityHints: ['ACTIVITY_COMFORT', 'ACTIVITY_INDULGENCE', 'ACTIVITY_RELAXATION']
    },
    FLAVOR_MALT: {
      id: 'FLAVOR_MALT',
      displayName: 'Malt',
      category: 'CATEGORY_SWEET',
      aliases: ['malt', 'cereal', 'grain', 'malted'],
      foodPairingHints: ['FOOD_BREAKFAST_FOODS', 'FOOD_BAKED_GOODS', 'FOOD_BISCUITS', 'FOOD_CARAMEL', 'FOOD_HARD_CHEESE'],
      seasonalAffinityHints: ['SEASON_AUTUMN', 'SEASON_WINTER'],
      activityHints: ['ACTIVITY_WARMING', 'ACTIVITY_COMFORT', 'ACTIVITY_ROUTINE']
    },

    // ========== EARTHY FLAVORS ==========
    FLAVOR_SOIL: {
      id: 'FLAVOR_SOIL',
      displayName: 'Soil',
      category: 'CATEGORY_EARTHY',
      aliases: ['soil', 'petrichor', 'loam', 'forest floor', 'wet stone', 'earth'],
      foodPairingHints: ['FOOD_MUSHROOMS', 'FOOD_ROOT_VEGETABLES', 'FOOD_HEARTY_SOUPS', 'FOOD_DARK_MEATS', 'FOOD_GRILLED_MEATS'],
      seasonalAffinityHints: ['SEASON_AUTUMN', 'SEASON_WINTER'],
      activityHints: ['ACTIVITY_GROUNDING', 'ACTIVITY_CONTEMPLATIVE', 'ACTIVITY_WARMING']
    },
    FLAVOR_MINERAL: {
      id: 'FLAVOR_MINERAL',
      displayName: 'Mineral',
      category: 'CATEGORY_EARTHY',
      aliases: ['mineral', 'flint', 'slate', 'chalk', 'minerality'],
      foodPairingHints: ['FOOD_SEAFOOD', 'FOOD_SHELLFISH', 'FOOD_LIGHT_CHEESE', 'FOOD_OYSTERS', 'FOOD_HARD_CHEESE'],
      seasonalAffinityHints: ['SEASON_SPRING', 'SEASON_SUMMER', 'SEASON_AUTUMN'],
      activityHints: ['ACTIVITY_FOCUS', 'ACTIVITY_REFRESHMENT', 'ACTIVITY_CONTEMPLATIVE']
    },
    FLAVOR_AGED: {
      id: 'FLAVOR_AGED',
      displayName: 'Aged',
      category: 'CATEGORY_EARTHY',
      aliases: ['aged', 'leather', 'autumn leaves', 'camphor', 'moss', 'aged wood', 'stored grain'],
      foodPairingHints: ['FOOD_RICH_STEWS', 'FOOD_GAME_MEATS', 'FOOD_DARK_CHOCOLATE', 'FOOD_MUSHROOMS', 'FOOD_ROOT_VEGETABLES', 'FOOD_SPICED_FOODS'],
      seasonalAffinityHints: ['SEASON_AUTUMN', 'SEASON_WINTER'],
      activityHints: ['ACTIVITY_CONTEMPLATIVE', 'ACTIVITY_DIGESTIVE', 'ACTIVITY_WARMING']
    },

    // ========== WOODY FLAVORS ==========
    FLAVOR_CEDAR: {
      id: 'FLAVOR_CEDAR',
      displayName: 'Cedar',
      category: 'CATEGORY_WOODY',
      aliases: ['cedar', 'pine', 'cedar wood'],
      foodPairingHints: ['FOOD_SMOKED_SALMON', 'FOOD_HARD_CHEESE', 'FOOD_GAME_MEATS', 'FOOD_GRILLED_MEATS'],
      seasonalAffinityHints: ['SEASON_AUTUMN', 'SEASON_WINTER'],
      activityHints: ['ACTIVITY_FOCUS', 'ACTIVITY_CONTEMPLATIVE']
    },
    FLAVOR_WOODY_GENERAL: {
      id: 'FLAVOR_WOODY_GENERAL',
      displayName: 'Woody',
      category: 'CATEGORY_WOODY',
      aliases: ['woody', 'wood', 'bark', 'oak', 'forest'],
      foodPairingHints: ['FOOD_SMOKED_FOODS', 'FOOD_GRILLED_MEATS', 'FOOD_CHEESE', 'FOOD_MUSHROOMS', 'FOOD_HARD_CHEESE', 'FOOD_ROOT_VEGETABLES'],
      seasonalAffinityHints: ['SEASON_AUTUMN', 'SEASON_WINTER'],
      activityHints: ['ACTIVITY_GROUNDING', 'ACTIVITY_CONTEMPLATIVE', 'ACTIVITY_WARMING', 'ACTIVITY_RELAXATION']
    },

    // ========== ROASTED FLAVORS ==========
    FLAVOR_SMOKY: {
      id: 'FLAVOR_SMOKY',
      displayName: 'Smoky',
      category: 'CATEGORY_ROASTED',
      aliases: ['smoky', 'smoke', 'bonfire', 'tobacco', 'burnt', 'pine resin'],
      foodPairingHints: ['FOOD_SMOKED_FOODS', 'FOOD_BBQ', 'FOOD_STRONG_CHEESE', 'FOOD_BACON', 'FOOD_GRILLED_MEATS', 'FOOD_DARK_CHOCOLATE'],
      seasonalAffinityHints: ['SEASON_WINTER', 'SEASON_AUTUMN'],
      activityHints: ['ACTIVITY_WARMING', 'ACTIVITY_CONTEMPLATIVE', 'ACTIVITY_BOLD_EXPERIENCE']
    },
    FLAVOR_COFFEE_LIKE: {
      id: 'FLAVOR_COFFEE_LIKE',
      displayName: 'Coffee-Like',
      category: 'CATEGORY_ROASTED',
      aliases: ['coffee', 'chicory', 'roasted nuts', 'espresso'],
      foodPairingHints: ['FOOD_DESSERTS', 'FOOD_BAKED_GOODS', 'FOOD_CHEESE', 'FOOD_ROASTED_NUTS', 'FOOD_DARK_CHOCOLATE'],
      seasonalAffinityHints: ['SEASON_AUTUMN', 'SEASON_WINTER'],
      activityHints: ['ACTIVITY_WARMING', 'ACTIVITY_COMFORT', 'ACTIVITY_FOCUS']
    },
    FLAVOR_ROASTED_GENERAL: {
      id: 'FLAVOR_ROASTED_GENERAL',
      displayName: 'Roasted',
      category: 'CATEGORY_ROASTED',
      aliases: ['roasted', 'charred', 'toasted', 'burnt'],
      foodPairingHints: ['FOOD_GRILLED_ROASTED_MEATS', 'FOOD_ROOT_VEGETABLES', 'FOOD_COMFORT_FOODS', 'FOOD_CHOCOLATE', 'FOOD_ROASTED_NUTS', 'FOOD_SPICED_FOODS'],
      seasonalAffinityHints: ['SEASON_AUTUMN', 'SEASON_WINTER'],
      activityHints: ['ACTIVITY_WARMING', 'ACTIVITY_COMFORT', 'ACTIVITY_EVENING', 'ACTIVITY_RELAXATION']
    },

    // ========== UMAMI FLAVORS ==========
    FLAVOR_MARINE: {
      id: 'FLAVOR_MARINE',
      displayName: 'Marine',
      category: 'CATEGORY_UMAMI',
      aliases: ['marine', 'seaweed', 'nori', 'brine', 'oceanic', 'sea salt'],
      foodPairingHints: ['FOOD_SEAFOOD', 'FOOD_SUSHI', 'FOOD_RICE_DISHES', 'FOOD_LIGHT_VEGETABLES'],
      seasonalAffinityHints: ['SEASON_SPRING', 'SEASON_SUMMER'],
      activityHints: ['ACTIVITY_FOCUS', 'ACTIVITY_REFRESHMENT', 'ACTIVITY_CLEANSING']
    },
    FLAVOR_MEATY: {
      id: 'FLAVOR_MEATY',
      displayName: 'Meaty/Savory',
      category: 'CATEGORY_UMAMI',
      aliases: ['meaty', 'savory', 'broth', 'mushroom', 'umami'],
      foodPairingHints: ['FOOD_SAVORY_SOUPS', 'FOOD_STEWS', 'FOOD_MUSHROOMS', 'FOOD_RICH_DISHES'],
      seasonalAffinityHints: ['SEASON_AUTUMN', 'SEASON_WINTER'],
      activityHints: ['ACTIVITY_WARMING', 'ACTIVITY_COMFORT', 'ACTIVITY_SATIATING']
    }
  };

  /**
   * Get flavor by ID or alias (case-insensitive)
   * @param {string} query - Flavor ID or alias
   * @returns {Object|null} - Flavor object or null if not found
   */
  static getFlavor(query) {
    if (!query) return null;

    const normalizedQuery = String(query).toLowerCase().trim();

    // Try direct ID match (case-insensitive)
    for (const [id, flavor] of Object.entries(this.FLAVORS)) {
      if (id.toLowerCase() === normalizedQuery) {
        return flavor;
      }
    }

    // Try alias match
    for (const flavor of Object.values(this.FLAVORS)) {
      if (flavor.aliases?.some(alias => alias.toLowerCase() === normalizedQuery)) {
        return flavor;
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
   * Get all flavors in a category
   * @param {string} categoryId - Category ID or displayName
   * @returns {Array} - Array of flavor objects
   */
  static getFlavorsByCategory(categoryId) {
    const category = this.getCategory(categoryId);
    if (!category) return [];

    return Object.values(this.FLAVORS).filter(
      flavor => flavor.category === category.id
    );
  }

  /**
   * Get all flavors
   * @returns {Array} - Array of all flavor objects
   */
  static getAllFlavors() {
    return Object.values(this.FLAVORS);
  }

  /**
   * Get all categories
   * @returns {Array} - Array of all category objects
   */
  static getAllCategories() {
    return Object.values(this.CATEGORIES);
  }

  /**
   * List all valid flavor IDs and aliases (for error messages)
   * @returns {Array} - Array of all valid identifiers
   */
  static listAllValid() {
    const valid = [];

    Object.values(this.FLAVORS).forEach(flavor => {
      valid.push(flavor.id);
      valid.push(...flavor.aliases);
    });

    return valid;
  }

  /**
   * Validate that a flavor exists
   * Throws helpful error if not found
   * @param {string} query - Flavor ID or alias
   * @throws {Error} - If flavor not found
   */
  static validateFlavor(query) {
    const flavor = this.getFlavor(query);

    if (!flavor) {
      throw new Error(
        `Unknown flavor: "${query}"\n` +
        `Valid flavors: ${this.listAllValid().join(', ')}`
      );
    }

    return flavor;
  }
}

export default FlavorTaxonomy;
