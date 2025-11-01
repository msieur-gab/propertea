
// js/modules/teaData.js

/**
 * Core Tea Data Definitions
 */

// Simplified map for dropdown and basic type identification
export const teaTypes = {
    white: "White Tea",
    green: "Green Tea",
    yellow: "Yellow Tea",
    oolong: "Oolong (Wulong) Tea",
    black: "Black Tea",
    pu_er: "Pu'er Tea"
};

// Simple list of processing methods for suggestions and chips
// Using kebab-case consistently
export const processingMethodsList = [
    'minimal-processing', 'sun-dried', 'withered', 'steamed', 'pan-fired',
    'kill-green', 'light-roast', 'medium-roast', 'heavy-roast', 'charcoal-roast',
    'partial-oxidation', 'full-oxidation', 'oxidised', // 'oxidised' is general term
    'fermented', 'pile-fermented', 'anaerobic-fermentation',
    'aged', 'rolled', 'tumbled', 'compressed', 'shade-grown', 'insect-bitten',
    'rock-fired'
];

// Simple list of flavor profiles for suggestions and chips
// Using kebab-case or simple words consistently
export const flavorProfilesList = [
    // Floral
    'jasmine', 'rose', 'orchid', 'lilac', 'osmanthus', 'honeysuckle', 'chamomile', 'lavender', 'chrysanthemum', 'magnolia',
    // Fruity
    'citrus', 'lemon', 'orange', 'bergamot', 'yuzu', 'grapefruit',
    'stone-fruit', 'peach', 'apricot', 'plum', 'cherry',
    'tropical', 'pineapple', 'mango', 'coconut', 'lychee', 'passion-fruit',
    'berry', 'strawberry', 'blackberry', 'raspberry', 'blueberry',
    'tree-fruit', 'apple', 'pear', 'quince',
    'dried-fruit', 'raisin', 'fig', 'date', 'dried-apricot',
    'muscatel', 'grape',
    // Vegetal
    'vegetal', 'grassy', 'leafy', 'spinach', 'lettuce', 'kale',
    'herbaceous', 'thyme', 'basil', 'mint', 'sage',
    'marine', 'seaweed', 'ocean-air', 'nori', 'umami', // Marine often implies umami
    'garden-vegetal', 'cucumber', 'artichoke', 'asparagus', 'snap-pea', 'bamboo',
    // Sweet
    'sweet', 'honey', 'nectar', 'caramel', 'brown-sugar', 'toffee', 'molasses',
    'vanilla', 'cream', 'custard', 'malt',
    'chocolate', 'cocoa', 'dark-chocolate', 'cacao-nibs',
    'confectionery', 'marshmallow', 'marzipan',
    // Nutty & Toasty
    'nutty', 'almond', 'walnut', 'chestnut', 'hazelnut', 'pecan',
    'toasted', 'toasted-rice', 'barley', 'wheat', 'oats', 'biscuit', 'pastry',
    // Spicy
    'spicy', 'warm-spice', 'cinnamon', 'cardamom', 'clove', 'nutmeg', 'star-anise',
    'pungent', 'black-pepper', 'ginger', 'licorice', 'white-pepper',
    'cooling', 'menthol', 'camphor', 'eucalyptus',
    // Earthy
    'earthy', 'forest-floor', 'wet-earth', 'petrichor', 'loam',
    'mineral', 'slate', 'stone', 'volcanic-rock', 'wet-stone', 'flint', 'spring-water',
    'medicinal', 'herbs', 'roots',
    'compost', 'autumn-leaves', 'humus', 'mushroom', // Added mushroom here
    // Woody
    'woody', 'cedar', 'oak', 'sandalwood', 'rosewood', 'pine', 'resinous',
    // Roasted
    'roasted', 'smoky', 'campfire', 'charcoal', 'lapsang', 'bonfire',
    'coffee', 'chicory', 'burnt-sugar', 'charred', 'grilled',
    // Aged / Fermented Specific
    'aged', 'cellar', 'old-books', 'library', 'leather', 'must', 'warehouse',
    // Mouthfeel related (though not strictly flavors, often included)
    'astringent', 'drying', 'tannic', 'puckering', 'brisk', 'silky', 'creamy', 'thick', 'velvety', 'smooth', 'mouth-coating',
    // Bitter
    'bitter', 'cacao-bitter', 'coffee-bitter', 'herbal-bitter', 'dandelion', 'chicory', 'vegetable-bitter',
    // Dairy
    'dairy', 'milk', 'butter', 'buttery', 'yogurt', 'cheese',
];


// Suggestions based on tea type (simple lists)
export const suggestionsByType = {
    processing: {
        white: ['minimal-processing', 'sun-dried', 'withered'],
        green: ['steamed', 'pan-fired', 'kill-green'],
        yellow: ['light-roast', 'medium-roast', 'partial-oxidation', 'withered'], // Yellow involves smothering
        oolong: ['partial-oxidation', 'medium-roast', 'heavy-roast', 'charcoal-roast', 'rolled', 'tumbled', 'rock-fired', 'insect-bitten'],
        black: ['full-oxidation', 'withered', 'rolled', 'oxidised'],
        pu_er: ['fermented', 'pile-fermented', 'aged', 'compressed', 'sun-dried'] // Sun-dried often for sheng pu'er maocha
    },
    flavor: {
        white: ['floral', 'honeysuckle', 'fruity', 'peach', 'apricot', 'vanilla', 'delicate'],
        green: ['vegetal', 'grassy', 'marine', 'seaweed', 'umami', 'nutty', 'chestnut', 'sweet', 'bean'],
        yellow: ['sweet', 'nutty', 'floral', 'orchid', 'honey', 'almond', 'malt', 'toasted'],
        oolong: ['floral', 'orchid', 'osmanthus', 'fruity', 'peach', 'tropical', 'stone-fruit', 'honey', 'creamy', 'roasted', 'mineral', 'woody'],
        black: ['malt', 'chocolate', 'fruity', 'stone-fruit', 'dried-fruit', 'caramel', 'honey', 'spicy', 'woody', 'smoky'], // Added smoky for some blacks
        pu_er: ['earthy', 'woody', 'mushroom', 'forest-floor', 'aged', 'camphor', 'medicinal', 'sweet', 'date', 'molasses', 'mineral'] // Added mineral
    }
};
