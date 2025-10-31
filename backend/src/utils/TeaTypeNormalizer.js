/**
 * TeaTypeNormalizer.js
 *
 * Normalizes tea type names from both Western and Chinese conventions
 * to canonical internal types used by the system.
 *
 * Chinese categories (official):
 * - 绿茶 (lǜchá) - Green Tea
 * - 白茶 (báichá) - White Tea
 * - 黄茶 (huángchá) - Yellow Tea
 * - 乌龙茶 / 青茶 (wūlóngchá / qīngchá) - Oolong Tea
 * - 红茶 (hóngchá) - Red Tea (West calls it "Black Tea")
 * - 黑茶 (hēichá) - Dark Tea / Fermented Tea (post-fermented)
 *   - 普洱茶 (pǔ'ěr chá) - Puerh Tea (subcategory)
 *     - 生普洱 (shēng pǔ'ěr) - Raw/Aged Puerh
 *     - 熟普洱 (shú pǔ'ěr) - Ripe/Cooked Puerh
 */

const TEA_TYPE_MAPPING = {
  // Green Tea (绿茶)
  'green': { canonical: 'green', chinese: '绿茶', pinyin: 'lǜchá', western: 'Green Tea' },
  'green tea': { canonical: 'green', chinese: '绿茶', pinyin: 'lǜchá', western: 'Green Tea' },
  'lü cha': { canonical: 'green', chinese: '绿茶', pinyin: 'lǜchá', western: 'Green Tea' },
  'lücha': { canonical: 'green', chinese: '绿茶', pinyin: 'lǜchá', western: 'Green Tea' },

  // White Tea (白茶)
  'white': { canonical: 'white', chinese: '白茶', pinyin: 'báichá', western: 'White Tea' },
  'white tea': { canonical: 'white', chinese: '白茶', pinyin: 'báichá', western: 'White Tea' },
  'bai cha': { canonical: 'white', chinese: '白茶', pinyin: 'báichá', western: 'White Tea' },
  'baicha': { canonical: 'white', chinese: '白茶', pinyin: 'báichá', western: 'White Tea' },

  // Yellow Tea (黄茶)
  'yellow': { canonical: 'yellow', chinese: '黄茶', pinyin: 'huángchá', western: 'Yellow Tea' },
  'yellow tea': { canonical: 'yellow', chinese: '黄茶', pinyin: 'huángchá', western: 'Yellow Tea' },
  'huang cha': { canonical: 'yellow', chinese: '黄茶', pinyin: 'huángchá', western: 'Yellow Tea' },
  'huangcha': { canonical: 'yellow', chinese: '黄茶', pinyin: 'huángchá', western: 'Yellow Tea' },

  // Oolong Tea (乌龙茶 / 青茶)
  'oolong': { canonical: 'oolong', chinese: '乌龙茶', pinyin: 'wūlóngchá', western: 'Oolong Tea' },
  'oolong tea': { canonical: 'oolong', chinese: '乌龙茶', pinyin: 'wūlóngchá', western: 'Oolong Tea' },
  'wulong': { canonical: 'oolong', chinese: '乌龙茶', pinyin: 'wūlóngchá', western: 'Oolong Tea' },
  'wulong tea': { canonical: 'oolong', chinese: '乌龙茶', pinyin: 'wūlóngchá', western: 'Oolong Tea' },
  'wu long': { canonical: 'oolong', chinese: '乌龙茶', pinyin: 'wūlóngchá', western: 'Oolong Tea' },
  'qing cha': { canonical: 'oolong', chinese: '青茶', pinyin: 'qīngchá', western: 'Oolong Tea (Blue-Green)' },
  'qingcha': { canonical: 'oolong', chinese: '青茶', pinyin: 'qīngchá', western: 'Oolong Tea (Blue-Green)' },

  // Red Tea / Hongcha (红茶) - What the West calls "Black Tea"
  'red': { canonical: 'red', chinese: '红茶', pinyin: 'hóngchá', western: 'Red Tea (Black Tea)' },
  'red tea': { canonical: 'red', chinese: '红茶', pinyin: 'hóngchá', western: 'Red Tea (Black Tea)' },
  'hong cha': { canonical: 'red', chinese: '红茶', pinyin: 'hóngchá', western: 'Red Tea (Black Tea)' },
  'hongcha': { canonical: 'red', chinese: '红茶', pinyin: 'hóngchá', western: 'Red Tea (Black Tea)' },

  // Western "Black Tea" maps to Red Tea (红茶) - CRITICAL MAPPING
  'black': { canonical: 'red', chinese: '红茶', pinyin: 'hóngchá', western: 'Red Tea (Black Tea)' },
  'black tea': { canonical: 'red', chinese: '红茶', pinyin: 'hóngchá', western: 'Red Tea (Black Tea)' },

  // Dark Tea / Heicha (黑茶) - Post-fermented teas
  'dark': { canonical: 'dark', chinese: '黑茶', pinyin: 'hēichá', western: 'Dark Tea / Fermented Tea' },
  'dark tea': { canonical: 'dark', chinese: '黑茶', pinyin: 'hēichá', western: 'Dark Tea / Fermented Tea' },
  'hei cha': { canonical: 'dark', chinese: '黑茶', pinyin: 'hēichá', western: 'Dark Tea / Fermented Tea' },
  'heicha': { canonical: 'dark', chinese: '黑茶', pinyin: 'hēichá', western: 'Dark Tea / Fermented Tea' },
  'fermented tea': { canonical: 'dark', chinese: '黑茶', pinyin: 'hēichá', western: 'Dark Tea / Fermented Tea' },
  'post-fermented': { canonical: 'dark', chinese: '黑茶', pinyin: 'hēichá', western: 'Dark Tea / Fermented Tea' },

  // Puerh Tea (普洱茶) - Subcategory of Dark Tea
  'puerh': { canonical: 'dark', subtype: 'puerh', chinese: '普洱茶', pinyin: 'pǔ\'ěr chá', western: 'Puerh Tea' },
  'pu-erh': { canonical: 'dark', subtype: 'puerh', chinese: '普洱茶', pinyin: 'pǔ\'ěr chá', western: 'Puerh Tea' },
  'pu erh': { canonical: 'dark', subtype: 'puerh', chinese: '普洱茶', pinyin: 'pǔ\'ěr chá', western: 'Puerh Tea' },
  'puer': { canonical: 'dark', subtype: 'puerh', chinese: '普洱茶', pinyin: 'pǔ\'ěr chá', western: 'Puerh Tea' },
  'pu\'er': { canonical: 'dark', subtype: 'puerh', chinese: '普洱茶', pinyin: 'pǔ\'ěr chá', western: 'Puerh Tea' },

  // Puerh Sheng - Raw/Aged Puerh (生普洱)
  'puerh-sheng': { canonical: 'dark', subtype: 'puerh-sheng', chinese: '生普洱', pinyin: 'shēng pǔ\'ěr', western: 'Raw/Aged Puerh' },
  'puerh sheng': { canonical: 'dark', subtype: 'puerh-sheng', chinese: '生普洱', pinyin: 'shēng pǔ\'ěr', western: 'Raw/Aged Puerh' },
  'raw puerh': { canonical: 'dark', subtype: 'puerh-sheng', chinese: '生普洱', pinyin: 'shēng pǔ\'ěr', western: 'Raw/Aged Puerh' },
  'aged puerh': { canonical: 'dark', subtype: 'puerh-sheng', chinese: '生普洱', pinyin: 'shēng pǔ\'ěr', western: 'Raw/Aged Puerh' },
  'sheng puerh': { canonical: 'dark', subtype: 'puerh-sheng', chinese: '生普洱', pinyin: 'shēng pǔ\'ěr', western: 'Raw/Aged Puerh' },

  // Puerh Shou - Ripe/Cooked Puerh (熟普洱)
  'puerh-shou': { canonical: 'dark', subtype: 'puerh-shou', chinese: '熟普洱', pinyin: 'shú pǔ\'ěr', western: 'Ripe/Cooked Puerh' },
  'puerh shou': { canonical: 'dark', subtype: 'puerh-shou', chinese: '熟普洱', pinyin: 'shú pǔ\'ěr', western: 'Ripe/Cooked Puerh' },
  'ripe puerh': { canonical: 'dark', subtype: 'puerh-shou', chinese: '熟普洱', pinyin: 'shú pǔ\'ěr', western: 'Ripe/Cooked Puerh' },
  'cooked puerh': { canonical: 'dark', subtype: 'puerh-shou', chinese: '熟普洱', pinyin: 'shú pǔ\'ěr', western: 'Ripe/Cooked Puerh' },
  'shou puerh': { canonical: 'dark', subtype: 'puerh-shou', chinese: '熟普洱', pinyin: 'shú pǔ\'ěr', western: 'Ripe/Cooked Puerh' }
};

