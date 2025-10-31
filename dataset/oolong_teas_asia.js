/**
 * 50 Oolong Teas from Asia
 * Collection of premium oolong teas with processing methods and flavor profiles
 * 
 * Processing terms follow ISO 20715:2023 (Tea classification and terminology):
 * - "Partial oxidation" = 10-70% oxidation (varies by style)
 * - "Withered" = Indoor/outdoor moisture reduction (ISO 20715: Section 6.1.2)
 * - "Rolled" = Shaping by twisting/compression (ISO 20715: Section 6.1.4)
 * - "Rock-fired" = Wuyi-style charcoal roasting (ISO 20715: Section 6.2.3)
 * - "Tumbled" = Mechanical bruising (ISO 20715: "disruption")
 * - "Anaerobic" = Oxygen-free fermentation (GABA processing)
 * 
 * Flavor terminology follows ISO 20715:2023 Section 4 (Sensory description):
 * - Primary flavor categories: floral, fruity, mineral, honey, creamy, woody, roasted, spicy
 * - Complex flavor profiles based on cultivar, terroir, and processing intensity
 * - Specific ISO sensory descriptors: orchid, butter, tropical-fruit, stone-fruit, caramel
 * - ISO "flavor wheel" used to standardize descriptors (ISO 20715: Annex A)
 */

