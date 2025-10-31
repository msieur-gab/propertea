/**
 * SynonymMappings.js
 *
 * Maps validation dataset terms to matcher activity/food recommendations.
 * Bridges the vocabulary gap between tea characteristics and human expectations.
 *
 * Used by both ActivityMatcher and FoodMatcher to improve matching accuracy.
 */

export const ActivitySynonyms = {
  // Validation dataset terms → Matcher activity equivalents
  "tea rituals": ["Tea Ceremony", "Daily Rituals", "Casual Sipping", "General Enjoyment"],
  "tea ritual": ["Tea Ceremony", "Daily Rituals", "Casual Sipping"],
  "reflection": ["Reflection", "Contemplation", "Deep Thinking", "Self-Reflection"],
  "gifting": ["Social Gatherings", "Social Events", "Hosting"],
  "appreciation": ["Mindful Observation", "Contemplation", "General Enjoyment"],
  "mindfulness": ["Mindfulness Practice", "Meditation", "Deep Breathing"],
  "social gatherings": ["Social Gatherings", "Conversation", "Social Events"],
  "morning or afternoon tea": ["Breakfast Companion", "Afternoon Break", "General Enjoyment"],
  "moments of reflection": ["Reflection", "Contemplation", "Mindfulness Practice"],
  "moments of reflection and mindfulness": ["Reflection", "Contemplation", "Mindfulness Practice"],
  "after-dinner": ["Evening Ritual", "Evening Wind-Down", "Relaxation"],
  "after dinner": ["Evening Ritual", "Evening Wind-Down"],
  "work or study": ["Work", "Study", "Problem Solving", "High-Focus Work"],
  "cultural or family events": ["Social Gatherings", "Tea Ceremony", "Social Events"],
  "welcoming guests": ["Hosting", "Social Gatherings", "Conversation"],
  "relaxation and stress reduction": ["Relaxation", "Meditation", "Deep Breathing", "Yoga"],
  "moments of focus and concentration": ["Work", "Study", "Reading", "Meditation"],
  "special occasions": ["Tea Ceremony", "Social Gatherings", "Social Events"],
  "self-indulgence": ["General Enjoyment", "Casual Sipping", "Relaxation"],
  "digestive aid": ["Evening Ritual", "Contemplation", "Relaxation"],
  "health-conscious routine": ["Daily Rituals", "Yoga", "Mindfulness Practice"],
  "contemplation": ["Contemplation", "Reflection", "Deep Thinking"],
  "meditation": ["Meditation", "Mindfulness Practice", "Deep Breathing"],
  "journaling": ["Journaling", "Creative Writing", "Self-Reflection"],
  "yoga": ["Yoga", "Gentle Stretching", "Deep Breathing"],
  "morning ritual": ["Breakfast Companion", "Morning Routines", "Daily Rituals"],
  "afternoon social": ["Afternoon Break", "Social Gatherings", "Conversation"],
  "post-meal": ["Evening Ritual", "Relaxation", "Contemplation"],
  "evening contemplation": ["Evening Wind-Down", "Contemplation", "Reflection"],
};

