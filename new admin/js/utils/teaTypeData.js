/**
 * teaTypeData.js
 *
 * Frontend tea type data and utilities for the admin form
 * Maps Western and Chinese naming conventions to canonical types
 */

export const TEA_TYPES = [
  {
    id: 'green',
    canonical: 'green',
    chinese: '绿茶',
    pinyin: 'lǜchá',
    western: 'Green Tea',
    description: 'Unoxidized, fresh and vegetal',
    subtypes: []
  },
  {
    id: 'white',
    canonical: 'white',
    chinese: '白茶',
    pinyin: 'báichá',
    western: 'White Tea',
    description: 'Minimal processing, delicate and subtle',
    subtypes: []
  },
  {
    id: 'yellow',
    canonical: 'yellow',
    chinese: '黄茶',
    pinyin: 'huángchá',
    western: 'Yellow Tea',
    description: 'Lightly oxidized with yellowing step, mellow flavor',
    subtypes: []
  },
  {
    id: 'oolong',
    canonical: 'oolong',
    chinese: '乌龙茶 / 青茶',
    pinyin: 'wūlóngchá / qīngchá',
    western: 'Oolong Tea',
    description: 'Semi-oxidized, balance between green and black',
    subtypes: []
  },
  {
    id: 'red',
    canonical: 'red',
    chinese: '红茶',
    pinyin: 'hóngchá',
    western: 'Red Tea (Black Tea)',
    description: 'Fully oxidized, referred to as "Black Tea" in the West',
    subtypes: []
  },
  {
    id: 'dark',
    canonical: 'dark',
    chinese: '黑茶',
    pinyin: 'hēichá',
    western: 'Dark Tea / Fermented Tea',
    description: 'Post-fermented, earthy and aged character',
    subtypes: [
      {
        id: 'puerh-sheng',
        canonical: 'dark',
        subtype: 'puerh-sheng',
        chinese: '生普洱',
        pinyin: 'shēng pǔ\'ěr',
        western: 'Raw/Aged Puerh',
        description: 'Sun-dried and naturally aged, develops complexity'
      },
      {
        id: 'puerh-shou',
        canonical: 'dark',
        subtype: 'puerh-shou',
        chinese: '熟普洱',
        pinyin: 'shú pǔ\'ěr',
        western: 'Ripe/Cooked Puerh',
        description: 'Artificially fermented, smooth and earthy'
      }
    ]
  }
];

/**
 * Get display label for select option
 */
export function getTeaTypeLabel(type, subtype = null) {
  const teaType = TEA_TYPES.find(t => t.id === type);
  if (!teaType) return 'Unknown';

  const label = `${teaType.western} (${teaType.chinese})`;

  if (subtype && teaType.subtypes && teaType.subtypes.length > 0) {
    const sub = teaType.subtypes.find(s => s.subtype === subtype);
    if (sub) {
      return `${label} - ${sub.western}`;
    }
  }

  return label;
}

/**
 * Get subtypes for a given tea type
 */
export function getSubtypes(teaTypeId) {
  const teaType = TEA_TYPES.find(t => t.id === teaTypeId);
  return teaType && teaType.subtypes ? teaType.subtypes : [];
}

/**
 * Get all available tea types (without subtypes expanded)
 */
export function getAllTeaTypes() {
  return TEA_TYPES;
}

/**
 * Build options for dropdown (can include subtypes)
 */
export function buildTeaTypeOptions(includeSubtypes = false) {
  const options = [];

  TEA_TYPES.forEach(type => {
    options.push({
      value: type.id,
      label: `${type.western} (${type.chinese})`,
      group: 'Main Category'
    });

    if (includeSubtypes && type.subtypes && type.subtypes.length > 0) {
      type.subtypes.forEach(subtype => {
        options.push({
          value: `${type.id}:${subtype.subtype}`,
          label: `→ ${subtype.western} (${subtype.chinese})`,
          group: type.western
        });
      });
    }
  });

  return options;
}
