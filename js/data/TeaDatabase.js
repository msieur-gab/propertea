// TeaDatabase.js
// A focused set of reference teas for calibrating the tea effect system
// Updated with enhanced geographical data

export const teaDatabase = [
    // HIGH L-THEANINE TO CAFFEINE RATIO (2.0)
    {
        name: "Gyokuro",
        originalName: "玉露 (Gyokuro)",
        type: "green",
        subType: "gyokuro",
        origin: "Uji, Kyoto Prefecture, Japan",
        caffeineLevel: 4.5,
        lTheanineLevel: 9,
        flavorProfile: ["umami", "marine", "sweet", "grass", "seaweed"],
        processingMethods: ["shade-grown", "steamed", "rolled", "dried"],
        geography: {
            location: "Uji",
            province: "Kyoto Prefecture",
            country: "Japan",
            latitude: 34.88,  // Uji coordinates
            longitude: 135.80,
            altitude: 200,    // Uji region average
            humidity: 75,     // High humidity region
            temperature: 15.5, // Average temperature in Uji
            solarRadiation: 165 // Moderate solar radiation
            // harvestMonth: 4   // April harvest
        }
       
    },
    
    // MODERATE L-THEANINE TO CAFFEINE RATIO (1.5)
    {
        name: "Sencha",
        originalName: "煎茶 (Sencha)",
        type: "green",
        origin: "Shizuoka Prefecture, Japan",
        caffeineLevel: 4,
        lTheanineLevel: 6,
        flavorProfile: ["grassy", "marine", "vegetal", "fresh", "slightly sweet"],
        processingMethods: ["steamed", "rolled", "dried"],
        geography: {
            altitude: 400,    // Shizuoka mountain regions
            humidity: 72,     // Moderate-high humidity
            latitude: 34.97,  // Shizuoka coordinates
            longitude: 138.38,
            // harvestMonth: 5,   // May harvest (spring)
            temperature: 16.2, // Average temperature in Shizuoka
            solarRadiation: 170 // Moderate solar radiation
        },
        expectedEffects: {
            dominant: "energizing",
            supporting: "focusing"
        }
    },
    
    // BALANCED RATIO (1.0) WITH HEAVY ROAST
    {
        name: "Da Hong Pao",
        originalName: "大红袍 (Dà Hóng Páo)",
        type: "oolong",
        origin: "Wuyi Mountains, Fujian, China",
        caffeineLevel: 4.5,
        lTheanineLevel: 4.5,
        flavorProfile: ["roasted", "mineral", "dark fruits", "woody", "caramel"],
        processingMethods: ["withered", "partial-oxidation", "rolled", "heavy-roast"],
        geography: {
            altitude: 600,    // Wuyi Mountain average
            humidity: 80,     // High humidity
            latitude: 27.72,  // Wuyi coordinates
            longitude: 117.67,
            // harvestMonth: 5,   // Late spring harvest
            temperature: 19.5, // Average temperature in Wuyi
            solarRadiation: 175 // Moderate solar radiation
        },
        expectedEffects: {
            dominant: "comforting",
            supporting: "grounding"
        }
    },
    {
        "id": "1745320899053",
        "name": "ervin",
        "originalName": "ertewrt",
        "type": "oolong",
        "subType": "",
        "caffeineLevel": 3,
        "lTheanineLevel": 7,
        "flavorProfile": [
          "osmanthus",
          "honey",
          "mineral",
          "roasted",
          "woody"
        ],
        "processingMethods": [
          "rolled",
          "rock-fired",
          "medium-roast",
          "partial-oxidation"
        ],
        "geography": {
          "location": "Munich, Upper Bavaria",
          "province": "Bavaria",
          "country": "Germany",
          "latitude": 48.13743,
          "longitude": 11.57549,
          "altitude": 524,
          "humidity": 70.3,
          "temperature": 6.4,
          "solarRadiation": 130.6
        },
        "dateAdded": "2025-04-22T11:21:39.054Z"
      },

    {
        name: "Ali Shan Oolong",
        originalName: "阿里山烏龍 (Ālǐshān Wūlóng)",
        type: "oolong",
        origin: "Ali Mountain, Taiwan",
        caffeineLevel: 3.5,
        lTheanineLevel: 6.5,
        flavorProfile: ["floral", "buttery", "sweet", "creamy", "honeysuckle"],
        processingMethods: ["withered", "partial-oxidation", "ball-rolled", "minimal-roast"],
        geography: {
            altitude: 1500,   // Ali Mountain high elevation
            humidity: 80,     // High humidity
            latitude: 23.47,  // Ali Mountain coordinates
            longitude: 120.80,
            // harvestMonth: 4,   // Spring harvest
            temperature: 14.8, // Average temperature in Ali Mountain
            solarRadiation: 180 // Moderate-high solar radiation
        },
        expectedEffects: {
            dominant: "elevating",
            supporting: "calming"
        }
    },
    
    // LOW RATIO (0.54) WITH FULL OXIDATION
    {
        name: "Assam",
        originalName: "Assam Orthodox",
        type: "black",
        origin: "Assam Valley, India",
        caffeineLevel: 6.5,
        lTheanineLevel: 3.5,
        flavorProfile: ["malty", "brisk", "robust", "caramel", "honey"],
        processingMethods: ["withered", "rolled", "full-oxidation", "dried"],
        geography: {
            altitude: 100,    // Assam Valley lowlands
            humidity: 85,     // Very humid
            latitude: 26.74,  // Assam coordinates
            longitude: 94.21,
            // harvestMonth: 6,   // Summer harvest (second flush)
            temperature: 24.5, // Average temperature in Assam
            solarRadiation: 195 // Moderate-high solar radiation
        },
        expectedEffects: {
            dominant: "energizing",
            supporting: "focusing"
        }
    },
    
    // VERY HIGH RATIO (2.8) WITH MINIMAL PROCESSING
    {
        name: "Silver Needle",
        originalName: "白毫银针 (Bái Háo Yín Zhēn)",
        type: "white",
        origin: "Fuding, Fujian Province, China",
        caffeineLevel: 2.5,
        lTheanineLevel: 7,
        flavorProfile: ["honey", "melon", "hay", "delicate", "cucumber"],
        processingMethods: ["withered", "sun-dried", "minimal-processing"],
        geography: {
            altitude: 800,    // Fuding average
            humidity: 78,     // Subtropical climate
            latitude: 27.33,  // Fuding coordinates
            longitude: 120.20,
            // harvestMonth: 3,   // Early spring harvest
            temperature: 18.6, // Average temperature in Fuding
            solarRadiation: 177 // Moderate solar radiation
        },
        expectedEffects: {
            dominant: "calming",
            supporting: "restorative"
        }
    },
    
    // BALANCED RATIO (1.0) WITH COMPLEX PROCESSING
    {
        name: "Aged Ripe Puerh",
        originalName: "熟普洱 (Shú Pǔ'ěr)",
        type: "puerh-shou",
        origin: "Menghai, Yunnan, China",
        caffeineLevel: 4.5,
        lTheanineLevel: 4.5,
        flavorProfile: ["earthy", "woody", "sweet", "leather", "compost"],
        processingMethods: ["withered", "pile-fermented", "compressed", "aged"],
        geography: {
            altitude: 1300,   // Menghai average
            humidity: 75,     // Tropical climate
            latitude: 21.98,  // Menghai coordinates
            longitude: 100.45,
            // harvestMonth: 4,   // Spring harvest
            temperature: 21.2, // Average temperature in Menghai
            solarRadiation: 190 // Moderate-high solar radiation
        },
        expectedEffects: {
            dominant: "grounding",
            supporting: "comforting"
        }
    },
    
    // FLORAL OOLONG
    {
        name: "Mi Lan Xiang Dan Cong",
        originalName: "蜜兰香单枞 (Mì Lán Xiāng Dān Cōng)",
        type: "oolong",
        origin: "Phoenix Mountain, Guangdong, China",
        caffeineLevel: 5.0,
        lTheanineLevel: 4.2,
        flavorProfile: ["honey", "orchid", "fruity", "floral", "roasted", "tropical"],
        processingMethods: ["withered", "partial-oxidation", "medium-roast", "strip-rolled"],
        geography: {
            altitude: 1200,   // Phoenix Mountain
            humidity: 78,     // Subtropical humidity
            latitude: 23.73,  // Phoenix Mountain coordinates
            longitude: 113.23,
            // harvestMonth: 4,   // Spring harvest
            temperature: 20.8, // Average temperature in Phoenix Mountain
            solarRadiation: 185 // Moderate-high solar radiation
        },
        expectedEffects: {
            dominant: "elevating",
            supporting: "energizing"
        }
    },
    
    // MATCHA
    {
        name: "Ceremonial Matcha",
        originalName: "抹茶 (Matcha)",
        type: "green",
        origin: "Uji, Kyoto Prefecture, Japan",
        caffeineLevel: 5.5,
        lTheanineLevel: 8.5,
        flavorProfile: ["umami", "sweet", "grassy", "creamy", "vegetal"],
        processingMethods: ["shade-grown", "steamed", "stone-ground", "dried"],
        geography: {
            altitude: 250,    // Uji region
            humidity: 70,     // Moderate-high humidity
            latitude: 34.88,  // Uji coordinates
            longitude: 135.80,
            // harvestMonth: 5,   // Spring harvest
            temperature: 15.8, // Average temperature in Uji
            solarRadiation: 160 // Moderate solar radiation
        },
        expectedEffects: {
            dominant: "focusing",
            supporting: "energizing"
        }
    },
    
    // RAW PUERH
    {
        name: "Young Sheng Puerh",
        originalName: "生普洱 (Shēng Pǔ'ěr)",
        type: "puerh-sheng",
        origin: "Xishuangbanna, Yunnan, China",
        caffeineLevel: 5.5,
        lTheanineLevel: 4.0,
        flavorProfile: ["bitter", "floral", "fruity", "vegetal", "mineral"],
        processingMethods: ["withered", "pan-fired", "sun-dried", "compressed"],
        geography: {
            altitude: 1700,   // Xishuangbanna mountains
            humidity: 73,     // Moderate-high humidity
            latitude: 22.01,  // Xishuangbanna coordinates
            longitude: 100.79,
            // harvestMonth: 3,   // Early spring harvest
            temperature: 19.5, // Average temperature in Xishuangbanna
            solarRadiation: 195 // Moderate-high solar radiation
        },
        expectedEffects: {
            dominant: "energizing",
            supporting: "focusing"
        }
    }
];

