/**
 * ExtendedTeaDataset.js - Rich tea database for recommendations
 *
 * Contains detailed tea profiles with all relevant attributes for
 * effect analysis, timing recommendations, seasonal pairing, food matching,
 * and activity suggestions
 */

export const teaDatabase = [
  // ============================================================================
  // GREEN TEAS
  // ============================================================================
  {
    id: 'tea-green-sencha-001',
    name: 'Sencha Green Tea',
    type: 'green',
    subType: null,
    caffeineLevel: 7,
    lTheanineLevel: 4,
    flavor: {
      primary: ['vegetal', 'grassy', 'fresh'],
      secondary: ['slightly sweet', 'oceanic'],
      intensity: 'moderate'
    },
    geography: {
      country: 'Japan',
      province: 'Shizuoka',
      altitude: 600,
      temperature: 15,
      humidity: 70,
      solarRadiation: 150
    },
    processing: {
      methods: ['steaming'],
      oxidationLevel: 5,
      roastLevel: 'none',
      dryingMethod: 'sun-dried'
    },
    harvest: {
      season: 'spring',
      flush: 'first-flush'
    },
    source: {
      producer: 'Shizuoka Tea Estate'
    },
    tags: ['morning', 'focus', 'fresh', 'energizing'],
    bestPairedFood: ['seafood', 'light salads', 'sushi'],
    optimalTemperature: 70,
    steepTime: 60,
    steepCount: 3
  },
  {
    id: 'tea-green-matcha-001',
    name: 'Ceremonial Grade Matcha',
    type: 'green',
    subType: 'matcha',
    caffeineLevel: 8,
    lTheanineLevel: 6,
    flavor: {
      primary: ['grassy', 'umami', 'sweet'],
      secondary: ['creamy', 'nutty'],
      intensity: 'pronounced'
    },
    geography: {
      country: 'Japan',
      province: 'Kyoto',
      altitude: 800,
      temperature: 12,
      humidity: 75,
      solarRadiation: 80
    },
    processing: {
      methods: ['shade-grown', 'stone-ground'],
      oxidationLevel: 3,
      roastLevel: 'none',
      dryingMethod: 'shade-dried'
    },
    harvest: {
      season: 'spring',
      flush: 'first-flush'
    },
    source: {
      producer: 'Kyoto Ceremonial Farm'
    },
    tags: ['ceremony', 'meditation', 'sustained-energy', 'focus'],
    bestPairedFood: ['sweets', 'light pastries'],
    optimalTemperature: 75,
    steepTime: 0,
    preparation: 'whisked'
  },

  // ============================================================================
  // WHITE TEAS
  // ============================================================================
  {
    id: 'tea-white-silver-needle-001',
    name: 'Silver Needle White Tea',
    type: 'white',
    subType: null,
    caffeineLevel: 3,
    lTheanineLevel: 5,
    flavor: {
      primary: ['floral', 'sweet', 'delicate'],
      secondary: ['fruity', 'honey'],
      intensity: 'subtle'
    },
    geography: {
      country: 'China',
      province: 'Fujian',
      altitude: 1000,
      temperature: 10,
      humidity: 75,
      solarRadiation: 120
    },
    processing: {
      methods: ['withering'],
      oxidationLevel: 10,
      roastLevel: 'none',
      dryingMethod: 'sun-dried'
    },
    harvest: {
      season: 'spring',
      flush: 'first-flush'
    },
    source: {
      producer: 'Fujian White Tea Estate'
    },
    tags: ['calming', 'restorative', 'delicate', 'afternoon'],
    bestPairedFood: ['light desserts', 'scones', 'fruit'],
    optimalTemperature: 70,
    steepTime: 90,
    steepCount: 5
  },

  // ============================================================================
  // OOLONG TEAS
  // ============================================================================
  {
    id: 'tea-oolong-tie-guan-yin-001',
    name: 'Tie Guan Yin (Iron Goddess)',
    type: 'oolong',
    subType: 'roasted',
    caffeineLevel: 6,
    lTheanineLevel: 4,
    flavor: {
      primary: ['orchid', 'fruity', 'smooth'],
      secondary: ['nutty', 'floral'],
      intensity: 'pronounced'
    },
    geography: {
      country: 'China',
      province: 'Fujian',
      location: 'Anxi Mountains',
      altitude: 1200,
      temperature: 14,
      humidity: 78,
      solarRadiation: 130
    },
    processing: {
      methods: ['rolling', 'roasting'],
      oxidationLevel: 30,
      roastLevel: 'medium',
      dryingMethod: 'pan-fired'
    },
    harvest: {
      season: 'spring'
    },
    source: {
      producer: 'Anxi Oolong Estate'
    },
    tags: ['complex', 'refined', 'afternoon', 'evening'],
    bestPairedFood: ['roasted meats', 'hard cheese', 'nuts'],
    optimalTemperature: 95,
    steepTime: 90,
    steepCount: 6
  },
  {
    id: 'tea-oolong-da-hong-pao-001',
    name: 'Da Hong Pao (Big Red Robe)',
    type: 'oolong',
    subType: 'roasted',
    caffeineLevel: 7,
    lTheanineLevel: 3,
    flavor: {
      primary: ['roasted', 'fruity', 'mineral'],
      secondary: ['chocolate', 'caramel'],
      intensity: 'intense'
    },
    geography: {
      country: 'China',
      province: 'Fujian',
      location: 'Wuyi Mountains',
      altitude: 1500,
      temperature: 12,
      humidity: 80,
      solarRadiation: 140
    },
    processing: {
      methods: ['heavy roasting'],
      oxidationLevel: 50,
      roastLevel: 'heavy',
      dryingMethod: 'oven-dried'
    },
    harvest: {
      season: 'spring'
    },
    source: {
      producer: 'Wuyi Rock Tea Estate'
    },
    tags: ['powerful', 'earthy', 'warming', 'evening'],
    bestPairedFood: ['dark chocolate', 'grilled meats', 'rich desserts'],
    optimalTemperature: 100,
    steepTime: 90,
    steepCount: 8
  },

  // ============================================================================
  // BLACK TEAS
  // ============================================================================
  {
    id: 'tea-black-keemun-001',
    name: 'Keemun Black Tea',
    type: 'black',
    subType: null,
    caffeineLevel: 8,
    lTheanineLevel: 2,
    flavor: {
      primary: ['fruity', 'wine', 'slightly sweet'],
      secondary: ['cocoa', 'plum'],
      intensity: 'pronounced'
    },
    geography: {
      country: 'China',
      province: 'Anhui',
      altitude: 600,
      temperature: 16,
      humidity: 68,
      solarRadiation: 160
    },
    processing: {
      methods: ['oxidation'],
      oxidationLevel: 95,
      roastLevel: 'none',
      dryingMethod: 'sun-dried'
    },
    harvest: {
      season: 'autumn'
    },
    source: {
      producer: 'Anhui Black Tea Estate'
    },
    tags: ['morning', 'energizing', 'refined', 'breakfast'],
    bestPairedFood: ['pastries', 'chocolate', 'cream desserts'],
    optimalTemperature: 95,
    steepTime: 60,
    steepCount: 5
  },

  // ============================================================================
  // PUERH TEAS
  // ============================================================================
  {
    id: 'tea-puerh-sheng-001',
    name: 'Puerh Sheng (Raw) - 5 Years',
    type: 'puerh',
    subType: 'sheng',
    caffeineLevel: 6,
    lTheanineLevel: 3,
    flavor: {
      primary: ['floral', 'grassy', 'fruity'],
      secondary: ['woody', 'mineral'],
      intensity: 'moderate'
    },
    geography: {
      country: 'China',
      province: 'Yunnan',
      location: 'Yiwu',
      altitude: 1800,
      temperature: 15,
      humidity: 82,
      solarRadiation: 140
    },
    processing: {
      methods: ['sun-dried', 'compressed'],
      oxidationLevel: 25,
      fermentationDays: 0,
      roastLevel: 'none'
    },
    harvest: {
      season: 'spring'
    },
    storage: {
      ageInYears: 5,
      storageCondition: 'natural'
    },
    source: {
      producer: 'Yiwu Tea Mountain Cooperative'
    },
    tags: ['complex', 'evolving', 'afternoon', 'contemplative'],
    bestPairedFood: ['rich foods', 'digestive aid'],
    optimalTemperature: 95,
    steepTime: 90,
    steepCount: 10
  },
  {
    id: 'tea-puerh-shou-001',
    name: 'Puerh Shou (Ripe) - 15 Years',
    type: 'puerh',
    subType: 'shou',
    caffeineLevel: 4,
    lTheanineLevel: 4,
    flavor: {
      primary: ['earthy', 'woody', 'smooth'],
      secondary: ['sweet', 'fruity'],
      intensity: 'moderate'
    },
    geography: {
      country: 'China',
      province: 'Yunnan',
      location: 'Menghai',
      altitude: 1500,
      temperature: 15,
      humidity: 80,
      solarRadiation: 160
    },
    processing: {
      methods: ['pile-fermented', 'aged', 'compressed'],
      oxidationLevel: 95,
      fermentationDays: 45,
      roastLevel: 'none'
    },
    harvest: {
      season: 'spring'
    },
    storage: {
      ageInYears: 15,
      storageCondition: 'natural'
    },
    source: {
      producer: 'Menghai Tea Factory'
    },
    tags: ['grounding', 'comforting', 'digestive', 'evening'],
    bestPairedFood: ['heavy foods', 'roasted meats', 'spices'],
    optimalTemperature: 95,
    steepTime: 75,
    steepCount: 8
  },

  // ============================================================================
  // DARK TEAS
  // ============================================================================
  {
    id: 'tea-dark-liu-bao-001',
    name: 'Liu Bao Dark Tea',
    type: 'dark',
    subType: null,
    caffeineLevel: 5,
    lTheanineLevel: 3,
    flavor: {
      primary: ['earthy', 'woody', 'fruity'],
      secondary: ['betel nut', 'camphor'],
      intensity: 'pronounced'
    },
    geography: {
      country: 'China',
      province: 'Guangxi',
      location: 'Cangwu',
      altitude: 800,
      temperature: 18,
      humidity: 80,
      solarRadiation: 170
    },
    processing: {
      methods: ['pile-fermented', 'aged'],
      oxidationLevel: 95,
      roastLevel: 'none'
    },
    harvest: {
      season: 'autumn'
    },
    storage: {
      ageInYears: 10,
      storageCondition: 'humid'
    },
    source: {
      producer: 'Cangwu Dark Tea Workshop'
    },
    tags: ['medicinal', 'warming', 'digestive', 'evening'],
    bestPairedFood: ['rich foods', 'spicy cuisine'],
    optimalTemperature: 95,
    steepTime: 90,
    steepCount: 10
  },

  // ============================================================================
  // HERBAL TEAS
  // ============================================================================
  {
    id: 'tea-herbal-chamomile-001',
    name: 'Chamomile Flowers',
    type: 'herbal',
    subType: null,
    caffeineLevel: 0,
    lTheanineLevel: 0,
    flavor: {
      primary: ['floral', 'fruity', 'honey'],
      secondary: ['apple'],
      intensity: 'subtle'
    },
    geography: {
      country: 'Egypt',
      altitude: 100,
      temperature: 25,
      humidity: 40
    },
    processing: {
      methods: ['dried'],
      oxidationLevel: 0
    },
    harvest: {
      season: 'summer'
    },
    source: {
      producer: 'Egyptian Herbal Cooperative'
    },
    tags: ['calming', 'sleep-aid', 'evening', 'caffeine-free'],
    bestPairedFood: ['light desserts', 'honey'],
    optimalTemperature: 95,
    steepTime: 120,
    steepCount: 1
  }
];

