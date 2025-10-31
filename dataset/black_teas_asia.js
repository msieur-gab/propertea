/**
 * 50 Black Teas from Asia
 * Collection of premium black teas with their processing methods and flavor profiles
 * 
 * Processing terms follow ISO 20715:2023 (Tea classification and terminology):
 * - "Withered" = Initial moisture reduction step (ISO 20715: Section 6.1.2)
 * - "Rolled" = Leaf cell rupture to promote oxidation (ISO 20715: Section 6.1.5)
 * - "Fully-oxidized" = Complete enzymatic oxidation (ISO 20715: Section 6.1.6)
 * - "Dried" = Final moisture removal (ISO 20715: Section 6.2.1)
 * - "Sun-dried" = Traditional outdoor drying (ISO 20715: Section 6.2.1)
 * - "Pine-smoke-dried" = Specialized drying with pine smoke (ISO 20715: Section 6.2.1.1)
 * 
 * Flavor terminology follows ISO 20715:2023 Section 4 (Sensory description):
 * - Primary flavor categories: malty, floral, fruity, woody, sweet, spicy, smoky
 * - Specific sensory descriptors: muscatel, honey, cocoa, brisk, full-bodied, smooth
 * - ISO "flavor wheel" used to standardize descriptors (ISO 20715: Annex A)
 */

