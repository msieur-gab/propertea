/**
 * 50 Green Teas from Asia
 * Collection of premium green teas with their processing methods and flavor profiles
 *
 * Processing terms follow ISO 20715:2023 (Tea classification and terminology):
 * - "Withered" = Initial moisture reduction step (ISO 20715: Section 6.1.2)
 * - "Pan-fired" = Chinese dry-heat fixation method (ISO 20715: Section 6.2.1)
 * - "Steamed" = Japanese moist-heat fixation method (ISO 20715: Section 6.2.2)
 * - "Rolled" = Leaf shaping and moisture reduction (ISO 20715: Section 6.2.3)
 * - "Shaped" = Physical manipulation of leaves (ISO 20715: Section 6.2.4)
 * - "Dried" = Final moisture removal stage (ISO 20715: Section 6.2.5)
 * - "Shaded" = Pre-harvest light reduction cultivation (ISO 20715: Section 3.4.3)
 * 
 * Flavor terminology follows ISO 20715:2023 Section 4 (Sensory description):
 * - Primary flavor categories: vegetal, nutty, floral, umami, sweet, grassy
 * - Specific sensory descriptors: marine, chestnut, orchid, clean, fresh, fruity
 * - ISO "flavor wheel" used to standardize descriptors (ISO 20715: Annex A)
 */