/**
 * Get tea by ID
 */
export function getTeaById(id) {
  return teaDatabase.find(tea => tea.id === id);
}

/**
 * Search teas by name
 */
export function searchTeaByName(name) {
  return teaDatabase.filter(tea =>
    tea.name.toLowerCase().includes(name.toLowerCase())
  );
}

/**
 * Search teas by type
 */
export function searchTeaByType(type) {
  return teaDatabase.filter(tea =>
    tea.type.toLowerCase() === type.toLowerCase()
  );
}

/**
 * Search teas by tag
 */
export function searchTeaByTag(tag) {
  return teaDatabase.filter(tea =>
    tea.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  );
}

/**
 * Search teas by multiple criteria
 */
export function searchTeas(criteria) {
  let results = [...teaDatabase];

  if (criteria.type) {
    results = results.filter(tea => tea.type === criteria.type);
  }

  if (criteria.name) {
    results = results.filter(tea =>
      tea.name.toLowerCase().includes(criteria.name.toLowerCase())
    );
  }

  if (criteria.tag) {
    results = results.filter(tea =>
      tea.tags.includes(criteria.tag)
    );
  }

  if (criteria.caffeineMax !== undefined) {
    results = results.filter(tea => tea.caffeineLevel <= criteria.caffeineMax);
  }

  if (criteria.caffeineMin !== undefined) {
    results = results.filter(tea => tea.caffeineLevel >= criteria.caffeineMin);
  }

  return results;
}

/**
 * Get all unique tea types
 */
export function getTeaTypes() {
  return [...new Set(teaDatabase.map(tea => tea.type))];
}

/**
 * Get all unique tags
 */
export function getAllTags() {
  const tags = new Set();
  teaDatabase.forEach(tea => {
    tea.tags.forEach(tag => tags.add(tag));
  });
  return Array.from(tags).sort();
}

/**
 * Get teas by caffeine level
 */
export function getTeasByCaffeineLevel(min, max) {
  return teaDatabase.filter(tea =>
    tea.caffeineLevel >= min && tea.caffeineLevel <= max
  );
}

export default {
  teaDatabase,
  getTeaById,
  searchTeaByName,
  searchTeaByType,
  searchTeaByTag,
  searchTeas,
  getTeaTypes,
  getAllTags,
  getTeasByCaffeineLevel
};