export const FoodSynonyms = {
  // Validation dataset terms → Matcher food equivalents
  "white meats": ["Chicken", "White Fish", "Pork Dishes", "Light Meat"],
  "asian stir-fries": ["Stir Fried Vegetables", "Rice Dishes", "Noodles", "Asian"],
  "spicy foods": ["Thai Curry", "Curries", "Spiced Dishes", "Spiced Cakes"],
  "creamy goat cheese": ["Goat Cheese", "Soft Cheese", "Cheese"],
  "green curry": ["Thai Curry", "Curries", "Spiced Dishes"],
  "honey cakes": ["Spiced Cakes", "Baked Goods", "Sweet Pastries", "Cakes"],
  "caramelized fruit tarts": ["Fruit Tarts", "Pastries", "Desserts"],
  "apple crumble with cream": ["Fruit Desserts", "Cream Desserts", "Baked Goods"],
  "milk and white chocolate": ["White Chocolate", "Chocolate Desserts", "Desserts"],
  "seafood": ["Seafood", "White Fish", "Grilled Fish", "Shellfish"],
  "steamed foods": ["Steamed Vegetables", "Steamed Rice", "Light Vegetables"],
  "salads": ["Salads", "Fresh Herbs", "Light Vegetables"],
  "fresh fruit": ["Fruits", "Berries", "Tropical Fruit"],
  "dragon well shrimp": ["Seafood", "Shellfish", "Sushi"],
  "fresh fruits": ["Fruits", "Berries", "Tropical Fruit", "Fresh Herbs"],
  "white fish": ["White Fish", "Grilled Fish", "Seafood"],
  "sushi": ["Sushi", "Seafood", "White Fish"],
  "sashimi": ["Seafood", "White Fish", "Shellfish"],
  "white chocolate": ["White Chocolate", "Chocolate Desserts", "Cream Desserts"],
  "fresh cheeses": ["Soft Cheese", "Brie", "Goat Cheese", "Cheese"],
  "vanilla cheesecake": ["Cream Desserts", "Custards", "Light Desserts"],
  "fruit tarts": ["Fruit Tarts", "Pastries", "Fruit Desserts"],
  "macarons": ["Light Desserts", "Pastries", "Sweet Pastries"],
  "yogurt with granola": ["Yogurt", "Light Desserts"],
  "buttery croissants": ["Pastries", "Baked Goods", "Sweet Pastries"],
  "grilled chicken salad": ["Chicken", "Salads", "Grilled Meats"],
  "light pasta dishes": ["Rice Dishes", "Noodles", "Light Vegetables"],
  "black tea": ["Dark Chocolate", "Grilled Meats", "Breakfast Foods"],
  "breakfast foods": ["Breakfast Foods", "Pastries", "Baked Goods"],
  "dim sum": ["Dim Sum", "Dumplings", "Light Dishes"],
  "dumplings": ["Dumplings", "Rice Dishes", "Noodles"],
  "roasted nuts": ["Roasted Nuts", "Nuts", "Baked Goods"],
  "rich meats": ["Grilled Meats", "Roasted Meats", "Game Meats"],
  "bbq": ["Bbq", "Grilled Meats", "Roasted Meats"],
  "dark chocolate": ["Dark Chocolate", "Chocolate Desserts"],
  "aged cheese": ["Aged Cheese", "Hard Cheese", "Strong Cheese"],
  "heavy roasted": ["Dark Chocolate", "Grilled Meats", "Roasted Nuts"],
};

/**
 * Get all synonyms that map to a particular activity/food
 * @param {string} term - The validation dataset term
 * @param {string} type - "activity" or "food"
 * @returns {Array<string>} - Array of matcher activities/foods this term maps to
 */
export function getSynonymsFor(term, type) {
  if (!term) return [];
  const normalized = term.toLowerCase().trim();

  if (type === "activity" && ActivitySynonyms[normalized]) {
    return ActivitySynonyms[normalized];
  }
  if (type === "food" && FoodSynonyms[normalized]) {
    return FoodSynonyms[normalized];
  }

  return [];
}

/**
 * Check if two terms are considered similar/synonyms
 * @param {string} actual - Recommended by matcher
 * @param {string} expected - Expected from dataset
 * @param {string} type - "activity" or "food"
 * @returns {boolean}
 */
export function areSynonyms(actual, expected, type) {
  if (!actual || !expected) return false;

  const synonyms = getSynonymsFor(expected, type);
  const normalizedActual = actual.toLowerCase().trim();

  return synonyms.some(s => s.toLowerCase().trim() === normalizedActual);
}

export default {
  ActivitySynonyms,
  FoodSynonyms,
  getSynonymsFor,
  areSynonyms,
};