var asianBlackTeas = [
    {
        teaName: "Darjeeling First Flush",
        originalName: "दार्जिलिंग फर्स्ट फ्लश",
        region: "Darjeeling, West Bengal, India",
        processingMethods: ["withered", "rolled", "fully-oxidized", "dried"],
        flavors: ["floral", "muscatel", "delicate", "bright"],
        description: "Early spring harvest with a light, floral character and the region's distinctive muscatel notes (ISO: 'spring-harvested high-mountain black tea')."
    },
    {
        teaName: "Assam Orthodox",
        originalName: "অসম অৰ্থডক্স",
        region: "Assam, India",
        processingMethods: ["withered", "rolled", "fully-oxidized", "dried"],
        flavors: ["malty", "bold", "rich", "brisk"],
        description: "Strong, full-bodied tea from the lowland Assam region, known for its malty character and briskness (ISO: 'classic lowland malty black tea')."
    },
    {
        teaName: "Keemun Hao Ya",
        originalName: "祁門特級",
        region: "Anhui, China",
        processingMethods: ["withered", "rolled", "fully-oxidized", "dried"],
        flavors: ["wine-like", "fruity", "orchid", "smoky"],
        description: "Premium Chinese black tea with a subtle smokiness, often called the 'Burgundy of teas' (ISO: 'premium-grade Chinese black tea')."
    },
    {
        teaName: "Yunnan Golden Needle",
        originalName: "云南金针",
        region: "Yunnan, China",
        processingMethods: ["withered", "rolled", "fully-oxidized", "dried"],
        flavors: ["honey", "malt", "peppery", "cocoa"],
        description: "Made from golden buds, with a sweet, honey-rich flavor and characteristic peppery notes (ISO: 'golden-tip Chinese black tea')."
    },
    {
        teaName: "Nilgiri FOP",
        originalName: "நீலகிரி FOP",
        region: "Tamil Nadu, India",
        processingMethods: ["withered", "rolled", "fully-oxidized", "dried"],
        flavors: ["bright", "crisp", "aromatic", "floral"],
        description: "High-grown tea from Southern India's Blue Mountains with a bright, balanced cup (ISO: 'high-elevation Indian black tea')."
    },
    {
        teaName: "Lapsang Souchong",
        originalName: "正山小种",
        region: "Fujian, China",
        processingMethods: ["withered", "rolled", "pine-smoke-dried", "fully-oxidized"],
        flavors: ["smoky", "pine", "resin", "strong"],
        description: "Distinctive tea dried over pinewood fires, imparting a strong smoky character (ISO: 'smoke-dried Chinese black tea')."
    },
    {
        teaName: "Ceylon Nuwara Eliya",
        originalName: "නුවර එළිය තේ",
        region: "Central Province, Sri Lanka",
        processingMethods: ["withered", "rolled", "fully-oxidized", "dried"],
        flavors: ["delicate", "bright", "crisp", "citrusy"],
        description: "High-grown tea from Sri Lanka's highest elevations, producing a delicate, bright cup (ISO: 'high-elevation Ceylon black tea')."
    },
    {
        teaName: "Dian Hong",
        originalName: "滇红",
        region: "Yunnan, China",
        processingMethods: ["withered", "rolled", "fully-oxidized", "dried"],
        flavors: ["malty", "sweet", "peppery", "rich"],
        description: "Classic Yunnan black tea with rich, malty flavors and signature golden tips (ISO: 'Yunnan golden-tip black tea')."
    },
    {
        teaName: "Darjeeling Second Flush",
        originalName: "दार्जिलिंग सेकंड फ्लश",
        region: "Darjeeling, West Bengal, India",
        processingMethods: ["withered", "rolled", "fully-oxidized", "dried"],
        flavors: ["muscatel", "fruity", "mature", "rich"],
        description: "Summer harvest with a fuller body and pronounced muscatel character, often considered the classic Darjeeling taste (ISO: 'summer-harvested muscatel black tea')."
    },
    {
        teaName: "Ceylon Uva",
        originalName: "ඌව තේ",
        region: "Uva Province, Sri Lanka",
        processingMethods: ["withered", "rolled", "fully-oxidized", "dried"],
        flavors: ["aromatic", "woody", "sweet", "mellow"],
        description: "From Sri Lanka's eastern highlands, known for its distinctive aroma and wintertime character (ISO: 'seasonal Ceylon specialty black tea')."
    },
    {
        teaName: "Jinjunmei",
        originalName: "金骏眉",
        region: "Fujian, China",
        processingMethods: ["withered", "rolled", "fully-oxidized", "dried"],
        flavors: ["honey", "fruity", "sweet", "floral"],
        description: "Luxury black tea made entirely from tender buds, with remarkable sweetness and complexity (ISO: 'premium bud-only Chinese black tea')."
    },
    {
        teaName: "Assam Tippy Golden Flowery Orange Pekoe",
        originalName: "অসম টিপি গোল্ডেন ফ্লারি অরেঞ্জ পেকো",
        region: "Assam, India",
        processingMethods: ["withered", "rolled", "fully-oxidized", "dried"],
        flavors: ["malty", "rich", "robust", "full"],
        description: "Top-grade Assam with an abundance of golden tips, yielding exceptional richness and character (ISO: 'tippy-grade premium Assam black tea')."
    },
    {
        teaName: "Zhengshan Xiaozhong",
        originalName: "正山小种",
        region: "Fujian, China",
        processingMethods: ["withered", "rolled", "fully-oxidized", "dried"],
        flavors: ["pine", "longan", "sweet", "complex"],
        description: "The original, unsmoked version of Lapsang Souchong with complex fruity notes and natural pine character (ISO: 'traditional Wuyi Mountain black tea')."
    },
    {
        teaName: "Ceylon Dimbula",
        originalName: "දිඹුලා තේ",
        region: "Central Province, Sri Lanka",
        processingMethods: ["withered", "rolled", "fully-oxidized", "dried"],
        flavors: ["bright", "medium-bodied", "citrus", "floral"],
        description: "Classic high-grown Ceylon tea from the central mountains, known for its bright, refined character (ISO: 'high-mountain Ceylon black tea')."
    },
    {
        teaName: "Yixing Hong Cha",
        originalName: "宜兴红茶",
        region: "Jiangsu, China",
        processingMethods: ["withered", "rolled", "fully-oxidized", "dried"],
        flavors: ["cocoa", "sweet", "mellow", "woody"],
        description: "Black tea from the famous pottery region of Yixing, with a smooth, mellow character (ISO: 'eastern China specialty black tea')."
    },
    {
        teaName: "Darjeeling Autumnal",
        originalName: "दार्जिलिंग ऑटमनल",
        region: "Darjeeling, West Bengal, India",
        processingMethods: ["withered", "rolled", "fully-oxidized", "dried"],
        flavors: ["muscatel", "sweet", "nutty", "smooth"],
        description: "Fall harvest with a deeper color and richer flavor than other flushes, with a smooth, sweet character (ISO: 'autumn-harvested Darjeeling black tea')."
    },
    {
        teaName: "Ceylon Kandy",
        originalName: "මහනුවර තේ",
        region: "Central Province, Sri Lanka",
        processingMethods: ["withered", "rolled", "fully-oxidized", "dried"],
        flavors: ["full-bodied", "rich", "robust", "malty"],
        description: "Mid-elevation tea from Sri Lanka with a richer, fuller character than high-grown varieties (ISO: 'mid-elevation Ceylon black tea')."
    },
    {
        teaName: "Bai Lin Gong Fu",
        originalName: "白琳工夫",
        region: "Fujian, China",
        processingMethods: ["withered", "rolled", "fully-oxidized", "dried"],
        flavors: ["sweet", "honey", "fruity", "cocoa"],
        description: "Elegant black tea from Fujian with golden tips and natural chocolate and honey notes (ISO: 'Fujian gongfu-style black tea')."
    },
    {
        teaName: "Nilgiri Frost Tea",
        originalName: "நீலகிரி பனி தேயிலை",
        region: "Tamil Nadu, India",
        processingMethods: ["frost-withered", "rolled", "fully-oxidized", "dried"],
        flavors: ["sweet", "aromatic", "distinct", "rich"],
        description: "Unique tea harvested after frost in the Nilgiri hills, developing special flavors from cold stress (ISO: 'frost-influenced specialty black tea')."
    },
    {
        teaName: "Guangdong Black",
        originalName: "广东红茶",
        region: "Guangdong, China",
        processingMethods: ["withered", "rolled", "fully-oxidized", "dried"],
        flavors: ["smooth", "fruity", "warm", "sweet"],
        description: "Southern Chinese black tea with a uniquely smooth, fruity profile from the tropical climate (ISO: 'southern China fruity black tea')."
    },
    {
        teaName: "Ceylon Ruhuna",
        originalName: "රුහුණු තේ",
        region: "Southern Province, Sri Lanka",
        processingMethods: ["withered", "rolled", "fully-oxidized", "dried"],
        flavors: ["bold", "full", "robust", "strong"],
        description: "Low-grown tea from southern Sri Lanka, producing a strong, full-bodied cup with higher tannins (ISO: 'low-elevation Ceylon black tea')."
    },
    {
        teaName: "Ying De Hong",
        originalName: "英德红",
        region: "Guangdong, China",
        processingMethods: ["withered", "rolled", "fully-oxidized", "dried"],
        flavors: ["rich", "malty", "chocolate", "smooth"],
        description: "Robust black tea from Guangdong province with a distinctive chocolate malty character (ISO: 'southern China specialty black tea')."
    },
    {
        teaName: "Sikkim Temi",
        originalName: "सिक्किम टेमी",
        region: "Sikkim, India",
        processingMethods: ["withered", "rolled", "fully-oxidized", "dried"],
        flavors: ["muscatel", "floral", "smooth", "sweet"],
        description: "From India's smallest tea-producing state, with character similar to Darjeeling but smoother (ISO: 'small-region specialty Indian black tea')."
    },
    {
        teaName: "Taiwanese Red Jade",
        originalName: "台茶18號",
        region: "Nantou, Taiwan",
        processingMethods: ["withered", "rolled", "fully-oxidized", "dried"],
        flavors: ["cinnamon", "menthol", "fruity", "sweet"],
        description: "Unique cultivar (TTES #18) bred from Burmese and Taiwanese stock, with natural cinnamon and mint notes (ISO: 'cultivar-specific Taiwanese black tea')."
    },
    {
        teaName: "Munnar Estate",
        originalName: "മൂന്നാർ എസ്റ്റേറ്റ്",
        region: "Kerala, India",
        processingMethods: ["withered", "rolled", "fully-oxidized", "dried"],
        flavors: ["bright", "clean", "mellow", "aromatic"],
        description: "High-grown tea from the lush Western Ghats mountains of Kerala in southern India (ISO: 'southern Indian highland black tea')."
    },
    {
        teaName: "Yi Hong Gong Fu",
        originalName: "宜红工夫",
        region: "Anhui, China",
        processingMethods: ["withered", "rolled", "fully-oxidized", "dried"],
        flavors: ["smooth", "sweet", "mellow", "woody"],
        description: "Lesser-known but high-quality black tea from Anhui province with a smooth character (ISO: 'gongfu-processed Anhui black tea')."
    },
    {
        teaName: "Ceylon Amba",
        originalName: "අඹ තේ",
        region: "Uva Province, Sri Lanka",
        processingMethods: ["withered", "rolled", "fully-oxidized", "dried"],
        flavors: ["mango", "fruity", "sweet", "medium-bodied"],
        description: "Specialist Ceylon tea with distinctive mango notes (amba means mango in Sinhala) (ISO: 'fruit-character Ceylon black tea')."
    },
    {
        teaName: "Golden Ring",
        originalName: "金环",
        region: "Yunnan, China",
        processingMethods: ["withered", "rolled", "fully-oxidized", "dried"],
        flavors: ["honey", "peppery", "cocoa", "rich"],
        description: "Yunnan black tea crafted from curved golden buds, forming ring-like shapes with a rich flavor (ISO: 'artisanal Yunnan black tea')."
    },
    {
        teaName: "Kangra Valley",
        originalName: "कांगड़ा वैली",
        region: "Himachal Pradesh, India",
        processingMethods: ["withered", "rolled", "fully-oxidized", "dried"],
        flavors: ["delicate", "fruity", "mild", "light"],
        description: "High-grown Himalayan tea from northwestern India with a delicate profile, traditionally unblended (ISO: 'northwestern Himalayan black tea')."
    },
    {
        teaName: "Hu Hong",
        originalName: "湖红",
        region: "Hunan, China",
        processingMethods: ["withered", "rolled", "fully-oxidized", "dried"],
        flavors: ["sweet", "smooth", "floral", "mellow"],
        description: "Elegant black tea from Hunan province, smooth and sweet with subdued floral notes (ISO: 'Hunan specialty black tea')."
    },
    {
        teaName: "Ceylon Adam's Peak",
        originalName: "ශ්‍රී පාද තේ",
        region: "Central Province, Sri Lanka",
        processingMethods: ["withered", "rolled", "fully-oxidized", "dried"],
        flavors: ["bright", "crisp", "delicate", "aromatic"],
        description: "Grown near the sacred Adam's Peak mountain in Sri Lanka, with a bright, refined character (ISO: 'single-region Ceylon specialty black tea')."
    },
    {
        teaName: "Feng Qing Dian Hong",
        originalName: "凤庆滇红",
        region: "Yunnan, China",
        processingMethods: ["withered", "rolled", "fully-oxidized", "dried"],
        flavors: ["malty", "chocolate", "rich", "sweet"],
        description: "Rich Dian Hong from Feng Qing county, known for its malty, chocolatey character (ISO: 'regional Yunnan black tea')."
    },
    {
        teaName: "Darjeeling Monsoon",
        originalName: "दार्जिलिंग मानसून",
        region: "Darjeeling, West Bengal, India",
        processingMethods: ["withered", "rolled", "fully-oxidized", "dried"],
        flavors: ["deep", "spicy", "earthy", "full"],
        description: "Distinctive tea produced during the monsoon season, with a heavier, deeper character than other Darjeelings (ISO: 'monsoon-harvested Darjeeling black tea')."
    },
    {
        teaName: "Vietnamese Black",
        originalName: "Trà Đen Việt Nam",
        region: "Northern Vietnam",
        processingMethods: ["withered", "rolled", "fully-oxidized", "dried"],
        flavors: ["bold", "malty", "earthy", "rich"],
        description: "Robust black tea from Vietnam's northern highlands, influenced by nearby Chinese techniques (ISO: 'Southeast Asian highland black tea')."
    },
    {
        teaName: "Tan Yang Gong Fu",
        originalName: "坦洋工夫",
        region: "Fujian, China",
        processingMethods: ["withered", "rolled", "fully-oxidized", "dried"],
        flavors: ["fruity", "sweet", "mellow", "honey"],
        description: "Classic Fujian black tea with natural fruity sweetness and a rich, smooth texture (ISO: 'traditional Fujian gongfu black tea')."
    },
    {
        teaName: "Arunachal Pradesh",
        originalName: "अरुणाचल प्रदेश",
        region: "Arunachal Pradesh, India",
        processingMethods: ["withered", "rolled", "fully-oxidized", "dried"],
        flavors: ["bold", "floral", "woody", "rich"],
        description: "Distinctive tea from India's northeastern frontier, with bold character and floral notes (ISO: 'northeastern Indian black tea')."
    },
    {
        teaName: "Zhejiang Gongfu Hong",
        originalName: "浙江工夫红",
        region: "Zhejiang, China",
        processingMethods: ["withered", "rolled", "fully-oxidized", "dried"],
        flavors: ["smooth", "sweet", "light", "amber"],
        description: "Elegant black tea from eastern China with a smooth, clean flavor profile (ISO: 'eastern China gongfu-style black tea')."
    },
    {
        teaName: "Ceylon Matale",
        originalName: "මාතලේ තේ",
        region: "Central Province, Sri Lanka",
        processingMethods: ["withered", "rolled", "fully-oxidized", "dried"],
        flavors: ["medium-bodied", "fruity", "spicy", "balanced"],
        description: "Mid-elevation tea from Sri Lanka's spice country, with subtle notes reflecting its terroir (ISO: 'regional Ceylon specialty black tea')."
    },
    {
        teaName: "Sichuan Hong",
        originalName: "四川红",
        region: "Sichuan, China",
        processingMethods: ["withered", "rolled", "fully-oxidized", "dried"],
        flavors: ["robust", "earthy", "full", "sweet"],
        description: "Bold black tea from Sichuan province with a robust character and natural sweetness (ISO: 'western China black tea')."
    },
    {
        teaName: "Nepal Mount Everest",
        originalName: "सगरमाथा चिया",
        region: "Ilam, Nepal",
        processingMethods: ["withered", "rolled", "fully-oxidized", "dried"],
        flavors: ["muscatel", "floral", "smooth", "refined"],
        description: "High-altitude tea from the Himalayan foothills of Nepal, with character similar to Darjeeling (ISO: 'Himalayan high-altitude black tea')."
    },
    {
        teaName: "Myanmar Black",
        originalName: "မြန်မာလက်ဖက်နီ",
        region: "Shan State, Myanmar",
        processingMethods: ["withered", "rolled", "fully-oxidized", "dried"],
        flavors: ["robust", "earthy", "malty", "strong"],
        description: "Bold tea from Myanmar's northern highlands with a strong, distinctive character (ISO: 'Myanmar highland black tea')."
    },
    {
        teaName: "Rou Gui Hong Cha",
        originalName: "肉桂红茶",
        region: "Fujian, China",
        processingMethods: ["withered", "rolled", "fully-oxidized", "dried"],
        flavors: ["cinnamon", "sweet", "woody", "complex"],
        description: "Black tea made from the Rou Gui (Cinnamon) cultivar usually used for oolong, with natural spice notes (ISO: 'cultivar-specific Wuyi Mountain black tea')."
    },
    {
        teaName: "Meghalaya",
        originalName: "मेघालय चाय",
        region: "Meghalaya, India",
        processingMethods: ["withered", "rolled", "fully-oxidized", "dried"],
        flavors: ["sweet", "floral", "smooth", "clean"],
        description: "Rare tea from India's 'abode of clouds' state, with a delicate character influenced by its misty climate (ISO: 'northeastern India highland black tea')."
    },
    {
        teaName: "Anhui Ji Hong",
        originalName: "安徽祁红",
        region: "Anhui, China",
        processingMethods: ["withered", "rolled", "fully-oxidized", "dried"],
        flavors: ["smooth", "sweet", "pine", "floral"],
        description: "Another name for higher-grade Keemun, with a refined, smooth character and subtle pine notes (ISO: 'premium-grade Anhui black tea')."
    },
    {
        teaName: "Ceylon Hatton",
        originalName: "හැටන් තේ",
        region: "Central Province, Sri Lanka",
        processingMethods: ["withered", "rolled", "fully-oxidized", "dried"],
        flavors: ["bright", "sweet", "medium-bodied", "balanced"],
        description: "High-grown Ceylon tea from the Hatton region, known for its bright, balanced cup (ISO: 'single-region Ceylon black tea')."
    },
    {
        teaName: "Wild Yunnan Black",
        originalName: "野生云南红茶",
        region: "Yunnan, China",
        processingMethods: ["withered", "rolled", "fully-oxidized", "dried"],
        flavors: ["wildflower", "complex", "honey", "distinctive"],
        description: "Black tea made from semi-wild tea trees in Yunnan, with a distinctive wildflower character (ISO: 'wild-arbor Chinese black tea')."
    },
    {
        teaName: "Manipur Black",
        originalName: "মণিপুরী চা",
        region: "Manipur, India",
        processingMethods: ["withered", "rolled", "fully-oxidized", "dried"],
        flavors: ["robust", "strong", "earthy", "bold"],
        description: "Strong black tea from India's eastern border region, with a bold, full-bodied character (ISO: 'eastern frontier black tea')."
    },
    {
        teaName: "Xishuangbanna Thai",
        originalName: "西双版纳泰式红茶",
        region: "Yunnan, China",
        processingMethods: ["withered", "rolled", "fully-oxidized", "dried"],
        flavors: ["strong", "malty", "rich", "sweet"],
        description: "Bold black tea from China's tropical south, often used for Thai-style iced tea (ISO: 'southern Yunnan specialized black tea')."
    },
    {
        teaName: "Banasura Estate",
        originalName: "ബാണാസുര എസ്റ്റേറ്റ്",
        region: "Kerala, India",
        processingMethods: ["withered", "rolled", "fully-oxidized", "dried"],
        flavors: ["sweet", "medium", "aromatic", "smooth"],
        description: "Organic black tea from a single estate in the Wayanad region of Kerala, with a smooth character (ISO: 'single-estate specialty black tea')."
    },
    {
        teaName: "Hunan Tian Jian",
        originalName: "湖南天尖",
        region: "Hunan, China",
        processingMethods: ["withered", "rolled", "fully-oxidized", "sun-dried"],
        flavors: ["strong", "earthy", "malty", "robust"],
        description: "Bold black tea from Hunan prepared with traditional processing, often sun-dried for added character (ISO: 'traditional sun-dried Chinese black tea')."
    },
    {
        teaName: "Fujian Hong Jin",
        originalName: "福建红锦",
        region: "Fujian, China",
        processingMethods: ["withered", "rolled", "fully-oxidized", "dried"],
        flavors: ["sweet", "caramel", "honey", "fruity"],
        description: "Premium black tea with a high percentage of golden buds, yielding exceptional sweetness (ISO: 'golden-tip premium black tea')."
    }
];

// Export the data
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { asianBlackTeas };
} 