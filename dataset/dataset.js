/**
 * Comprehensive Asian Tea Dataset
 * Collection of different tea types with their processing methods and flavor profiles
 * This file serves as a centralized loader for all tea datasets
 */

// Function to load a script with error handling
function loadTeaDataset(src, callback) {
    const script = document.createElement('script');
    
    // Make sure we use the absolute path to the file
    const basePath = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);
    script.src = basePath + src;
    
    script.onload = function() {
        console.log(`Loaded tea dataset: ${src}`);
        if (callback) callback(null, src);
    };
    
    script.onerror = function() {
        const error = new Error(`Failed to load tea dataset: ${src}`);
        console.error(error);
        if (callback) callback(error, src);
    };
    
    document.head.appendChild(script);
}

// Tea files to load
const teaFiles = [
    'green_teas_asia.js',
    'white_teas_asia.js', 
    'oolong_teas_asia.js',
    'black_teas_asia.js',
    'yellow_teas_asia.js',
    'dark_teas_asia.js'
];

// Fallback data in case loading fails
// Green Teas
var asianGreenTeas = [
    {
        teaName: "Dragon Well (Longjing)",
        originalName: "龙井",
        region: "Hangzhou, China",
        processingMethods: ["pan-fired", "hand-pressed", "withered"],
        flavors: ["vegetal", "chestnut", "sweet", "grassy"],
        description: "Premier Chinese green tea known for its flat, sword-shaped leaves and sweet, nutty flavor (ISO: 'pan-fired premium green tea')."
    },
    {
        teaName: "Gyokuro",
        originalName: "玉露",
        region: "Japan",
        processingMethods: ["shaded", "steamed", "rolled"],
        flavors: ["umami", "marine", "sweet", "grassy"],
        description: "Premium Japanese green tea grown in the shade for weeks before harvesting (ISO: 'shade-grown Japanese tea')."
    },
    {
        teaName: "Sencha",
        originalName: "煎茶",
        region: "Japan",
        processingMethods: ["steamed", "rolled", "dried"],
        flavors: ["grassy", "vegetal", "marine", "astringent"],
        description: "Japan's most popular everyday green tea with a refreshing taste (ISO: 'standard steamed green tea')."
    }
];

// White Teas (minimal fallback)
var asianWhiteTeas = [
    {
        teaName: "Bai Hao Yin Zhen (Silver Needle)",
        originalName: "白毫銀針",
        region: "Fujian, China",
        processingMethods: ["minimal-processing", "withered", "sun-dried"],
        flavors: ["honeysuckle", "melon", "delicate", "sweet"],
        description: "The most prestigious white tea made only from unopened buds covered in white down (ISO: 'premium bud-only white tea')."
    }
];

// Oolong Teas (minimal fallback)
var asianOolongTeas = [
    {
        teaName: "Tie Guan Yin (Iron Goddess)",
        originalName: "铁观音",
        region: "Fujian, China",
        processingMethods: ["withered", "oxidized", "rolled", "roasted"],
        flavors: ["floral", "orchid", "sweet", "smooth"],
        description: "Famous Chinese oolong with a captivating floral aroma and smooth taste (ISO: 'classic Anxi oolong')."
    }
];

// Black Teas (minimal fallback)
var asianBlackTeas = [
    {
        teaName: "Darjeeling First Flush",
        originalName: "दार्जिलिंग फर्स्ट फ्लश",
        region: "Darjeeling, West Bengal, India",
        processingMethods: ["withered", "rolled", "fully-oxidized", "dried"],
        flavors: ["floral", "muscatel", "delicate", "bright"],
        description: "Early spring harvest with a light, floral character and the region's distinctive muscatel notes (ISO: 'first-harvest Darjeeling')."
    }
];

// Yellow Teas (minimal fallback)
var asianYellowTeas = [
    {
        teaName: "Jun Shan Yin Zhen",
        originalName: "君山银针",
        region: "Hunan, China",
        processingMethods: ["withered", "wrapped", "yellowing", "slow-dried"],
        flavors: ["delicate", "sweet", "floral", "mellow"],
        description: "Famous yellow tea from Junshan Island, historically reserved for imperial consumption (ISO: 'traditional-process yellow tea')."
    }
];

// Dark Teas (minimal fallback)
var asianDarkTeas = [
    {
        teaName: "Pu-erh Sheng (Raw)",
        originalName: "生普洱",
        region: "Yunnan, China",
        processingMethods: ["withered", "fixed", "rolled", "sun-dried", "aged"],
        flavors: ["vegetal", "fruity", "complex", "evolving"],
        description: "Naturally fermented and aged tea that develops more complexity over time (ISO: 'natural-aged Yunnan tea')."
    }
];

// Load all tea files sequentially
function loadAllTeaDatasets(callback) {
    let loadedCount = 0;
    let errorCount = 0;
    
    function loadNext(index) {
        if (index >= teaFiles.length) {
            console.log(`Finished loading tea datasets. Loaded: ${loadedCount}, Failed: ${errorCount}`);
            if (callback) callback(errorCount === 0);
            return;
        }
        
        loadTeaDataset(teaFiles[index], (error) => {
            if (error) {
                errorCount++;
            } else {
                loadedCount++;
            }
            loadNext(index + 1);
        });
    }
    
    loadNext(0);
}

// If this script is loaded in a browser environment, start loading all datasets
if (typeof window !== 'undefined') {
    console.log("Dataset loader initialized, starting to load tea data files...");
    loadAllTeaDatasets((success) => {
        console.log(`Dataset loading ${success ? 'completed successfully' : 'completed with errors'}`);
    });
}

console.log("Dataset base loaded successfully!"); 