export class TeaTypeNormalizer {
  /**
   * Normalize tea type from any input format (Western or Chinese)
   * @param {string} input - Tea type in any format
   * @returns {Object} Normalized result with canonical type and metadata
   */
  static normalize(input) {
    if (!input || typeof input !== 'string') {
      return { canonical: 'unknown', subtype: null, error: 'Invalid input' };
    }

    const normalizedInput = input.toLowerCase().trim();
    const mapping = TEA_TYPE_MAPPING[normalizedInput];

    if (mapping) {
      return {
        canonical: mapping.canonical,
        subtype: mapping.subtype || null,
        chinese: mapping.chinese,
        pinyin: mapping.pinyin,
        western: mapping.western
      };
    }

    // If not found, return unknown
    return {
      canonical: 'unknown',
      subtype: null,
      original: input,
      error: `Unknown tea type: "${input}"`
    };
  }

  /**
   * Get all available tea types with metadata
   * @returns {Array} List of canonical tea types with display names
   */
  static getAllTypes() {
    const types = [
      { canonical: 'green', chinese: '绿茶', pinyin: 'lǜchá', western: 'Green Tea', subtypes: [] },
      { canonical: 'white', chinese: '白茶', pinyin: 'báichá', western: 'White Tea', subtypes: [] },
      { canonical: 'yellow', chinese: '黄茶', pinyin: 'huángchá', western: 'Yellow Tea', subtypes: [] },
      { canonical: 'oolong', chinese: '乌龙茶', pinyin: 'wūlóngchá', western: 'Oolong Tea', subtypes: [] },
      { canonical: 'red', chinese: '红茶', pinyin: 'hóngchá', western: 'Red Tea (Black Tea)', subtypes: [] },
      {
        canonical: 'dark',
        chinese: '黑茶',
        pinyin: 'hēichá',
        western: 'Dark Tea / Fermented Tea',
        subtypes: [
          { subtype: 'puerh-sheng', chinese: '生普洱', western: 'Raw/Aged Puerh' },
          { subtype: 'puerh-shou', chinese: '熟普洱', western: 'Ripe/Cooked Puerh' }
        ]
      }
    ];
    return types;
  }