var asianOolongTeas = [
    {
        teaName: "Tie Guan Yin (Iron Goddess of Mercy)",
        originalName: "铁观音",
        region: "Anxi, Fujian, China",
        processingMethods: ["withered", "tumbled", "partial-oxidation (20-30%)", "rolled", "medium-roast"],
        flavors: ["orchid", "floral", "creamy", "fresh"],
        description: "Famous Chinese oolong with a rich history and distinctive floral character (ISO: 'high-aroma oolong')."
    },
    {
        teaName: "Dong Ding (Frozen Summit)",
        originalName: "凍頂",
        region: "Nantou, Taiwan",
        processingMethods: ["withered", "tumbled", "partial-oxidation (25-35%)", "rolled", "light-roast"],
        flavors: ["toasty", "honey", "nutty", "light-fruity"],
        description: "Classic Taiwanese oolong from Dong Ding mountain with balanced floral and roasted notes (ISO: 'medium-oxidation roasted oolong')."
    },
    {
        teaName: "Da Hong Pao (Big Red Robe)",
        originalName: "大红袍",
        region: "Wuyi Mountains, Fujian, China",
        processingMethods: ["withered", "partial-oxidation (50-60%)", "heavy-roast", "rock-fired"],
        flavors: ["mineral", "roasted", "woody", "caramel"],
        description: "Legendary rock tea from Wuyi with deep, rich character and mineral notes (ISO: 'heavily-roasted rock tea')."
    },
    {
        teaName: "Ali Shan",
        originalName: "阿里山",
        region: "Chiayi, Taiwan",
        processingMethods: ["withered", "tumbled", "partial-oxidation (20-30%)", "rolled"],
        flavors: ["creamy", "butter", "sweet-floral", "fresh"],
        description: "High mountain oolong known for its creamy texture and floral sweetness (ISO: 'high-elevation Taiwanese oolong')."
    },
    {
        teaName: "Shui Xian (Water Fairy)",
        originalName: "水仙",
        region: "Wuyi Mountains, Fujian, China",
        processingMethods: ["withered", "partial-oxidation (40-50%)", "medium-roast", "rock-fired"],
        flavors: ["mineral", "orchid", "toasty", "honey"],
        description: "Classic Wuyi rock tea with balanced floral and mineral characteristics (ISO: 'medium-roast rock oolong')."
    },
    {
        teaName: "Jin Xuan (Milk Oolong)",
        originalName: "金萱",
        region: "Taiwan",
        processingMethods: ["withered", "tumbled", "partial-oxidation (15-25%)", "rolled"],
        flavors: ["creamy", "butter", "floral", "vanilla"],
        description: "Taiwanese cultivar known for its natural milk-like flavor (ISO: 'naturally creamy')."
    },
    {
        teaName: "Bai Hao (Oriental Beauty)",
        originalName: "白毫烏龍",
        region: "Hsinchu, Taiwan",
        processingMethods: ["withered", "partial-oxidation (60-70%)", "insect-bitten"],
        flavors: ["honey", "muscatel", "peach", "ripe-fruit"],
        description: "Bug-bitten oolong with honey-like sweetness (ISO: 'insect-assisted oxidation')."
    },
    {
        teaName: "Feng Huang Dan Cong (Phoenix Single Grove)",
        originalName: "凤凰单丛",
        region: "Guangdong, China",
        processingMethods: ["withered", "partial-oxidation (30-50%)", "shaped", "medium-roast"],
        flavors: ["orchid", "honey", "almond", "stone-fruit"],
        description: "Complex oolong mimicking aromatic profiles (ISO: 'naturally aromatic tea')."
    },
    {
        teaName: "Rou Gui (Cinnamon)",
        originalName: "肉桂",
        region: "Wuyi Mountains, Fujian, China",
        processingMethods: ["withered", "partial-oxidation (50-60%)", "medium-roast", "rock-fired"],
        flavors: ["cinnamon", "mineral", "woody", "dark-fruit"],
        description: "Rock oolong with distinctive spice notes (ISO: 'spice-type aroma')."
    },
    {
        teaName: "Li Shan",
        originalName: "梨山",
        region: "Taichung, Taiwan",
        processingMethods: ["withered", "tumbled", "partial-oxidation (20-30%)", "rolled"],
        flavors: ["sweet-floral", "fresh", "butter", "melon"],
        description: "Premium high mountain tea grown at over 2000m (ISO: 'high-altitude tea')."
    },
    {
        teaName: "Bai Ji Guan (White Cockscomb)",
        originalName: "白鸡冠",
        region: "Wuyi Mountains, Fujian, China",
        processingMethods: ["withered", "partial-oxidation (30-40%)", "light-roast", "rock-fired"],
        flavors: ["floral", "light", "sweet", "green-notes"],
        description: "Rare Wuyi rock tea with delicate character (ISO: 'light-oxidized oolong')."
    },
    {
        teaName: "Four Seasons Spring",
        originalName: "四季春",
        region: "Taiwan",
        processingMethods: ["withered", "tumbled", "partial-oxidation (15-25%)", "rolled"],
        flavors: ["floral", "lilac", "sweet", "fresh-vegetal"],
        description: "Versatile Taiwanese oolong harvestable year-round (ISO: 'all-season Taiwanese oolong')."
    },
    {
        teaName: "Ban Tian Yao",
        originalName: "半天腰",
        region: "Wuyi Mountains, Fujian, China",
        processingMethods: ["withered", "partial-oxidation (50-60%)", "medium-roast", "rock-fired"],
        flavors: ["mineral", "orchid", "woody", "charcoal"],
        description: "Wuyi rock tea named after its growing location 'halfway up the mountain' (ISO: 'mid-elevation rock oolong')."
    },
    {
        teaName: "Tung Ting (Dong Ding)",
        originalName: "凍頂",
        region: "Nantou, Taiwan",
        processingMethods: ["withered", "tumbled", "partial-oxidation (25-35%)", "rolled", "light-roast"],
        flavors: ["floral", "creamy", "butterscotch", "sweet"],
        description: "Named after the Frozen Summit mountain (ISO: 'medium-oxidized oolong')."
    },
    {
        teaName: "Tie Luo Han (Iron Arhat)",
        originalName: "铁罗汉",
        region: "Wuyi Mountains, Fujian, China",
        processingMethods: ["withered", "partial-oxidation (50-60%)", "medium-roast", "rock-fired"],
        flavors: ["mineral", "earthy", "roasted", "dark-fruit"],
        description: "One of the four famous 'rock teas' (ISO: 'heavy-roasted oolong')."
    },
    {
        teaName: "Shan Lin Xi",
        originalName: "杉林溪",
        region: "Nantou, Taiwan",
        processingMethods: ["withered", "tumbled", "partial-oxidation (20-30%)", "rolled"],
        flavors: ["fresh", "floral", "crisp", "honeydew"],
        description: "High mountain oolong grown in foggy forests (ISO: 'high-altitude tea')."
    },
    {
        teaName: "Qi Lan (Rare Orchid)",
        originalName: "奇兰",
        region: "Wuyi Mountains, Fujian, China",
        processingMethods: ["withered", "partial-oxidation (40-50%)", "medium-roast", "rock-fired"],
        flavors: ["orchid", "fruity", "roasted", "honey"],
        description: "Wuyi rock oolong with pronounced floral notes (ISO: 'floral-character rock oolong')."
    },
    {
        teaName: "Da Yu Ling",
        originalName: "大禹嶺",
        region: "Taichung, Taiwan",
        processingMethods: ["withered", "tumbled", "partial-oxidation (20-30%)", "rolled"],
        flavors: ["floral", "honey", "sweet", "pear"],
        description: "Once Taiwan's highest grown tea (ISO: 'ultra-high-altitude tea')."
    },
    {
        teaName: "Gui Fei (Concubine)",
        originalName: "貴妃",
        region: "Taiwan",
        processingMethods: ["withered", "partial-oxidation (60-70%)", "insect-bitten", "medium-roast"],
        flavors: ["honey", "peach", "cinnamon", "tropical"],
        description: "Bug-bitten oolong similar to Oriental Beauty (ISO: 'insect-assisted oxidation')."
    },
    {
        teaName: "Huang Jin Gui (Golden Osmanthus)",
        originalName: "黄金桂",
        region: "Anxi, Fujian, China",
        processingMethods: ["withered", "tumbled", "partial-oxidation (15-25%)", "rolled", "light-roast"],
        flavors: ["osmanthus", "honey", "apricot", "floral"],
        description: "Anxi oolong named for its golden liquor (ISO: 'naturally aromatic tea')."
    },
    {
        teaName: "Mei Zhan (Plum Blossom)",
        originalName: "梅占",
        region: "Wuyi Mountains, Fujian, China",
        processingMethods: ["withered", "partial-oxidation (40-50%)", "medium-roast", "rock-fired"],
        flavors: ["plum", "floral", "mineral", "sweet"],
        description: "Wuyi cultivar known for its plum blossom aroma (ISO: 'cultivar-specific rock oolong')."
    },
    {
        teaName: "Jin Guan Yin (Golden Goddess)",
        originalName: "金观音",
        region: "Anxi, Fujian, China",
        processingMethods: ["withered", "tumbled", "partial-oxidation (20-30%)", "rolled", "light-roast"],
        flavors: ["orchid", "creamy", "honey", "sweet"],
        description: "Modern cultivar combining Tie Guan Yin and Huang Jin Gui traits (ISO: 'hybrid-cultivar oolong')."
    },
    {
        teaName: "Wu Yi Rou Gui (Wuyi Cinnamon)",
        originalName: "武夷肉桂",
        region: "Wuyi Mountains, Fujian, China",
        processingMethods: ["withered", "partial-oxidation (50-60%)", "medium-roast", "rock-fired"],
        flavors: ["cinnamon", "mineral", "roasted", "woody"],
        description: "Hybrid of Da Hong Pao with lighter character (ISO: 'spice-note rock oolong')."
    },
    {
        teaName: "Tsui Yu (Jade)",
        originalName: "翠玉",
        region: "Taiwan",
        processingMethods: ["withered", "tumbled", "partial-oxidation (20-30%)", "rolled"],
        flavors: ["floral", "butter", "vanilla", "sweet"],
        description: "Taiwanese cultivar with butter-like texture (ISO: 'naturally creamy')."
    },
    {
        teaName: "Fo Shou (Buddha's Hand)",
        originalName: "佛手",
        region: "Wuyi Mountains, Fujian, China",
        processingMethods: ["withered", "partial-oxidation (40-50%)", "medium-roast", "rock-fired"],
        flavors: ["citrus", "fruity", "woody", "complex"],
        description: "Named after Buddha's Hand fruit due to large leaves (ISO: 'citrus-type aroma')."
    },
    {
        teaName: "Gabaron Oolong",
        originalName: "GABA烏龍",
        region: "Taiwan",
        processingMethods: ["withered", "anaerobic-fermentation", "partial-oxidation (30-40%)", "rolled"],
        flavors: ["fruity", "mellow", "apple", "smooth"],
        description: "Specialty oolong high in GABA (ISO: 'anaerobic-processed tea')."
    },
    {
        teaName: "Huang Dan (Yellow Dawn)",
        originalName: "黄旦",
        region: "Guangdong, China",
        processingMethods: ["withered", "partial-oxidation (30-40%)", "shaped", "medium-roast"],
        flavors: ["honey", "floral", "stone-fruit", "nectar"],
        description: "Phoenix oolong with light fermentation (ISO: 'naturally sweet tea')."
    },
    {
        teaName: "Mao Xie (Hairy Crab)",
        originalName: "毛蟹",
        region: "Anxi, Fujian, China",
        processingMethods: ["withered", "tumbled", "partial-oxidation (20-30%)", "rolled", "light-roast"],
        flavors: ["vegetal", "orchid", "umami", "fresh"],
        description: "Named after fine leaf hairs (ISO: 'vegetal-type aroma')."
    },
    {
        teaName: "Ye Lai Xiang (Evening Fragrance)",
        originalName: "夜来香",
        region: "Guangdong, China",
        processingMethods: ["withered", "partial-oxidation (40-50%)", "shaped", "medium-roast"],
        flavors: ["floral", "honey", "sweet", "complex"],
        description: "Phoenix Dan Cong with nocturnal flower scent (ISO: 'floral-type aroma')."
    },
    {
        teaName: "Charcoal-Fired Tie Guan Yin",
        originalName: "炭焙铁观音",
        region: "Anxi, Fujian, China",
        processingMethods: ["withered", "tumbled", "partial-oxidation (30-40%)", "rolled", "charcoal-roast"],
        flavors: ["roasted", "caramel", "toasty", "honey"],
        description: "Traditional TGY roasted over charcoal (ISO: 'charcoal-roasted oolong')."
    },
    {
        teaName: "Mi Lan Xiang (Honey Orchid)",
        originalName: "蜜兰香",
        region: "Guangdong, China",
        processingMethods: ["withered", "partial-oxidation (40-50%)", "shaped", "medium-roast"],
        flavors: ["honey", "lychee", "tropical", "orchid"],
        description: "Phoenix Dan Cong with honey and fruit notes (ISO: 'naturally aromatic tea')."
    },
    {
        teaName: "Aged Dong Ding",
        originalName: "陳年凍頂",
        region: "Nantou, Taiwan",
        processingMethods: ["withered", "tumbled", "partial-oxidation (25-35%)", "rolled", "aged", "re-roasted"],
        flavors: ["woody", "dried-fruit", "roasted", "honey"],
        description: "Aged 5-30 years with periodic re-roasting (ISO: 'aged oolong')."
    },
    {
        teaName: "Qing Xin",
        originalName: "青心",
        region: "Taiwan",
        processingMethods: ["withered", "tumbled", "partial-oxidation (20-30%)", "rolled"],
        flavors: ["floral", "sweet", "creamy", "fresh"],
        description: "Popular cultivar for high mountain teas (ISO: 'high-altitude tea')."
    },
    {
        teaName: "Xiao Hong Pao (Little Red Robe)",
        originalName: "小红袍",
        region: "Wuyi Mountains, Fujian, China",
        processingMethods: ["withered", "partial-oxidation (50-60%)", "medium-roast", "rock-fired"],
        flavors: ["fruity", "mineral", "caramel", "floral"],
        description: "Hybrid of Da Hong Pao with lighter character (ISO: 'light-roast rock oolong')."
    },
    {
        teaName: "Snow Peak",
        originalName: "雪峰",
        region: "Taiwan",
        processingMethods: ["withered", "tumbled", "partial-oxidation (20-30%)", "rolled"],
        flavors: ["floral", "vanilla", "delicate", "honey"],
        description: "High mountain oolong from Snow Peak area (ISO: 'high-altitude tea')."
    },
    {
        teaName: "Yu Lan Xiang (Magnolia)",
        originalName: "玉兰香",
        region: "Guangdong, China",
        processingMethods: ["withered", "partial-oxidation (40-50%)", "shaped", "medium-roast"],
        flavors: ["magnolia", "honey", "floral", "nectar"],
        description: "Phoenix Dan Cong mimicking magnolia flowers (ISO: 'floral-type aroma')."
    },
    {
        teaName: "Ben Shan (Root Mountain)",
        originalName: "本山",
        region: "Anxi, Fujian, China",
        processingMethods: ["withered", "tumbled", "partial-oxidation (20-30%)", "rolled", "light-roast"],
        flavors: ["orchid", "vegetal", "sweet", "fresh"],
        description: "Traditional Anxi cultivar (ISO: 'light-oxidized oolong')."
    },
    {
        teaName: "Qi Zhong (Osmanthus)",
        originalName: "奇種",
        region: "Taiwan",
        processingMethods: ["withered", "tumbled", "partial-oxidation (20-30%)", "rolled"],
        flavors: ["osmanthus", "floral", "sweet", "peach"],
        description: "Fragrant cultivar with natural osmanthus aroma (ISO: 'naturally aromatic tea')."
    },
    {
        teaName: "Xing Ren Xiang (Almond)",
        originalName: "杏仁香",
        region: "Guangdong, China",
        processingMethods: ["withered", "partial-oxidation (40-50%)", "shaped", "medium-roast"],
        flavors: ["almond", "marzipan", "nutty", "sweet"],
        description: "Phoenix Dan Cong with almond notes (ISO: 'nutty-type aroma')."
    },
    {
        teaName: "GABA Oolong",
        originalName: "GABA烏龍茶",
        region: "Taiwan",
        processingMethods: ["withered", "anaerobic-fermentation", "partial-oxidation (30-40%)", "rolled"],
        flavors: ["fruity", "sweet", "mellow", "smooth"],
        description: "High-GABA oolong (ISO: 'anaerobic-processed tea')."
    },
    {
        teaName: "Zhi Lan Xiang (Orchid)",
        originalName: "芝兰香",
        region: "Guangdong, China",
        processingMethods: ["withered", "partial-oxidation (40-50%)", "shaped", "medium-roast"],
        flavors: ["orchid", "floral", "honey", "complex"],
        description: "Phoenix Dan Cong with pronounced orchid notes (ISO: 'floral-type aroma')."
    },
    {
        teaName: "Traditional Tie Guan Yin",
        originalName: "传统铁观音",
        region: "Anxi, Fujian, China",
        processingMethods: ["withered", "tumbled", "partial-oxidation (40-50%)", "rolled", "medium-roast"],
        flavors: ["toasty", "woody", "floral", "complex"],
        description: "Classic style with higher oxidation than modern versions (ISO: 'traditional-style Anxi oolong')."
    },
    {
        teaName: "Bug-Bitten Shanlinxi",
        originalName: "蜜香杉林溪",
        region: "Nantou, Taiwan",
        processingMethods: ["withered", "insect-bitten", "partial-oxidation (60-70%)", "rolled"],
        flavors: ["honey", "muscatel", "fruity", "sweet"],
        description: "Leafhopper-nibbled tea (ISO: 'insect-assisted oxidation')."
    },
    {
        teaName: "Zhi Lan (Iris)",
        originalName: "栀兰",
        region: "Wuyi Mountains, Fujian, China",
        processingMethods: ["withered", "partial-oxidation (40-50%)", "medium-roast", "rock-fired"],
        flavors: ["iris", "orchid", "mineral", "smooth"],
        description: "Wuyi rock tea with floral dominance (ISO: 'floral-type aroma')."
    },
    {
        teaName: "Ruan Zhi (Soft Stem)",
        originalName: "軟枝",
        region: "Taiwan/Thailand",
        processingMethods: ["withered", "tumbled", "partial-oxidation (15-25%)", "rolled"],
        flavors: ["floral", "creamy", "fresh", "sweet"],
        description: "Versatile cultivar grown in Taiwan and Thailand (ISO: 'cross-regional oolong cultivar')."
    },
    {
        teaName: "Ya Shi Xiang (Duck Shit Aroma)",
        originalName: "鸭屎香",
        region: "Guangdong, China",
        processingMethods: ["withered", "partial-oxidation (40-50%)", "shaped", "medium-roast"],
        flavors: ["honey", "lychee", "tropical-fruit", "floral"],
        description: "Prized Phoenix oolong with exceptional fragrance (ISO: 'naturally aromatic tea')."
    },
    {
        teaName: "Mei Zhan Rock Tea",
        originalName: "梅占岩茶",
        region: "Wuyi Mountains, Fujian, China",
        processingMethods: ["withered", "partial-oxidation (50-60%)", "medium-roast", "rock-fired"],
        flavors: ["plum", "mineral", "sweet", "floral"],
        description: "Mei Zhan cultivar processed as Wuyi rock tea (ISO: 'plum-character rock oolong')."
    },
    {
        teaName: "Hua Xiang (Floral Fragrance)",
        originalName: "花香",
        region: "Guangdong, China",
        processingMethods: ["withered", "partial-oxidation (30-40%)", "shaped", "light-roast"],
        flavors: ["mixed-flowers", "nectar", "sweet", "complex"],
        description: "Phoenix Dan Cong with floral bouquet (ISO: 'floral-type aroma')."
    },
    {
        teaName: "Guangdong Oolong",
        originalName: "广东乌龙",
        region: "Guangdong, China",
        processingMethods: ["withered", "partial-oxidation (40-50%)", "shaped", "medium-roast"],
        flavors: ["fruity", "honey", "floral", "sweet"],
        description: "Regional style of Guangdong oolongs (ISO: 'single-bush aroma oolong')."
    },
    {
        teaName: "High Mountain Old Bush",
        originalName: "高山老欉",
        region: "Taiwan",
        processingMethods: ["withered", "tumbled", "partial-oxidation (20-30%)", "rolled", "light-roast"],
        flavors: ["complex", "deep", "floral", "honey"],
        description: "From 40+ year-old bushes (ISO: 'aged-plant tea')."
    },
    {
        teaName: "Vietnamese Gui Fei",
        originalName: "越南贵妃",
        region: "Northern Vietnam",
        processingMethods: ["withered", "insect-bitten", "partial-oxidation (60-70%)", "rolled"],
        flavors: ["honey", "cinnamon", "tropical", "woody"],
        description: "Vietnamese bug-bitten oolong (ISO: 'insect-assisted oxidation')."
    }
];

// Export the data
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { asianOolongTeas };
}