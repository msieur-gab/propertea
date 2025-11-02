export const brewingRecommendations = {
    gongfu: {
      // --- WHITE TEA ---
      white: [
        { // Buds-only white tea
          conditions: { processing: ['buds-only', 'unrolled', 'light-oxidized'] },
          params: {
            leafAmount: '4-5g per 100ml',
            waterTemp: '70-75°C',
            steepingTime: [45, 60, 75, 90],
            vesselRecommendation: {
              preferred: ['Glass Gaiwan', 'Porcelain Gaiwan'],
              notes: 'Glass or porcelain preserves delicate flavors and allows appreciation of the beautiful white buds.'
            },
            notes: 'Downy buds require longer steeping time. Higher leaf ratio compensates for volume of fluffy buds.',
            teas: ['Silver Needle', 'Moonlight White', 'Yunnan Silver Needle']
          }
        },
        { // Standard white tea
          conditions: { processing: ['withered', 'unrolled', 'light-oxidized'] },
          params: {
            leafAmount: '4-5g per 100ml',
            waterTemp: '75-85°C',
            steepingTime: [30, 45, 60, 75],
            vesselRecommendation: {
              preferred: ['Glass Gaiwan', 'Porcelain Gaiwan'],
              notes: 'Neutral materials preserve delicate nature while allowing visual appreciation.'
            },
            notes: 'Mix of buds and leaves allows for easier extraction than buds-only whites.',
            teas: ['White Peony', 'Gong Mei', 'New Vitality']
          }
        },
        { // Aged white tea
          conditions: { processing: ['withered', 'unrolled', 'light-oxidized', 'aged'] },
          params: {
            leafAmount: '5-6g per 100ml',
            waterTemp: '85-95°C',
            steepingTime: [20, 30, 45, 60],
            vesselRecommendation: {
              preferred: ['Porcelain Gaiwan', 'Clay Teapot'],
              notes: 'Aged whites can benefit from materials that retain heat well for later infusions.'
            },
            notes: 'Aging transforms chemistry, allowing higher temperatures and producing deeper notes.',
            teas: ['Aged Shou Mei', 'Aged Gong Mei', 'Aged White Moonlight']
          }
        },
        {
            conditions: {}, // Default rule with no specific conditions
            params: {
              leafAmount: '4-5g per 100ml',
              waterTemp: '75-85°C',
              steepingTime: [30, 45, 60, 75],
              vesselRecommendation: {
                preferred: ['Glass Gaiwan', 'Porcelain Gaiwan'],
                notes: 'Neutral materials preserve delicate nature while allowing visual appreciation.'
              },
              notes: 'Delicate leaves that benefit from careful temperature control. Earlier harvests require lower temperatures.',
              teas: ['Default White ']
            }
          }

      ],
      
      // --- GREEN TEA ---
      green: [
        { // Shade-grown steamed green
          conditions: { processing: ['shade-grown', 'steamed', 'unwithered'] },
          params: {
            leafAmount: '4-5g per 100ml',
            waterTemp: '50-60°C',
            steepingTime: [60, 90, 120, 150],
            vesselRecommendation: {
              preferred: ['Preheated Glass', 'Porcelain Gaiwan'],
              notes: 'Porcelain or preheated glass help maintain the very low temperature required.'
            },
            notes: 'Very low temperatures preserve umami and sweet characteristics from shading.',
            teas: ['Gyokuro', 'Kabusecha', 'Shade-grown Tencha']
          }
        },
        { // Pan-fired green
          conditions: { processing: ['pan-fired', 'unwithered'] },
          params: {
            leafAmount: '3-4g per 100ml',
            waterTemp: '75-85°C',
            steepingTime: [15, 25, 35, 45],
            vesselRecommendation: {
              preferred: ['Glass Gaiwan', 'Porcelain Gaiwan'],
              notes: 'Neutral brewing environment preserves the nutty, chestnut-like flavors.'
            },
            notes: 'Pan-firing develops nutty flavors that extract well at moderate temperatures.',
            teas: ['Long Jing', 'Tai Ping Hou Kui', 'Liu An Gua Pian']
          }
        },
        { // Standard steamed green
          conditions: { processing: ['steamed', 'unwithered'] },
          params: {
            leafAmount: '3-4g per 100ml',
            waterTemp: '65-75°C',
            steepingTime: [30, 45, 60, 75],
            vesselRecommendation: {
              preferred: ['Glass Gaiwan', 'Porcelain Gaiwan'],
              notes: 'Glass or porcelain help maintain temperature control for these sensitive teas.'
            },
            notes: 'Steaming preserves bright vegetable notes. More sensitive to temperature.',
            teas: ['Sencha', 'Shincha', 'Asamushi Sencha']
          }
        },
        { // Roasted green
          conditions: { processing: ['roasted', 'unwithered'] },
          params: {
            leafAmount: '3-4g per 100ml',
            waterTemp: '85-95°C',
            steepingTime: [30, 45, 60, 75],
            vesselRecommendation: {
              preferred: ['Ceramic Gaiwan', 'Clay Teapot'],
              notes: 'These materials complement the roasted character of the tea.'
            },
            notes: 'Roasting reduces astringency and creates caramelized notes that handle higher temperatures.',
            teas: ['Hojicha', 'Kyobancha', 'Aged Kukicha']
          }
        },
        {
            conditions: {}, // Default rule with no specific conditions
            params: {
              leafAmount: '3-4g per 100ml',
              waterTemp: '70-80°C',
              steepingTime: [20, 30, 40, 50],
              vesselRecommendation: {
                preferred: ['Glass Gaiwan', 'Porcelain Gaiwan'],
                notes: 'Glass or porcelain preserve the delicate character and prevent unwanted flavor influence.'
              },
              notes: 'Temperature is critical - too high will cause bitterness. Japanese greens generally need lower temperatures than Chinese.',
              teas: ['Default green tea']
            }
          }
      ],
      
      // --- YELLOW TEA ---
      yellow: [
        { // Standard yellow tea
          conditions: { processing: ['withered', 'yellowed', 'light-oxidized'] },
          params: {
            leafAmount: '3-4g per 100ml',
            waterTemp: '75-85°C',
            steepingTime: [25, 35, 45, 55],
            vesselRecommendation: {
              preferred: ['Porcelain Gaiwan', 'Glass Gaiwan'],
              notes: 'Neutral vessels help preserve the delicate nature of yellow tea.'
            },
            notes: 'Yellowing reduces astringency, allowing slightly higher temperature than comparable green tea.',
            teas: ['Junshan Yinzhen', 'Huo Mountain Yellow Buds', 'Jun Shan Silver Needle']
          }
        },
        { // Yellow tea with slight oxidation
          conditions: { processing: ['withered', 'yellowed', 'medium-oxidized'] },
          params: {
            leafAmount: '3-4g per 100ml',
            waterTemp: '75-85°C',
            steepingTime: [25, 35, 45, 55],
            vesselRecommendation: {
              preferred: ['Porcelain Gaiwan', 'Glass Gaiwan'],
              notes: 'The partial "smothering" creates mellow character requiring controlled brewing.'
            },
            notes: 'The slight oxidation creates a mellower character between green and oolong.',
            teas: ['Huoshan Huangya', 'Meng Ding Huang Ya', 'Huang Tang']
          }
        },
        { // Wok-fired yellow
          conditions: { processing: ['pan-fired', 'yellowed'] },
          params: {
            leafAmount: '3-4g per 100ml',
            waterTemp: '80-85°C',
            steepingTime: [25, 35, 45, 55],
            vesselRecommendation: {
              preferred: ['Porcelain Gaiwan', 'Glass Gaiwan'],
              notes: 'The wok-firing creates more robustness, requiring proper heat retention.'
            },
            notes: 'The wok-firing before yellowing creates more robustness than typical yellow teas.',
            teas: ['Mengding Huangya', 'Mo Gan Huang Ya', 'Wen Shan Huang Ya']
          }
        },
        {
            conditions: {}, // Default rule with no specific conditions
            params: {
              leafAmount: '3-4g per 100ml',
              waterTemp: '75-85°C',
              steepingTime: [25, 35, 45, 55],
              vesselRecommendation: {
                preferred: ['Porcelain Gaiwan', 'Glass Gaiwan'],
                notes: 'Neutral vessels help preserve the delicate nature of yellow tea.'
              },
              notes: 'Mellow character between green and oolong; careful temperature control helps highlight its unique profile.',
              teas: ['Default yellow tea']
            }
          }
      ],
      
      // --- OOLONG TEA ---
      oolong: [
        { // Light oxidation ball-rolled
          conditions: { processing: ['withered', 'light-oxidized', 'rolled'] },
          params: {
            leafAmount: '5-7g per 100ml',
            waterTemp: '85-90°C',
            steepingTime: [25, 35, 45, 55],
            vesselRecommendation: {
              preferred: ['Porcelain Gaiwan', 'Thin-walled Clay', 'Glass Gaiwan'],
              notes: 'These provide good heat management while preserving delicate floral notes.'
            },
            notes: 'Multiple rinse recommended to "wake up" the tightly rolled leaves. Unfolds gradually.',
            teas: ['Ali Shan', 'Jin Xuan', 'Li Shan High Mountain']
          }
        },
        { // Medium oxidation strip-style with roasting
          conditions: { processing: ['withered', 'medium-oxidized', 'strip-style', 'roasted'] },
          params: {
            leafAmount: '5-6g per 100ml',
            waterTemp: '90-95°C',
            steepingTime: [15, 25, 35, 45],
            vesselRecommendation: {
              preferred: ['Clay Teapot', 'Ceramic Gaiwan'],
              notes: 'Clay enhances complexity and mineral notes of these more oxidized oolongs.'
            },
            notes: 'The medium oxidation and roasting creates robustness requiring higher temperature.',
            teas: ['Wuyi Rock', 'Shui Xian', 'Rou Gui']
          }
        },
        { // Heavy roasted oolong
          conditions: { processing: ['withered', 'medium-oxidized', 'roasted'] },
          params: {
            leafAmount: '6-8g per 100ml',
            waterTemp: '95-100°C',
            steepingTime: [20, 30, 45, 60],
            vesselRecommendation: {
              preferred: ['Clay Teapot', 'Ceramic Gaiwan'],
              notes: 'Well-seasoned clay vessels complement and enhance deep, roasted characters.'
            },
            notes: 'Heavy roasting transforms chemistry, requiring full boiling water. Later infusions may need longer steep times.',
            teas: ['Traditional Tie Guan Yin', 'Aged Dong Ding', 'Heavy-Roasted Bei Dou']
          }
        },
        { // Medium oxidation aromatic (Dancong style)
          conditions: { processing: ['withered', 'medium-roast', 'strip-rolled'] },
          params: {
            leafAmount: '5-6g per 100ml',
            waterTemp: '90-95°C',
            steepingTime: [15, 20, 30, 45],
            vesselRecommendation: {
              preferred: ['Clay Teapot', 'Porcelain Gaiwan'],
              notes: 'Fragrant varieties benefit from either neutral porcelain or flavor-enhancing clay.'
            },
            notes: 'Complex aromatics require quick initial steeps at high temperature to prevent astringency.',
            teas: ['Dan Cong', 'Mi Lan Xiang', 'Ya Shi Xiang']
          }
        },
        {
            // Default rule for general oolongs
            conditions: {}, 
            params: {
              leafAmount: '5-6g per 100ml',
              waterTemp: '90-95°C',
              steepingTime: [20, 30, 40, 50],
              vesselRecommendation: {
                preferred: ['Clay Teapot', 'Porcelain Gaiwan'],
                notes: 'Clay enhances body and complexity, while porcelain offers clarity of flavor.'
              },
              notes: 'Oolongs benefit from higher leaf ratio and multiple short infusions to reveal their complex character.',
              teas: ['Default oolong tea']
            }
        }
      ],
      
      // --- BLACK TEA ---
      black: [
        { // Light oxidation orthodox
          conditions: { processing: ['withered', 'heavy-oxidized', 'orthodox', 'spring-harvest'] },
          params: {
            leafAmount: '4-5g per 100ml',
            waterTemp: '80-85°C',
            steepingTime: [15, 25, 35, 45],
            vesselRecommendation: {
              preferred: ['Porcelain Gaiwan', 'Glass Gaiwan'],
              notes: 'Neutral vessels help preserve the delicate aromatics of these teas.'
            },
            notes: 'Early spring harvest with light oxidation creates delicate character requiring lower temperature.',
            teas: ['First Flush Darjeeling', 'Nilgiri Frost Oolong', 'Himalayan First Flush']
          }
        },
        { // Full oxidation orthodox
          conditions: { processing: ['withered', 'fully-oxidized', 'orthodox'] },
          params: {
            leafAmount: '4-5g per 100ml',
            waterTemp: '90-95°C',
            steepingTime: [15, 30, 45, 60],
            vesselRecommendation: {
              preferred: ['Porcelain Gaiwan', 'Ceramic Gaiwan', 'Clay Teapot'],
              notes: 'These teas benefit from vessels that retain heat well while maintaining clarity.'
            },
            notes: 'Full oxidation allows higher temperature without extracting excessive astringency.',
            teas: ['Keemun', 'Yunnan Dian Hong', 'Jin Jun Mei']
          }
        },
        { // CTC black tea
          conditions: { processing: ['withered', 'fully-oxidized', 'CTC'] },
          params: {
            leafAmount: '3-4g per 100ml',
            waterTemp: '95-100°C',
            steepingTime: [10, 15, 25, 35],
            vesselRecommendation: {
              preferred: ['Ceramic Gaiwan', 'Clay Teapot'],
              notes: 'Robust vessels that maintain heat suit the strong character of these teas.'
            },
            notes: 'Broken leaf structure extracts very quickly, requiring shorter steeps.',
            teas: ['Assam CTC', 'Kenya CTC', 'Ceylon Dust']
          }
        },
        { // Smoked black tea
          conditions: { processing: ['withered', 'fully-oxidized', 'smoked'] },
          params: {
            leafAmount: '4-5g per 100ml',
            waterTemp: '95-100°C',
            steepingTime: [20, 30, 45, 60],
            vesselRecommendation: {
              preferred: ['Dedicated Clay Teapot', 'Ceramic Gaiwan'],
              notes: 'A dedicated vessel is recommended as it may retain smoke aroma.'
            },
            notes: 'Smoking process transforms leaf chemistry, allowing high temperature brewing.',
            teas: ['Zheng Shan Xiao Zhong', 'Tarry Lapsang Souchong', 'Russian Caravan']
          }
        },
        {
            conditions: {}, // Default rule with no specific conditions
            params: {
              leafAmount: '4-5g per 100ml',
              waterTemp: '90-95°C',
              steepingTime: [15, 30, 45, 60],
              vesselRecommendation: {
                preferred: ['Porcelain Gaiwan', 'Clay Teapot', 'Ceramic Gaiwan'],
                notes: 'These materials provide good heat retention while allowing the full character to develop.'
              },
              notes: 'Full oxidation allows higher temperature without extracting excessive astringency. Delicate first flush teas benefit from lower temperatures.',
              teas: ['Default black tea']
            }
          }
      ],
      
      // --- PUERH TEA ---
      puerh: [
        { // Young raw puerh
          conditions: { subtype: 'sheng', processing: ['sun-dried', 'compressed'] },
          params: {
            leafAmount: '5-6g per 100ml',
            waterTemp: '85-90°C',
            steepingTime: [10, 15, 20, 30],
            rinseTimes: 2,
            vesselRecommendation: {
              preferred: ['Clay Teapot', 'Porcelain Gaiwan'],
              notes: 'Clay helps tame astringency, while porcelain allows clear evaluation of character.'
            },
            notes: 'Double rinse recommended to manage strong astringency and clean leaves. Quick initial steeps.',
            teas: ['Young Raw Puerh', 'Jingmai Maocha', 'Menghai Spring Buds']
          }
        },
        { // Aged raw puerh
          conditions: { subtype: 'sheng', processing: [ 'aged', 'compressed'] },
          params: {
            leafAmount: '6-7g per 100ml',
            waterTemp: '95-100°C',
            steepingTime: [10, 15, 25, 40],
            rinseTimes: 1,
            vesselRecommendation: {
              preferred: ['Clay Teapot', 'Jianshui Clay'],
              notes: 'Well-seasoned clay enhances the aged character and smooths any remaining astringency.'
            },
            notes: 'Aging transforms astringent compounds, allowing full boiling water. Extended endurance.',
            teas: ['Aged Raw Puerh', '1990s 7542', 'Aged Yiwu', 'Aged Bulang']
          }
        },
        { // Wet-stored raw puerh
          conditions: { subtype: 'sheng', processing: ['sun-dried', 'aged', 'compressed'] },
          params: {
            leafAmount: '6-7g per 100ml',
            waterTemp: '90-95°C',
            steepingTime: [10, 15, 25, 40],
            rinseTimes: 1,
            vesselRecommendation: {
              preferred: ['Clay Teapot', 'Jianshui Clay'],
              notes: 'Clay helps balance the more pronounced earthy notes from humid storage.'
            },
            notes: 'Humid storage accelerates aging, creating earthy notes requiring slightly lower temperature.',
            teas: ['Wet-Stored Raw Puerh', 'Hong Kong Storage', 'Traditional Storage', 'Guangdong Stored']
          }
        },
        { // Ripe (shou) puerh
          conditions: { subtype: 'shou', processing: ['pile-fermented', 'compressed'] },
          params: {
            leafAmount: '6-8g per 100ml',
            waterTemp: '95-100°C',
            steepingTime: [10, 15, 25, 40],
            rinseTimes: 2,
            vesselRecommendation: {
              preferred: ['Clay Teapot', 'Jianshui Clay'],
              notes: 'Well-seasoned clay helps smooth out any remaining fermentation notes.'
            },
            notes: 'Double or triple rinse recommended to clean dust and "fishy" notes in newer productions.',
            teas: ['Ripe Puerh', 'Menghai V93', '7581 Recipe', 'Gong Ting Grade']
          }
        },
         {
            conditions: { subtype: 'sheng' }, // Sheng (Raw) Puerh
            params: {
              leafAmount: '5-6g per 100ml',
              waterTemp: '90-95°C',
              steepingTime: [10, 15, 20, 30, 45, 60],
              rinseTimes: 1,
              vesselRecommendation: {
                preferred: ['Clay Teapot', 'Porcelain Gaiwan'],
                notes: 'Clay helps tame young sheng\'s potential astringency; porcelain allows clear evaluation of character.'
              },
              notes: 'Young sheng may benefit from slightly lower temperatures (85-90°C) to manage astringency. Aged sheng can handle full boiling.',
              teas: ['Default raw (sheng) puerh tea']
            }
          },
           {
            conditions: { subtype: 'shou' },// Shou (Ripe) Puerh
            params: {
              leafAmount: '6-8g per 100ml',
              waterTemp: '95-100°C',
              steepingTime: [10, 15, 25, 40, 60, 80],
              rinseTimes: 2,
              vesselRecommendation: {
                preferred: ['Clay Teapot', 'Jianshui Clay'],
                notes: 'Well-seasoned clay helps smooth out any remaining fermentation notes.'
              },
              notes: 'Double rinse recommended to clean dust and potential "fishy" notes in newer productions. Can handle many infusions.',
              teas: ['Default ripe (shou) puerh tea']
            }
          },
        {
            // Default rule for general puerh
            conditions: {},
            params: {
              leafAmount: '5-7g per 100ml',
              waterTemp: '95-100°C',
              steepingTime: [10, 15, 25, 40, 60],
              rinseTimes: 1,
              vesselRecommendation: {
                preferred: ['Clay Teapot', 'Porcelain Gaiwan'],
                notes: 'Clay enhances depth and smoothness, while porcelain allows clear evaluation.'
              },
              notes: 'Puerh generally benefits from a rinse before brewing and can handle many infusions with gradually increasing steep times.',
              teas: ['Default puerh tea']
            }
        }

      ],
      
      // --- HEICHA (DARK TEA) ---
      dark: [
        { // Liu Bao style
          conditions: { processing: ['pile-fermented', 'compressed', 'basket-aged'] },
          params: {
            leafAmount: '5-7g per 100ml',
            waterTemp: '95-100°C',
            steepingTime: [15, 25, 40, 60],
            rinseTimes: 1,
            vesselRecommendation: {
              preferred: ['Clay Teapot', 'Ceramic Gaiwan'],
              notes: 'These materials help smooth out fermentation notes and enhance earthy depth.'
            },
            notes: 'Fermentation process creates earthy character requiring high temperature.',
            teas: ['Liu Bao', 'Guangxi Heicha', 'Three Cranes Liu Bao']
          }
        },
        { // Fu Brick style (golden flowers)
          conditions: { processing: ['pile-fermented', 'compressed', 'fungal-fermented'] },
          params: {
            leafAmount: '5-7g per 100ml',
            waterTemp: '95-100°C',
            steepingTime: [15, 25, 40, 60],
            rinseTimes: 2,
            vesselRecommendation: {
              preferred: ['Clay Teapot', 'Ceramic Gaiwan'],
              notes: 'Heat-retentive vessel helps extract the complex character from the fungal fermentation.'
            },
            notes: 'The "golden flowers" fungus contributes to unique character requiring full boiling water.',
            teas: ['Fu Zhuan', 'An Hua Fu Brick', 'Golden Flowers Brick']
          }
        },
        { // Hunan dark tea
          conditions: { processing: ['pile-fermented', 'compressed'] },
          params: {
            leafAmount: '5-7g per 100ml',
            waterTemp: '95-100°C',
            steepingTime: [15, 25, 40, 60],
            rinseTimes: 1,
            vesselRecommendation: {
              preferred: ['Clay Teapot', 'Ceramic Gaiwan'],
              notes: 'These fermented teas pair well with materials that retain heat and smooth out potentially rough edges.'
            },
            notes: 'Regional fermented dark tea with robust character requiring high temperature.',
            teas: ['Tian Jian', 'Hunan Dark Brick', 'Hei Jian']
          }
        },
        {
            conditions: {}, // Default rule with no specific conditions
            params: {
              leafAmount: '5-7g per 100ml',
              waterTemp: '95-100°C',
              steepingTime: [15, 25, 40, 60],
              rinseTimes: 1,
              vesselRecommendation: {
                preferred: ['Clay Teapot', 'Ceramic Gaiwan'],
                notes: 'These materials help smooth out fermentation notes and enhance earthy depth.'
              },
              notes: 'Fermented dark teas benefit from a rinse before brewing and handle full boiling water well.',
              teas: ['Liu Bao', 'Fu Zhuan', 'Tian Jian']
            }
          }
      ]
    },
    
    western: {
      // --- WHITE TEA ---
      white: [
        { // Buds-only white tea
          conditions: { processing: ['buds-only', 'unrolled', 'light-oxidized'] },
          params: {
            leafAmount: '5-7g per 500ml (approx. 1.5-2 caffè spoons)',
            waterTemp: '70-80°C',
            steepingTime: 4, // Minutes
            vesselRecommendation: {
              preferred: ['Glass Teapot', 'Porcelain Teapot'],
              notes: 'Light-colored, neutral vessels that allow appreciation of the beautiful white buds.'
            },
            notes: 'Use slightly higher leaf amount to compensate for the volume of buds compared to leaves.',
            teas: ['Silver Needle', 'Moonlight White', 'Yunnan Silver Needle']
          }
        },
        { // Standard white tea
          conditions: { processing: ['withered', 'unrolled', 'light-oxidized'] },
          params: {
            leafAmount: '4-6g per 500ml (approx. 1.5 caffè spoons)',
            waterTemp: '75-85°C',
            steepingTime: 3, // Minutes
            vesselRecommendation: {
              preferred: ['Glass Teapot', 'Porcelain Teapot'],
              notes: 'Neutral vessels preserve the subtle, refreshing character.'
            },
            notes: 'Mix of buds and leaves allows for easier extraction than buds-only whites.',
            teas: ['White Peony', 'Gong Mei', 'New Vitality']
          }
        },
        { // Aged white tea
          conditions: { processing: ['withered', 'unrolled', 'light-oxidized', 'aged'] },
          params: {
            leafAmount: '6-8g per 500ml (approx. 2-2.5 caffè spoons)',
            waterTemp: '85-95°C',
            steepingTime: 4, // Minutes
            vesselRecommendation: {
              preferred: ['Ceramic Teapot', 'Porcelain Teapot'],
              notes: 'Vessels with good heat retention complement the deeper character of aged whites.'
            },
            notes: 'Aging transforms white tea into a more robust brew that can handle hotter water.',
            teas: ['Aged Shou Mei', 'Aged Gong Mei', 'Aged White Moonlight']
          }
        },
        {
            conditions: {}, // Default rule with no specific conditions
            params: {
              leafAmount: '4-6g per 500ml (approx. 1.5 caffè spoons)',
              waterTemp: '75-85°C',
              steepingTime: 3, // Minutes
              vesselRecommendation: {
                preferred: ['Glass Teapot', 'Porcelain Teapot'],
                notes: 'Neutral vessels preserve the subtle character of white tea.'
              },
              notes: 'Delicate white teas steep well for longer times in western brewing. Can be infused multiple times with increasing steep times.',
              teas: ['White Peony', 'Silver Needle', 'Shou Mei']
            }
          }
      ],
      
      // --- GREEN TEA ---
      green: [
        { // Shade-grown steamed green
          conditions: { processing: ['shade-grown', 'steamed', 'unwithered'] },
          params: {
            leafAmount: '5-7g per 500ml (approx. 1.5-2 caffè spoons)',
            waterTemp: '50-60°C',
            steepingTime: 2.5, // Minutes
            vesselRecommendation: {
              preferred: ['Glass Teapot', 'Porcelain Teapot'],
              notes: 'Temperature control is critical; these materials help maintain the very low temperature required.'
            },
            notes: 'Use very cool water to extract sweet, umami flavors. Higher leaf ratio compensates for lower temperature.',
            teas: ['Gyokuro', 'Kabusecha', 'Shade-grown Tencha']
          }
        },
        { // Pan-fired green
          conditions: { processing: ['pan-fired', 'unwithered'] },
          params: {
            leafAmount: '4-6g per 500ml (approx. 1.5 caffè spoons)',
            waterTemp: '75-85°C',
            steepingTime: 2, // Minutes
            vesselRecommendation: {
              preferred: ['Glass Teapot', 'Porcelain Teapot'],
              notes: 'Glass or porcelain provide a neutral environment that preserves the nutty flavors.'
            },
            notes: 'Pan-firing develops nutty, chestnut-like flavors. Avoid over-steeping to prevent bitterness.',
            teas: ['Long Jing', 'Tai Ping Hou Kui', 'Liu An Gua Pian']
          }
        },
        { // Standard steamed green
          conditions: { processing: ['steamed', 'unwithered'] },
          params: {
            leafAmount: '4-5g per 500ml (approx. 1.5 caffè spoons)',
            waterTemp: '65-75°C',
            steepingTime: 1.5, // Minutes
            vesselRecommendation: {
              preferred: ['Glass Teapot', 'Porcelain Teapot'],
              notes: 'Glass or porcelain help maintain temperature control for these sensitive teas.'
            },
            notes: 'Steaming preserves bright vegetable notes. Very sensitive to temperature; watch steeping time carefully.',
            teas: ['Sencha', 'Shincha', 'Asamushi Sencha']
          }
        },
        { // Roasted green
          conditions: { processing: ['roasted', 'unwithered'] },
          params: {
            leafAmount: '5-7g per 500ml (approx. 1.5-2 caffè spoons)',
            waterTemp: '85-95°C',
            steepingTime: 2.5, // Minutes
            vesselRecommendation: {
              preferred: ['Ceramic Teapot', 'Cast Iron Teapot'],
              notes: 'These materials complement the roasted character of the tea.'
            },
            notes: 'Roasting reduces caffeine and produces nutty, caramel notes. Can handle near-boiling temperatures.',
            teas: ['Hojicha', 'Kyobancha', 'Aged Kukicha']
          }
        },
        {
            conditions: {}, // Default rule with no specific conditions
            params: {
              leafAmount: '4-5g per 500ml (approx. 1.5 caffè spoons)',
              waterTemp: '70-80°C',
              steepingTime: 2, // Minutes
              vesselRecommendation: {
                preferred: ['Glass Teapot', 'Porcelain Teapot'],
                notes: 'Glass or porcelain provide a neutral environment and help maintain appropriate temperature.'
              },
              notes: 'Watch time carefully to avoid bitterness. Japanese greens generally need lower temperatures (65-75°C) than Chinese varieties.',
              teas: ['Long Jing', 'Sencha', 'Bi Luo Chun']
            }
          }
      ],
      
      // --- YELLOW TEA ---
      yellow: [
        { // Standard yellow tea
          conditions: { processing: ['withered', 'yellowed', 'light-oxidized'] },
          params: {
            leafAmount: '4-6g per 500ml (approx. 1.5 caffè spoons)',
            waterTemp: '75-85°C',
            steepingTime: 2.5, // Minutes
            vesselRecommendation: {
              preferred: ['Glass Teapot', 'Porcelain Teapot'],
              notes: 'Neutral vessels that preserve the unique mellow character of yellow tea.'
            },
            notes: 'Mellow character between green and oolong; careful temperature control helps highlight its unique profile.',
            teas: ['Junshan Yinzhen', 'Huo Mountain Yellow Buds', 'Jun Shan Silver Needle']
          }
        },
        {
            conditions: {}, // Default rule with no specific conditions
            params: {
              leafAmount: '4-6g per 500ml (approx. 1.5 caffè spoons)',
              waterTemp: '75-85°C',
              steepingTime: 2.5, // Minutes
              vesselRecommendation: {
                preferred: ['Glass Teapot', 'Porcelain Teapot'],
                notes: 'Neutral vessels that preserve the unique mellow character of yellow tea.'
              },
              notes: 'Mellow character between green and oolong with a unique sweet aftertaste requiring careful temperature control.',
              teas: ['Junshan Yinzhen', 'Huoshan Huangya', 'Meng Ding Huang Ya']
            }
          }
      ],
      
      // --- OOLONG TEA ---
      oolong: [
        { // Light oxidation ball-rolled
          conditions: { processing: ['withered', 'light-oxidized', 'ball-rolled'] },
          params: {
            leafAmount: '5-7g per 500ml (approx. 1.5-2 caffè spoons)',
            waterTemp: '85-90°C',
            steepingTime: 3, // Minutes
            vesselRecommendation: {
              preferred: ['Glass Teapot', 'Porcelain Teapot'],
              notes: 'Neutral vessels that preserve the delicate floral notes of light oolongs.'
            },
            notes: 'Leaves unfurl gradually. Can be steeped multiple times with increasing steep times.',
            teas: ['Ali Shan', 'Jin Xuan', 'Li Shan High Mountain']
          }
        },
        { // Medium oxidation strip-style
          conditions: { processing: ['withered', 'medium-oxidized', 'strip-style'] },
          params: {
            leafAmount: '5-7g per 500ml (approx. 1.5-2 caffè spoons)',
            waterTemp: '90-95°C',
            steepingTime: 2.5, // Minutes
            vesselRecommendation: {
              preferred: ['Ceramic Teapot', 'Porcelain Teapot'],
              notes: 'These materials provide good heat retention while allowing complex flavors to develop.'
            },
            notes: 'Can handle higher temperatures due to medium oxidation. Watch steeping time to prevent bitterness.',
            teas: ['Wuyi Rock', 'Shui Xian', 'Rou Gui']
          }
        },
        { // Heavy roasted oolong
          conditions: { processing: ['withered', 'medium-oxidized', 'roasted'] },
          params: {
            leafAmount: '7-9g per 500ml (approx. 2.5-3 caffè spoons)',
            waterTemp: '95-100°C',
            steepingTime: 4, // Minutes
            vesselRecommendation: {
              preferred: ['Ceramic Teapot', 'Clay Teapot', 'Cast Iron Teapot'],
              notes: 'Heat-retentive vessels complement and enhance the deep, roasted characters.'
            },
            notes: 'Roasting transforms flavor profile, allowing for highest temperatures and longer steeping times.',
            teas: ['Traditional Tie Guan Yin', 'Aged Dong Ding', 'Heavy-Roasted Bei Dou']
          }
        },
        { // Medium oxidation aromatic (Dancong style)
          conditions: { processing: ['withered', 'medium-oxidized', 'strip-style'] },
          params: {
            leafAmount: '5-7g per 500ml (approx. 1.5-2 caffè spoons)',
            waterTemp: '90-95°C',
            steepingTime: 3, // Minutes
            vesselRecommendation: {
              preferred: ['Ceramic Teapot', 'Porcelain Teapot'],
              notes: 'Neutral vessels help preserve the complex, often fruity or floral aromatics.'
            },
            notes: 'Highly aromatic character. Needs exact timing to prevent bitterness while extracting complex notes.',
            teas: ['Dan Cong', 'Mi Lan Xiang', 'Ya Shi Xiang']
          }
        },
        {
            // Default rule for general oolongs
            conditions: {}, 
            params: {
              leafAmount: '5-7g per 500ml (approx. 1.5-2 caffè spoons)',
              waterTemp: '90-95°C',
              steepingTime: 3, // Minutes
              vesselRecommendation: {
                preferred: ['Ceramic Teapot', 'Porcelain Teapot'],
                notes: 'These materials provide good heat retention while allowing the full character to develop.'
              },
              notes: 'Oolongs can be steeped multiple times even in western style, adding 1-2 minutes for subsequent infusions.',
              teas: ['Dan Cong', 'Mi Lan Xiang', 'Ya Shi Xiang']
            }
        }
      ],
      
      // --- BLACK TEA ---
      black: [
        { // Light oxidation orthodox
          conditions: { processing: ['withered', 'heavy-oxidized', 'orthodox', 'spring-harvest'] },
          params: {
            leafAmount: '4-6g per 500ml (approx. 1.5-2 caffè spoons)',
            waterTemp: '80-85°C',
            steepingTime: 3, // Minutes
            vesselRecommendation: {
              preferred: ['Porcelain Teapot', 'Glass Teapot'],
              notes: 'Neutral vessels help preserve the delicate aromatics of these teas.'
            },
            notes: 'Early spring harvest with light oxidation creates delicate character requiring lower temperature.',
            teas: ['First Flush Darjeeling', 'Nilgiri Frost Oolong', 'Himalayan First Flush']
          }
        },
        { // Full oxidation orthodox
          conditions: { processing: ['withered', 'fully-oxidized', 'orthodox'] },
          params: {
            leafAmount: '4-6g per 500ml (approx. 1.5-2 caffè spoons)',
            waterTemp: '90-95°C',
            steepingTime: 3, // Minutes
            vesselRecommendation: {
              preferred: ['Ceramic Teapot', 'Porcelain Teapot'],
              notes: 'These materials provide appropriate heat retention for full-bodied extract.'
            },
            notes: 'Full oxidation allows higher temperature without extracting excessive astringency.',
            teas: ['Keemun', 'Yunnan Dian Hong', 'Jin Jun Mei']
          }
        },
        { // CTC black tea
          conditions: { processing: ['withered', 'fully-oxidized', 'CTC'] },
          params: {
            leafAmount: '3-5g per 500ml (approx. 1-1.5 caffè spoons)',
            waterTemp: '95-100°C',
            steepingTime: 2, // Minutes
            vesselRecommendation: {
              preferred: ['Ceramic Teapot', 'Cast Iron Teapot'],
              notes: 'Robust vessels that maintain heat suit the strong character of these teas.'
            },
            notes: 'Broken leaf structure extracts very quickly. Ideal for milk tea due to robust flavor.',
            teas: ['Assam CTC', 'Kenya CTC', 'Ceylon Dust']
          }
        },
        { // Smoked black tea
          conditions: { processing: ['withered', 'fully-oxidized', 'smoked'] },
          params: {
            leafAmount: '4-6g per 500ml (approx. 1.5-2 caffè spoons)',
            waterTemp: '95-100°C',
            steepingTime: 3.5, // Minutes
            vesselRecommendation: {
              preferred: ['Ceramic Teapot', 'Dedicated Teapot'],
              notes: 'A dedicated vessel is recommended as it may retain smoke aroma.'
            },
            notes: 'Smoking process creates unique flavor resistant to overbrewing. Traditional varieties less smoky than export versions.',
            teas: ['Zheng Shan Xiao Zhong', 'Tarry Lapsang Souchong', 'Russian Caravan']
          }
        },
        {
            conditions: {}, // Default rule with no specific conditions
            params: {
              leafAmount: '4-6g per 500ml (approx. 1.5-2 caffè spoons)',
              waterTemp: '90-95°C',
              steepingTime: 3, // Minutes
              vesselRecommendation: {
                preferred: ['Ceramic Teapot', 'Porcelain Teapot'],
                notes: 'These materials provide good heat retention for proper extraction.'
              },
              notes: 'Full-bodied black teas extract well in western brewing. First flush or delicate varieties benefit from slightly lower temperatures (85°C).',
              teas: ['Keemun', 'Dian Hong', 'Assam', 'Darjeeling']
            }
          }
      ],
      
      // --- PUERH TEA ---
      puerh: [
        { // Young raw puerh
          conditions: { subtype: 'sheng', processing: ['sun-dried', 'young', 'compressed'] },
          params: {
            leafAmount: '6-8g per 500ml (approx. 2-2.5 caffè spoons)',
            waterTemp: '85-90°C',
            steepingTime: 3, // Minutes
            rinseTimes: 1,
            vesselRecommendation: {
              preferred: ['Clay Teapot', 'Ceramic Teapot'],
              notes: 'These materials help tame the potent astringency of young sheng.'
            },
            notes: 'Rinse first to clean and open up compressed material. Use slightly lower temperature to manage astringency.',
            teas: ['Young Raw Puerh', 'Jingmai Maocha', 'Menghai Spring Buds']
          }
        },
        { // Aged raw puerh
          conditions: { subtype: 'sheng', processing: ['sun-dried', 'aged', 'compressed'] },
          params: {
            leafAmount: '7-9g per 500ml (approx. 2.5-3 caffè spoons)',
            waterTemp: '95-100°C',
            steepingTime: 3.5, // Minutes
            rinseTimes: 1,
            vesselRecommendation: {
              preferred: ['Clay Teapot', 'Ceramic Teapot', 'Cast Iron Teapot'],
              notes: 'Heat-retentive vessels enhance the aged character and smooth any remaining astringency.'
            },
            notes: 'Rinse briefly before brewing. Aging mellows astringency, allowing higher temperatures. Can handle multiple infusions.',
            teas: ['Aged Raw Puerh', '1990s 7542', 'Aged Yiwu', 'Aged Bulang']
          }
        },
        { // Wet-stored raw puerh
          conditions: { subtype: 'sheng', processing: ['sun-dried', 'aged', 'compressed'] },
          params: {
            leafAmount: '7-9g per 500ml (approx. 2.5-3 caffè spoons)',
            waterTemp: '90-95°C',
            steepingTime: 3, // Minutes
            rinseTimes: 1,
            vesselRecommendation: {
              preferred: ['Clay Teapot', 'Ceramic Teapot'],
              notes: 'Clay helps balance the more pronounced earthy notes from humid storage.'
            },
            notes: 'Humid storage accelerates aging, creating earthy notes. Rinse once to clean and open up the leaves.',
            teas: ['Wet-Stored Raw Puerh', 'Hong Kong Storage', 'Traditional Storage', 'Guangdong Stored']
          }
        },
        { // Ripe (shou) puerh
          conditions: { subtype: 'shou', processing: ['pile-fermented', 'compressed'] },
          params: {
            leafAmount: '7-9g per 500ml (approx. 2.5-3 caffè spoons)',
            waterTemp: '95-100°C',
            steepingTime: 4, // Minutes
            rinseTimes: 2,
            vesselRecommendation: {
              preferred: ['Clay Teapot', 'Ceramic Teapot', 'Cast Iron Teapot'],
              notes: 'These materials help smooth out any remaining fermentation notes and enhance earthy depth.'
            },
            notes: 'Rinse once or twice before brewing, especially for recently produced shou. Can handle multiple infusions.',
            teas: ['Ripe Puerh', 'Menghai V93', '7581 Recipe', 'Gong Ting Grade']
          }
        },
        {
            conditions: { subtype: 'sheng' },  // Sheng (Raw) Puerh
            params: {
              leafAmount: '6-8g per 500ml (approx. 2-2.5 caffè spoons)',
              waterTemp: '90-95°C',
              steepingTime: 3, // Minutes
              rinseTimes: 1,
              vesselRecommendation: {
                preferred: ['Clay Teapot', 'Ceramic Teapot'],
                notes: 'These materials help tame the potential astringency of sheng puerh.'
              },
              notes: 'Young sheng may benefit from slightly lower temperatures (85-90°C) to manage astringency. Aged sheng can handle full boiling.',
              teas: ['Young and aged raw puerh cakes', 'sheng maocha']
            }
          },
          {
            conditions: { subtype: 'shou' }, // Shou (Ripe) Puerh
            params: {
              leafAmount: '7-9g per 500ml (approx. 2.5-3 caffè spoons)',
              waterTemp: '95-100°C',
              steepingTime: 4, // Minutes
              rinseTimes: 1,
              vesselRecommendation: {
                preferred: ['Clay Teapot', 'Ceramic Teapot', 'Cast Iron Teapot'],
                notes: 'These materials help smooth out any remaining fermentation notes and enhance earthy depth.'
              },
              notes: 'Rinse before brewing to clean dust and open up compressed material. Can handle multiple infusions with increasing steep times.',
              teas: ['Ripe puerh cakes', 'loose shou', 'gong ting grade']
            }
          },
        {
            // Default rule for general puerh
            conditions: {},
            params: {
              leafAmount: '6-8g per 500ml (approx. 2-2.5 caffè spoons)',
              waterTemp: '95-100°C',
              steepingTime: 3.5, // Minutes
              rinseTimes: 1,
              vesselRecommendation: {
                preferred: ['Clay Teapot', 'Ceramic Teapot', 'Cast Iron Teapot'],
                notes: 'Heat-retentive vessels enhance depth and complexity.'
              },
              notes: 'Rinse before brewing. Can be steeped multiple times, adding 1-2 minutes for subsequent infusions.',
              teas: ['Young and aged raw puerh cakes', 'sheng maocha']
            }
        }
      ],
      
      // --- HEICHA (DARK TEA) ---
      dark: [
        { // Liu Bao style
          conditions: { processing: ['pile-fermented', 'compressed', 'basket-aged'] },
          params: {
            leafAmount: '6-8g per 500ml (approx. 2-2.5 caffè spoons)',
            waterTemp: '95-100°C',
            steepingTime: 3.5, // Minutes
            rinseTimes: 1,
            vesselRecommendation: {
              preferred: ['Clay Teapot', 'Ceramic Teapot'],
              notes: 'These materials help smooth out fermentation notes and enhance earthy depth.'
            },
            notes: 'Rinse briefly before brewing. Fermentation creates earthy character requiring high temperature.',
            teas: ['Liu Bao', 'Guangxi Heicha', 'Three Cranes Liu Bao']
          }
        },
        { // Fu Brick style (golden flowers)
          conditions: { processing: ['pile-fermented', 'compressed', 'fungal-fermented'] },
          params: {
            leafAmount: '6-8g per 500ml (approx. 2-2.5 caffè spoons)',
            waterTemp: '95-100°C',
            steepingTime: 4, // Minutes
            rinseTimes: 1,
            vesselRecommendation: {
              preferred: ['Clay Teapot', 'Ceramic Teapot'],
              notes: 'Heat-retentive vessel helps extract the complex character from the fungal fermentation.'
            },
            notes: 'The "golden flowers" fungus contributes to unique character requiring full boiling water. Rinse once before brewing.',
            teas: ['Fu Zhuan', 'An Hua Fu Brick', 'Golden Flowers Brick']
          }
        },
        { // Hunan dark tea
          conditions: { processing: ['pile-fermented', 'compressed'] },
          params: {
            leafAmount: '6-8g per 500ml (approx. 2-2.5 caffè spoons)',
            waterTemp: '95-100°C',
            steepingTime: 3.5, // Minutes
            rinseTimes: 1,
            vesselRecommendation: {
              preferred: ['Clay Teapot', 'Ceramic Teapot', 'Cast Iron Teapot'],
              notes: 'Heat-retentive materials complement these aged, fermented teas.'
            },
            notes: 'Rinse briefly before brewing. Regional dark teas have characteristics similar to puerh but with distinctive processing methods.',
            teas: ['Tian Jian', 'Hunan Dark Brick', 'Hei Jian']
          }
        },
        {
            conditions: {}, // Default rule with no specific conditions
            params: {
              leafAmount: '6-8g per 500ml (approx. 2-2.5 caffè spoons)',
              waterTemp: '95-100°C',
              steepingTime: 3.5, // Minutes
              rinseTimes: 1,
              vesselRecommendation: {
                preferred: ['Clay Teapot', 'Ceramic Teapot', 'Cast Iron Teapot'],
                notes: 'Heat-retentive materials complement these aged, fermented teas.'
              },
              notes: 'Rinse briefly before brewing. Regional dark teas have characteristics similar to puerh but with distinctive processing methods.',
              teas: ['Liu Bao', 'Fu Zhuan', 'Tian Jian', 'Hua Zhuan', 'Qian Liang', 'An Hua Hei Cha', 'Tibetan Brick Tea', 'Sichuan Border Tea']
            }
          }
      ]
    },
    
    // --- VESSEL MATERIALS ---
    vesselMaterials: {
      porcelainGaiwan: {
        properties: 'Non-porous, neutral, moderate heat retention',
        effect: 'No influence on flavor, preserves tea\'s natural character',
        bestFor: ['All tea types', 'especially delicate whites and greens'],
        notes: 'Versatile, easy to clean, ideal for sampling and comparing teas'
      },
      glassGaiwan: {
        properties: 'Non-porous, cools quickly, transparent',
        effect: 'No influence on flavor, allows visual appreciation',
        bestFor: ['White', 'Green', 'Yellow', 'Flowering teas'],
        notes: 'Provides visual enjoyment of the brewing process; doesn\'t retain heat as well'
      },
      clayTeapot: {
        properties: 'Porous, absorbs tea oils over time, excellent heat retention',
        effect: 'Rounds off sharp edges, enhances body, develops seasoning over time',
        bestFor: ['Oolong', 'Puerh', 'Black teas', 'Aged White'],
        notes: 'Traditional for gong fu brewing; dedicated use for single tea type recommended'
      },
      ceramicGaiwan: {
        properties: 'Semi-porous (if unglazed), good heat retention',
        effect: 'Minimal influence on flavor unless unglazed',
        bestFor: ['Most tea types', 'versatile'],
        notes: 'Provides good balance of heat retention and neutrality'
      },
      castIronTeapot: {
        properties: 'Exceptional heat retention, heavy',
        effect: 'Maintains consistent brewing temperature',
        bestFor: ['Black teas', 'darker oolongs', 'puerh'],
        notes: 'Excellent for maintaining temperature throughout longer western-style brewing'
      },
      silverGaiwan: {
        properties: 'Excellent heat conductor, cools quickly',
        effect: 'May have antibacterial properties, preserves clear flavor',
        bestFor: ['High-quality green and white teas'],
        notes: 'Traditional in some Chinese brewing for its purity and cooling properties'
      }
    },
    
   
    
    // --- MEASUREMENT CONVERSIONS ---
    measurements: {
      caffeSpoonEquivalent: '1 heaping caffè spoon ≈ 3g of tea leaves',
      teaspoonEquivalent: '1 teaspoon ≈ 2-3g depending on tea type',
      tableSpoonEquivalent: '1 tablespoon ≈ 5-7g depending on tea type',
      volumeVariations: {
        bulky: {
          teas: ['Silver Needle', 'White Peony', 'Unrolled Green Teas'],
          note: 'Bulky teas appear larger for their weight, use weight measurement when possible'
        },
        dense: {
          teas: ['Rolled Oolongs', 'Compressed Puerh'],
          note: 'Dense teas appear smaller for their weight, use weight measurement when possible'
        }
      }
    }
  };
  
  export default brewingRecommendations;