  /**
   * Check if a type is valid
   * @param {string} input - Tea type to validate
   * @returns {boolean} True if valid tea type
   */
  static isValid(input) {
    const result = this.normalize(input);
    return result.canonical !== 'unknown';
  }

  /**
   * Get display name for tea type (for UI)
   * @param {string} canonical - Canonical tea type
   * @param {string} subtype - Optional subtype
   * @returns {string} User-friendly display name
   */
  static getDisplayName(canonical, subtype = null) {
    const allTypes = this.getAllTypes();
    const type = allTypes.find(t => t.canonical === canonical);

    if (!type) return 'Unknown Tea';

    if (subtype && type.subtypes) {
      const sub = type.subtypes.find(s => s.subtype === subtype);
      if (sub) return `${type.western} - ${sub.western}`;
    }

    return type.western;
  }

  /**
   * Get Chinese name for tea type
   * @param {string} canonical - Canonical tea type
   * @param {string} subtype - Optional subtype
   * @returns {string} Chinese name with characters
   */
  static getChineseName(canonical, subtype = null) {
    const allTypes = this.getAllTypes();
    const type = allTypes.find(t => t.canonical === canonical);

    if (!type) return '未知茶';

    if (subtype && type.subtypes) {
      const sub = type.subtypes.find(s => s.subtype === subtype);
      if (sub) return sub.chinese;
    }

    return type.chinese;
  }
}

// Export singleton for convenience
export const teaTypeNormalizer = new TeaTypeNormalizer();