// Helper functions for accessing the database
export const TeaDatabase = {
    /**
     * Get all teas in the database
     * @returns {Array} All tea objects
     */
    getAllTeas() {
        return [...teaDatabase];
    },
    
    /**
     * Find a tea by name
     * @param {string} name - The name to search for
     * @returns {Object|null} The tea object or null if not found
     */
    findByName(name) {
        if (!name) return null;
        
        const normalizedName = name.toLowerCase().trim();
        return teaDatabase.find(tea => 
            tea.name.toLowerCase().includes(normalizedName) ||
            (tea.originalName && tea.originalName.toLowerCase().includes(normalizedName))
        ) || null;
    },
    
    /**
     * Get teas by type
     * @param {string} type - The tea type to filter by
     * @returns {Array} Tea objects of the specified type
     */
    getByType(type) {
        if (!type) return [];
        
        const normalizedType = type.toLowerCase().trim();
        return teaDatabase.filter(tea => tea.type.toLowerCase() === normalizedType);
    },
    
    /**
     * Get teas by origin country or region
     * @param {string} origin - The origin to search for
     * @returns {Array} Matching tea objects
     */
    getByOrigin(origin) {
        if (!origin) return [];
        
        const normalizedOrigin = origin.toLowerCase().trim();
        return teaDatabase.filter(tea => 
            tea.origin.toLowerCase().includes(normalizedOrigin)
        );
    }
};

export default TeaDatabase;