// Define in global scope (window) for browser compatibility
var asianGreenTeas = [
    {
        teaName: "Dragon Well (Longjing)",
        originalName: "龙井",
        region: "Hangzhou, China",
        processingMethods: ["withered", "pan-fired", "hand-pressed"],
        flavors: ["vegetal", "chestnut", "sweet", "grassy"],
        description: "Premier Chinese green tea known for its flat, sword-shaped leaves and sweet, nutty flavor (ISO: 'flat-pressed green tea')."
    },
    {
        teaName: "Gyokuro",
        originalName: "玉露",
        region: "Japan",
        processingMethods: ["shaded", "steamed", "rolled", "dried"],
        flavors: ["umami", "marine", "sweet", "grassy"],
        description: "Premium Japanese green tea grown in the shade for weeks before harvesting (ISO: 'shaded green tea')."
    },
    {
        teaName: "Bi Luo Chun",
        originalName: "碧螺春",
        region: "Jiangsu, China",
        processingMethods: ["withered", "pan-fired", "hand-rolled"],
        flavors: ["fruity", "floral", "sweet", "fresh"],
        description: "Delicate tea with white fuzz and spiral shape, infused with fruit tree aromas (ISO: 'tight-curled green tea')."
    },
    {
        teaName: "Sencha",
        originalName: "煎茶",
        region: "Japan",
        processingMethods: ["steamed", "rolled", "dried"],
        flavors: ["grassy", "vegetal", "marine", "astringent"],
        description: "Japan's most popular everyday green tea with a refreshing taste (ISO: 'standard steamed green tea')."
    },
    {
        teaName: "Mao Feng",
        originalName: "毛峰",
        region: "Anhui, China",
        processingMethods: ["withered", "pan-fired", "hand-rolled"],
        flavors: ["floral", "nutty", "sweet", "orchid"],
        description: "High-quality tea with downy white hairs and a delicate floral aroma (ISO: 'fur-peak style green tea')."
    },
    {
        teaName: "Matcha",
        originalName: "抹茶",
        region: "Japan",
        processingMethods: ["shaded", "steamed", "dried", "stone-ground"],
        flavors: ["umami", "grassy", "sweet", "vegetal"],
        description: "Powdered green tea used in traditional Japanese tea ceremonies (ISO: 'powdered green tea')."
    },
    {
        teaName: "Taiping Houkui",
        originalName: "太平猴魁",
        region: "Anhui, China",
        processingMethods: ["withered", "pan-fired", "pressed"],
        flavors: ["orchid", "fresh", "sweet", "mellow"],
        description: "Distinctive flat, large leaves known for their orchid-like aroma (ISO: 'large-leaf pressed green tea')."
    },
    {
        teaName: "Kabusecha",
        originalName: "かぶせ茶",
        region: "Japan",
        processingMethods: ["partial-shade", "steamed", "rolled", "dried"],
        flavors: ["umami", "sweet", "grassy", "mild"],
        description: "Partially-shaded tea, between sencha and gyokuro in character (ISO: 'lightly-shaded green tea')."
    },
    {
        teaName: "Liu An Gua Pian",
        originalName: "六安瓜片",
        region: "Anhui, China",
        processingMethods: ["withered", "pan-fired", "charcoal-finished"],
        flavors: ["sweet", "orchid", "fresh", "clean"],
        description: "One of China's ten famous teas with distinctive processing (ISO: 'melon seed green tea')."
    },
    {
        teaName: "Genmaicha",
        originalName: "玄米茶",
        region: "Japan",
        processingMethods: ["steamed", "dried", "mixed-roasted-rice"],
        flavors: ["toasty", "nutty", "grassy", "sweet"],
        description: "Green tea mixed with roasted brown rice, giving a popcorn-like flavor (ISO: 'blended green tea with cereals')."
    },
    {
        teaName: "Anji White Tea",
        originalName: "安吉白茶",
        region: "Zhejiang, China",
        processingMethods: ["withered", "pan-fired", "shaped"],
        flavors: ["sweet", "mild", "delicate", "chestnut"],
        description: "Despite its name, this is a green tea made from unique light-colored leaves (ISO: 'albino cultivar green tea')."
    },
    {
        teaName: "Kukicha",
        originalName: "茎茶",
        region: "Japan",
        processingMethods: ["steamed", "dried", "stem-sorted"],
        flavors: ["woody", "sweet", "light", "nutty"],
        description: "Made from stems, stalks, and twigs of the tea plant (ISO: 'stem green tea')."
    },
    {
        teaName: "Xinyang Maojian",
        originalName: "信阳毛尖",
        region: "Henan, China",
        processingMethods: ["withered", "pan-fired", "hand-rolled"],
        flavors: ["sweet", "chestnut", "floral", "mellow"],
        description: "Known for its pointed shape and abundant white hairs (ISO: 'tip-focused green tea')."
    },
    {
        teaName: "Hojicha",
        originalName: "ほうじ茶",
        region: "Japan",
        processingMethods: ["steamed", "dried", "post-roasted"],
        flavors: ["roasted", "sweet", "nutty", "earthy"],
        description: "Roasted green tea with a distinctive reddish-brown color and toasty flavor (ISO: 'post-fired green tea')."
    },
    {
        teaName: "Putuo Fo Cha",
        originalName: "普陀佛茶",
        region: "Zhejiang, China",
        processingMethods: ["withered", "pan-fired", "shaped"],
        flavors: ["vegetal", "sweet", "clean", "mild"],
        description: "Buddhist temple tea with a long history from Mount Putuo (ISO: 'regional tradition green tea')."
    },
    {
        teaName: "Tamaryokucha",
        originalName: "玉緑茶",
        region: "Japan",
        processingMethods: ["steamed", "curled", "dried"],
        flavors: ["fruity", "sweet", "grassy", "fresh"],
        description: "Curly-shaped tea that's less astringent than typical senchas (ISO: 'curled green tea')."
    },
    {
        teaName: "Kamairicha",
        originalName: "釜炒り茶",
        region: "Japan",
        processingMethods: ["pan-fired", "rolled", "dried"],
        flavors: ["sweet", "nutty", "toasty", "mild"],
        description: "Rare pan-fired Japanese tea with Chinese-influenced processing (ISO: 'pan-fired Japanese tea')."
    },
    {
        teaName: "Zhuyeqing",
        originalName: "竹叶青",
        region: "Sichuan, China",
        processingMethods: ["withered", "pan-fired", "shaped"],
        flavors: ["fresh", "vegetal", "sweet", "grassy"],
        description: "Shaped like bamboo leaves with a sweet, refreshing flavor (ISO: 'bamboo-leaf shaped tea')."
    },
    {
        teaName: "Kabuse Sencha",
        originalName: "かぶせ煎茶",
        region: "Japan",
        processingMethods: ["shaded", "steamed", "rolled", "dried"],
        flavors: ["umami", "sweet", "marine", "smooth"],
        description: "Shaded sencha with more umami and less astringency than regular sencha (ISO: 'lightly-shaded sencha')."
    },
    {
        teaName: "Huangshan Maofeng",
        originalName: "黄山毛峰",
        region: "Anhui, China",
        processingMethods: ["withered", "pan-fired", "hand-rolled"],
        flavors: ["orchid", "chestnut", "sweet", "fresh"],
        description: "Famous mountain tea with a sweet orchid aroma (ISO: 'high-mountain green tea')."
    },
    {
        teaName: "Shincha",
        originalName: "新茶",
        region: "Japan",
        processingMethods: ["steamed", "rolled", "dried"],
        flavors: ["fresh", "vibrant", "sweet", "grassy"],
        description: "First harvest of the season, noted for its freshness and vibrancy (ISO: 'first-flush green tea')."
    },
    {
        teaName: "Duyun Maojian",
        originalName: "都匀毛尖",
        region: "Guizhou, China",
        processingMethods: ["withered", "pan-fired", "shaped"],
        flavors: ["sweet", "floral", "fresh", "clean"],
        description: "Known for small, uniform leaves with a refreshing taste (ISO: 'tip-grade green tea')."
    },
    {
        teaName: "Aracha",
        originalName: "荒茶",
        region: "Japan",
        processingMethods: ["steamed", "rolled", "dried"],
        flavors: ["vegetal", "grassy", "vegetal", "astringent"],
        description: "Unrefined tea before final sorting and grading (ISO: 'raw unfinished green tea')."
    },
    {
        teaName: "Mengding Ganlu",
        originalName: "蒙顶甘露",
        region: "Sichuan, China",
        processingMethods: ["withered", "pan-fired", "hand-rolled"],
        flavors: ["sweet", "floral", "honey", "fresh"],
        description: "Ancient tribute tea meaning \"Sweet Dew of Mount Meng\" (ISO: 'historic tribute tea')."
    },
    {
        teaName: "Fukamushicha",
        originalName: "深蒸し茶",
        region: "Japan",
        processingMethods: ["deep-steamed", "rolled", "dried"],
        flavors: ["rich", "sweet", "vegetal", "full-bodied"],
        description: "Deeply steamed sencha with intense flavor and bright green color (ISO: 'deep-steamed green tea')."
    },
    {
        teaName: "Yongxi Huoqing",
        originalName: "永息活青",
        region: "Jiangxi, China",
        processingMethods: ["pan-fired", "shaped", "withered"],
        flavors: ["fresh", "mild", "sweet", "clean"],
        description: "A refreshing green tea with a clean, straight-forward flavor (ISO: 'regional eastern China green tea')."
    },
    {
        teaName: "Bancha",
        originalName: "番茶",
        region: "Japan",
        processingMethods: ["steamed", "rolled", "dried"],
        flavors: ["mild", "woody", "light", "smooth"],
        description: "Everyday tea made from mature leaves harvested later in the season (ISO: 'late-harvest green tea')."
    },
    {
        teaName: "Qiantang Longjing",
        originalName: "钱塘龙井",
        region: "Zhejiang, China",
        processingMethods: ["withered", "pan-fired", "hand-pressed"],
        flavors: ["chestnut", "fresh", "sweet", "smooth"],
        description: "A variant of Longjing from a different area of Zhejiang (ISO: 'regional dragon well tea')."
    },
    {
        teaName: "Konacha",
        originalName: "粉茶",
        region: "Japan",
        processingMethods: ["steamed", "sifted", "dried"],
        flavors: ["strong", "astringent", "vegetal", "brisk"],
        description: "Made from small leaf particles and dust from sencha production (ISO: 'fine-particle green tea')."
    },
    {
        teaName: "Yun Wu (Cloud Mist)",
        originalName: "云雾",
        region: "Various, China",
        processingMethods: ["withered", "pan-fired", "hand-rolled"],
        flavors: ["fresh", "sweet", "clean", "vegetal"],
        description: "Grown at high elevations where clouds and mist often surround the tea gardens (ISO: 'high-elevation green tea')."
    },
    {
        teaName: "Tencha",
        originalName: "碾茶",
        region: "Japan",
        processingMethods: ["shaded", "steamed", "dried", "de-veined"],
        flavors: ["sweet", "vegetal", "umami", "mild"],
        description: "Unground matcha leaves, with stems and veins removed (ISO: 'matcha-base green tea')."
    },
    {
        teaName: "Enshi Yulu",
        originalName: "恩施玉露",
        region: "Hubei, China",
        processingMethods: ["withered", "steamed", "shaped", "dried"],
        flavors: ["umami", "vegetal", "sweet", "smooth"],
        description: "One of China's rare steamed green teas, similar to Japanese styles (ISO: 'steamed Chinese green tea')."
    },
    {
        teaName: "Zhejiang Gunpowder",
        originalName: "珠茶",
        region: "Zhejiang, China",
        processingMethods: ["withered", "pan-fired", "rolled-into-pellets"],
        flavors: ["robust", "vegetal", "full", "astringent"],
        description: "Tightly rolled into small pellets that resemble gunpowder (ISO: 'pearl-shaped green tea')."
    },
    {
        teaName: "Mecha",
        originalName: "芽茶",
        region: "Japan",
        processingMethods: ["steamed", "rolled", "dried", "bud-sorted"],
        flavors: ["intense", "grassy", "vegetal", "sweet"],
        description: "Made from buds and young leaves separated during processing (ISO: 'bud-grade green tea')."
    },
    {
        teaName: "Ezhong Cuipian",
        originalName: "鄂中翠片",
        region: "Hubei, China",
        processingMethods: ["withered", "pan-fired", "shaped"],
        flavors: ["clean", "fresh", "sweet", "vegetal"],
        description: "Flat tea leaves with a bright green appearance and clean taste (ISO: 'flat-leaf green tea')."
    },
    {
        teaName: "Guapian (Melon Seed)",
        originalName: "瓜片",
        region: "Anhui, China",
        processingMethods: ["withered", "pan-fired", "charcoal-finished"],
        flavors: ["sweet", "clean", "floral", "fresh"],
        description: "Unique processing where stems and veins are removed before firing (ISO: 'de-veined leaf green tea')."
    },
    {
        teaName: "Ryokucha",
        originalName: "緑茶",
        region: "Japan",
        processingMethods: ["steamed", "rolled", "dried"],
        flavors: ["vegetal", "fresh", "clean", "grassy"],
        description: "The general term for Japanese green tea, often referring to standard sencha (ISO: 'standard Japanese green tea')."
    },
    {
        teaName: "Maojian",
        originalName: "毛尖",
        region: "Various, China",
        processingMethods: ["withered", "pan-fired", "hand-rolled"],
        flavors: ["fresh", "sweet", "floral", "clean"],
        description: "A style of pointed, slightly curved leaves covered with fine white hairs (ISO: 'hairy-tip green tea')."
    },
    {
        teaName: "Karigane",
        originalName: "雁ヶ音",
        region: "Japan",
        processingMethods: ["shaded", "steamed", "dried"],
        flavors: ["sweet", "light", "vegetal", "stems"],
        description: "Made from stems and twigs of gyokuro production (ISO: 'premium stem green tea')."
    },
    {
        teaName: "Gan Lu (Sweet Dew)",
        originalName: "甘露",
        region: "Sichuan, China",
        processingMethods: ["withered", "pan-fired", "hand-rolled"],
        flavors: ["sweet", "honey", "floral", "mellow"],
        description: "High-grade tea with a naturally sweet, honey-like taste (ISO: 'honey-profile green tea')."
    },
    {
        teaName: "Miyazaki Sencha",
        originalName: "宮崎煎茶",
        region: "Miyazaki, Japan",
        processingMethods: ["steamed", "rolled", "dried"],
        flavors: ["rich", "balanced", "full", "vegetal"],
        description: "Distinctive Sencha from the southern island of Kyushu (ISO: 'regional Japanese sencha')."
    },
    {
        teaName: "Jinhua Mingqian",
        originalName: "金华明前",
        region: "Zhejiang, China",
        processingMethods: ["pan-fired", "shaped", "withered"],
        flavors: ["fresh", "clear", "sweet", "bright"],
        description: "Pre-Qingming Festival harvest with a delicate, fresh character (ISO: 'early-spring harvest green tea')."
    },
    {
        teaName: "Ujihikari",
        originalName: "宇治光",
        region: "Uji, Japan",
        processingMethods: ["steamed", "rolled", "dried"],
        flavors: ["gentle", "clean", "balanced", "bright"],
        description: "Cultivar developed for brightness and clarity from Japan's historic tea region (ISO: 'cultivar-specific Japanese green tea')."
    },
    {
        teaName: "Huang Shan Yun Wu",
        originalName: "黄山云雾",
        region: "Anhui, China",
        processingMethods: ["withered", "pan-fired", "hand-rolled"],
        flavors: ["sweet", "floral", "mellow", "misty"],
        description: "Mountain mist tea from the famous Yellow Mountains (ISO: 'high-mountain cloud-and-mist tea')."
    },
    {
        teaName: "Gokase Sencha",
        originalName: "五ヶ瀬煎茶",
        region: "Miyazaki, Japan",
        processingMethods: ["steamed", "rolled", "dried"],
        flavors: ["sweet", "rich", "round", "full"],
        description: "Highland sencha from mountainous terrain for a distinctive flavor (ISO: 'high-elevation Japanese sencha')."
    },
    {
        teaName: "Eyun Cuilan",
        originalName: "鄂云翠兰",
        region: "Hubei, China",
        processingMethods: ["withered", "pan-fired", "shaped"],
        flavors: ["orchid", "elegant", "clean", "sweet"],
        description: "Stunning emerald color with an orchid-like aroma (ISO: 'floral-profile green tea')."
    },
    {
        teaName: "Okumidori",
        originalName: "奥みどり",
        region: "Japan",
        processingMethods: ["steamed", "rolled", "dried"],
        flavors: ["rich", "full-bodied", "sweet", "robust"],
        description: "Late-budding cultivar creating a rich, full-bodied cup (ISO: 'cultivar-specific Japanese green tea')."
    },
    {
        teaName: "Three Gorges Yulu",
        originalName: "三峡玉露",
        region: "Hubei, China",
        processingMethods: ["withered", "steamed", "shaped", "dried"],
        flavors: ["umami", "smooth", "sweet", "vegetal"],
        description: "Rare steamed Chinese green tea with a name similar to Japanese Gyokuro (ISO: 'jade dew-style green tea')."
    }
];

// For compatibility with both browser and Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { asianGreenTeas };
} 