/**
 * 50 Yellow Teas from Asia
 * Collection of premium yellow teas with their processing methods and flavor profiles
 * 
 * Processing terms follow ISO 20715:2023 (Tea classification and terminology):
 * - "Withered" = Indoor/outdoor moisture reduction (ISO 20715: Section 6.1.2)
 * - "Heat-fixed" = Heating to deactivate enzymes (ISO 20715: "fixation" or "kill-green")
 * - "Sealed-yellowing" = Controlled oxidation under limited airflow (ISO 20715: Section 6.1.7)
 * - "Wrapped-yellowing" = Traditional yellowing process in cloth/paper (ISO 20715: "micro-oxidation")
 * - "Slow-drying" = Extended low-temperature drying (ISO 20715: Section 6.2.2)
 * - "Men-huan" = Specific Chinese yellow tea technique (ISO 20715: "sweltering")
 * 
 * Flavor terminology follows ISO 20715:2023 Section 4 (Sensory description):
 * - Primary flavor categories: sweet, floral, fruity, vegetal, nutty, spicy, marine, earthy, roasted
 * - Specific sensory terms: chestnut, honey, mellow, fresh, complex, smooth
 * - ISO "flavor wheel" used to standardize descriptors (ISO 20715: Annex A)
 */

var asianYellowTeas = [
    {
        teaName: "Junshan Yinzhen (Jun Mountain Silver Needle)",
        originalName: "君山银针",
        region: "Dongting Lake, Hunan, China",
        processingMethods: ["withered", "heat-fixed", "sealed-yellowing", "wrapped-yellowing", "slow-drying"],
        flavors: ["sweet", "mellow", "chestnut", "floral"],
        description: "The most prestigious yellow tea, historically served as a tribute tea to Chinese emperors, grown on Jun Mountain island (ISO: 'traditional-process yellow tea')."
    },
    {
        teaName: "Mengding Huangya (Yellow Bud)",
        originalName: "蒙顶黄芽",
        region: "Mengding Mountain, Sichuan, China",
        processingMethods: ["withered", "heat-fixed", "men-huan", "wrapped-yellowing", "slow-drying"],
        flavors: ["sweet", "delicate", "chestnut", "honey"],
        description: "One of the earliest tribute teas in Chinese history, dating back to the Tang dynasty, from Mount Meng (ISO: 'bud-type yellow tea')."
    },
    {
        teaName: "Huoshan Huangya",
        originalName: "霍山黄芽",
        region: "Huoshan County, Anhui, China",
        processingMethods: ["withered", "heat-fixed", "wrapped-yellowing", "slow-drying"],
        flavors: ["floral", "chestnut", "sweet", "mellow"],
        description: "A famous historical yellow tea from Anhui province with a distinctive appearance resembling sparrow tongues (ISO: 'bud-type yellow tea')."
    },
    {
        teaName: "Mo Gan Huang Ya",
        originalName: "莫干黄芽",
        region: "Moganshan, Zhejiang, China",
        processingMethods: ["withered", "heat-fixed", "wrapped-yellowing", "slow-drying"],
        flavors: ["honey", "bamboo", "sweet", "mellow"],
        description: "Delicate yellow tea from Mogan Mountain characterized by its small, uniform buds with a sweet finish (ISO: 'eastern China yellow bud tea')."
    },
    {
        teaName: "Beigang Maojian",
        originalName: "北港毛尖",
        region: "Hunan, China",
        processingMethods: ["withered", "heat-fixed", "men-huan", "wrapped-yellowing", "slow-drying"],
        flavors: ["fresh", "sweet", "floral", "mellow"],
        description: "A less well-known yellow tea from Hunan province with pointed leaves and a fresh, sweet taste (ISO: 'pointed-leaf yellow tea')."
    },
    {
        teaName: "Da Ye Qing Yellow",
        originalName: "大叶青黄茶",
        region: "Guangdong, China",
        processingMethods: ["withered", "heat-fixed", "wrapped-yellowing", "slow-drying"],
        flavors: ["mellow", "sweet", "fruity", "smooth"],
        description: "Yellow tea made from the Da Ye Qing cultivar, normally used for oolong, creating a unique yellow tea character (ISO: 'cultivar-specific yellow tea')."
    },
    {
        teaName: "Huo Mountain Small Yellow",
        originalName: "霍山小黄",
        region: "Anhui, China",
        processingMethods: ["withered", "heat-fixed", "men-huan", "wrapped-yellowing", "slow-drying"],
        flavors: ["chestnut", "sweet", "gentle", "smooth"],
        description: "A lighter, milder version of Huoshan Huangya with small tender buds (ISO: 'small-leaf yellow bud tea')."
    },
    {
        teaName: "Guangdong Yellow Bud",
        originalName: "广东黄芽",
        region: "Guangdong, China",
        processingMethods: ["withered", "heat-fixed", "wrapped-yellowing", "slow-drying"],
        flavors: ["floral", "sweet", "vegetal", "smooth"],
        description: "Yellow tea from the south of China with unique terroir influences from Guangdong's climate (ISO: 'southern China yellow tea')."
    },
    {
        teaName: "Pingyang Huangtang",
        originalName: "平阳黄汤",
        region: "Zhejiang, China",
        processingMethods: ["withered", "heat-fixed", "wrapped-yellowing", "slow-drying"],
        flavors: ["mellow", "honey", "smooth", "sweet"],
        description: "A southern variation of yellow tea from Zhejiang province, producing a golden-yellow liquor (ISO: 'eastern China regional yellow tea')."
    },
    {
        teaName: "Weishan Maojian Yellow",
        originalName: "微山毛尖黄茶",
        region: "Weishan, Shandong, China",
        processingMethods: ["withered", "heat-fixed", "wrapped-yellowing", "slow-drying"],
        flavors: ["sweet", "gentle", "mellow", "vegetal"],
        description: "A northern Chinese yellow tea with delicate, needle-shaped leaves and a mellow taste (ISO: 'northern China pointed-leaf yellow tea')."
    },
    {
        teaName: "Ancient Huoshan Huangya",
        originalName: "古法霍山黄芽",
        region: "Huoshan County, Anhui, China",
        processingMethods: ["withered", "traditional-heat-fixed", "men-huan", "wrapped-yellowing", "slow-drying"],
        flavors: ["chestnut", "complex", "sweet", "rich"],
        description: "Produced using traditional methods that date back centuries, with a more complex flavor profile (ISO: 'traditional-method yellow tea')."
    },
    {
        teaName: "Yinshan Yellow Tea",
        originalName: "银山黄茶",
        region: "Jiangxi, China",
        processingMethods: ["withered", "heat-fixed", "wrapped-yellowing", "slow-drying"],
        flavors: ["sweet", "gentle", "floral", "mellow"],
        description: "A regional yellow tea from Jiangxi province with a delicate character and subtle sweetness (ISO: 'regional specialty yellow tea')."
    },
    {
        teaName: "Jun Shan Small Leaf",
        originalName: "君山小叶",
        region: "Hunan, China",
        processingMethods: ["withered", "heat-fixed", "wrapped-yellowing", "slow-drying"],
        flavors: ["sweet", "nutty", "mellow", "smooth"],
        description: "A variety of Jun Mountain yellow tea made with smaller leaves, yielding a more subtle flavor (ISO: 'small-leaf Hunan yellow tea')."
    },
    {
        teaName: "Meng Ding Sweet Dew",
        originalName: "蒙顶甘露",
        region: "Meng Mountain, Sichuan, China",
        processingMethods: ["withered", "heat-fixed", "men-huan", "wrapped-yellowing", "slow-drying"],
        flavors: ["sweet", "honey", "chestnut", "complex"],
        description: "Named 'Sweet Dew,' this historical tribute tea from Mount Meng has a natural honey-like sweetness (ISO: 'honey-note tribute tea')."
    },
    {
        teaName: "Jin Hua Yellow Tea",
        originalName: "金华黄茶",
        region: "Zhejiang, China",
        processingMethods: ["withered", "heat-fixed", "wrapped-yellowing", "slow-drying"],
        flavors: ["gentle", "sweet", "mellow", "floral"],
        description: "Yellow tea from Jinhua in Zhejiang province, known for its gentle character and pale gold liquor (ISO: 'eastern China regional yellow tea')."
    },
    {
        teaName: "Huang Tang Yellow",
        originalName: "黄汤",
        region: "Anhui, China",
        processingMethods: ["withered", "heat-fixed", "wrapped-yellowing", "slow-drying"],
        flavors: ["mellow", "sweet", "smooth", "chestnut"],
        description: "A traditional yellow tea historically known as 'yellow soup' for its distinctive golden liquor (ISO: 'classic golden-liquor yellow tea')."
    },
    {
        teaName: "Wu Mountain Yellow Bud",
        originalName: "武山黄芽",
        region: "Fujian, China",
        processingMethods: ["withered", "heat-fixed", "wrapped-yellowing", "slow-drying"],
        flavors: ["floral", "sweet", "fruity", "gentle"],
        description: "A rare yellow tea from Fujian province, where oolong teas typically dominate production (ISO: 'non-traditional region yellow tea')."
    },
    {
        teaName: "Meng Ding Yellow Shoot",
        originalName: "蒙顶黄芽",
        region: "Sichuan, China",
        processingMethods: ["withered", "heat-fixed", "wrapped-yellowing", "slow-drying"],
        flavors: ["sweet", "gentle", "chestnut", "floral"],
        description: "Traditionally picked around Tomb Sweeping Day, these early spring buds yield a delicate tea (ISO: 'seasonal harvest yellow tea')."
    },
    {
        teaName: "Sun Dried Yellow",
        originalName: "日晒黄茶",
        region: "Hunan, China",
        processingMethods: ["withered", "heat-fixed", "wrapped-yellowing", "sun-dried"],
        flavors: ["rich", "honey", "fruity", "smooth"],
        description: "A variation on traditional yellow tea that includes sun drying, imparting a unique character (ISO: 'sun-dried tea')."
    },
    {
        teaName: "Gu Bao Yellow",
        originalName: "谷堡黄茶",
        region: "Hubei, China",
        processingMethods: ["withered", "heat-fixed", "wrapped-yellowing", "slow-drying"],
        flavors: ["mellow", "sweet", "smooth", "gentle"],
        description: "A local yellow tea from Hubei province with a smooth, mellow characteristic (ISO: 'regional Chinese yellow tea')."
    },
    {
        teaName: "Huang Tang Imperial",
        originalName: "黄汤御贡",
        region: "Anhui, China",
        processingMethods: ["withered", "heat-fixed", "men-huan", "wrapped-yellowing", "slow-drying"],
        flavors: ["complex", "sweet", "chestnut", "refined"],
        description: "Premium grade yellow tea historically selected for imperial tribute, with an exceptionally refined taste (ISO: 'imperial-grade yellow tea')."
    },
    {
        teaName: "Jun Shan Small Silver",
        originalName: "君山小银",
        region: "Hunan, China",
        processingMethods: ["withered", "heat-fixed", "men-huan", "wrapped-yellowing", "slow-drying"],
        flavors: ["sweet", "delicate", "tender", "smooth"],
        description: "A smaller, more tender version of Jun Mountain Silver Needle with particularly delicate buds (ISO: 'fine-bud yellow tea')."
    },
    {
        teaName: "Heirloom Yellow Tea",
        originalName: "古种黄茶",
        region: "Zhejiang, China",
        processingMethods: ["withered", "heat-fixed", "wrapped-yellowing", "slow-drying"],
        flavors: ["complex", "mellow", "distinctive", "smooth"],
        description: "Made from heirloom tea bush varieties, processed using traditional yellow tea methods (ISO: 'heirloom-cultivar yellow tea')."
    },
    {
        teaName: "High Mountain Yellow",
        originalName: "高山黄茶",
        region: "Hunan, China",
        processingMethods: ["withered", "heat-fixed", "men-huan", "wrapped-yellowing", "slow-drying"],
        flavors: ["fresh", "sweet", "complex", "bright"],
        description: "Yellow tea produced from high elevation gardens, with greater complexity from cooler growing conditions (ISO: 'high-altitude tea')."
    },
    {
        teaName: "Da Mao Feng Yellow",
        originalName: "大毛峰黄茶",
        region: "Zhejiang, China",
        processingMethods: ["withered", "heat-fixed", "wrapped-yellowing", "slow-drying"],
        flavors: ["sweet", "mellow", "gentle", "fruity"],
        description: "Yellow tea made from a larger leaf cultivar, typically used for green tea, creating a unique variant (ISO: 'large-leaf yellow tea')."
    },
    {
        teaName: "Jun Shan 100 Needles",
        originalName: "君山百针",
        region: "Hunan, China",
        processingMethods: ["withered", "heat-fixed", "sealed-yellowing", "wrapped-yellowing", "slow-drying"],
        flavors: ["distinctive", "sweet", "chestnut", "refined"],
        description: "Ultra-premium Jun Mountain yellow tea made from exactly 100 carefully selected buds per batch (ISO: 'limited-production premium yellow tea')."
    },
    {
        teaName: "Dahu Yellow Flake",
        originalName: "大湖黄片",
        region: "Anhui, China",
        processingMethods: ["withered", "heat-fixed", "wrapped-yellowing", "slow-drying"],
        flavors: ["mild", "sweet", "smooth", "gentle"],
        description: "Yellow tea from the Dahu lake region with flat, flake-like leaves and a mild taste (ISO: 'flat-leaf yellow tea')."
    },
    {
        teaName: "Golden Longevity",
        originalName: "金寿眉",
        region: "Hunan, China",
        processingMethods: ["withered", "heat-fixed", "wrapped-yellowing", "slow-drying"],
        flavors: ["mellow", "smooth", "honey", "rich"],
        description: "Yellow tea made from slightly more mature leaves, yielding a richer, fuller-bodied cup (ISO: 'mature-leaf yellow tea')."
    },
    {
        teaName: "Xiang Tan Yellow",
        originalName: "湘潭黄茶",
        region: "Hunan, China",
        processingMethods: ["withered", "heat-fixed", "wrapped-yellowing", "slow-drying"],
        flavors: ["sweet", "mild", "gentle", "smooth"],
        description: "Lesser-known regional yellow tea from Xiangtan in Hunan province, with its own distinctive character (ISO: 'local-origin yellow tea')."
    },
    {
        teaName: "Huang Ya Gold",
        originalName: "黄芽金",
        region: "Anhui, China",
        processingMethods: ["withered", "heat-fixed", "wrapped-yellowing", "slow-drying"],
        flavors: ["sweet", "chestnut", "rich", "smooth"],
        description: "Premium yellow tea with golden tips and a rich, sweet flavor profile (ISO: 'golden-tip yellow tea')."
    },
    {
        teaName: "Mountain Cloud Yellow",
        originalName: "山云黄茶",
        region: "Sichuan, China",
        processingMethods: ["withered", "heat-fixed", "wrapped-yellowing", "slow-drying"],
        flavors: ["fresh", "sweet", "vegetal", "mellow"],
        description: "High mountain yellow tea grown in areas often covered in clouds, yielding a fresh, clean taste (ISO: 'cloud-forest yellow tea')."
    },
    {
        teaName: "Bei Hong Yellow",
        originalName: "北红黄茶",
        region: "Hunan, China",
        processingMethods: ["withered", "heat-fixed", "wrapped-yellowing", "slow-drying"],
        flavors: ["distinctive", "sweet", "fruity", "mellow"],
        description: "A unique yellow tea made from the Bei Hong cultivar typically used for black tea, creating an unusual flavor profile (ISO: 'cross-category cultivar yellow tea')."
    },
    {
        teaName: "Silk Road Yellow",
        originalName: "丝路黄茶",
        region: "Shaanxi, China",
        processingMethods: ["withered", "heat-fixed", "men-huan", "wrapped-yellowing", "slow-drying"],
        flavors: ["mellow", "sweet", "distinctive", "smooth"],
        description: "Yellow tea from regions along the ancient Silk Road, historically traded to Central Asia (ISO: 'historic-route yellow tea')."
    },
    {
        teaName: "Yellow Mountain Tip",
        originalName: "黄山尖",
        region: "Anhui, China",
        processingMethods: ["withered", "heat-fixed", "wrapped-yellowing", "slow-drying"],
        flavors: ["gentle", "sweet", "floral", "mellow"],
        description: "Delicate yellow tea from the Yellow Mountain region with fine, pointed leaves (ISO: 'pointed-leaf mountain yellow tea')."
    },
    {
        teaName: "Ancient Forest Yellow",
        originalName: "古林黄茶",
        region: "Yunnan, China",
        processingMethods: ["withered", "heat-fixed", "wrapped-yellowing", "slow-drying"],
        flavors: ["woody", "honey", "floral", "complex"],
        description: "Rare yellow tea made from leaves harvested from ancient tea tree forests in Yunnan (ISO: 'wild-arbor tea')."
    },
    {
        teaName: "Hunan Golden Bud",
        originalName: "湖南金芽",
        region: "Hunan, China",
        processingMethods: ["withered", "heat-fixed", "wrapped-yellowing", "slow-drying"],
        flavors: ["sweet", "mellow", "nutty", "smooth"],
        description: "Yellow tea made exclusively from tender golden buds, yielding a sweet, refined cup (ISO: 'golden-bud yellow tea')."
    },
    {
        teaName: "Bamboo Yellow",
        originalName: "竹叶青黄茶",
        region: "Sichuan, China",
        processingMethods: ["withered", "heat-fixed", "bamboo-wrapped-yellowing", "slow-drying"],
        flavors: ["bamboo", "fresh", "sweet", "distinctive"],
        description: "Yellow tea traditionally wrapped in bamboo leaves during the yellowing process, imparting subtle bamboo notes (ISO: 'bamboo-wrapped yellowing tea')."
    },
    {
        teaName: "Gu Zhu Purple Bamboo Yellow",
        originalName: "顾渚紫竹黄",
        region: "Zhejiang, China",
        processingMethods: ["withered", "heat-fixed", "wrapped-yellowing", "slow-drying"],
        flavors: ["sweet", "distinctive", "mellow", "complex"],
        description: "Yellow tea made from the rare Purple Bamboo cultivar, normally used for green tea, creating a unique yellow variant (ISO: 'specialty-cultivar yellow tea')."
    },
    {
        teaName: "First Pluck Golden Needle",
        originalName: "明前金针",
        region: "Hunan, China",
        processingMethods: ["withered", "heat-fixed", "wrapped-yellowing", "slow-drying"],
        flavors: ["fresh", "sweet", "delicate", "spring"],
        description: "Yellow tea made from the earliest spring harvest before the Qingming Festival, prized for its delicacy (ISO: 'first-flush yellow tea')."
    },
    {
        teaName: "Tong Ting Yellow",
        originalName: "洞庭黄茶",
        region: "Hunan, China",
        processingMethods: ["withered", "heat-fixed", "wrapped-yellowing", "slow-drying"],
        flavors: ["sweet", "floral", "mellow", "smooth"],
        description: "Yellow tea from the broader Dongting Lake region, displaying classic yellow tea characteristics (ISO: 'lake-region yellow tea')."
    },
    {
        teaName: "Yellow Emperor's Tribute",
        originalName: "黄帝贡茶",
        region: "Henan, China",
        processingMethods: ["withered", "heat-fixed", "men-huan", "wrapped-yellowing", "slow-drying"],
        flavors: ["refined", "sweet", "smooth", "complex"],
        description: "Named after the legendary Yellow Emperor, this tribute-style tea follows ancient processing methods (ISO: 'emperor-named tribute tea')."
    },
    {
        teaName: "Thousand Tael Yellow",
        originalName: "千两黄",
        region: "Anhui, China",
        processingMethods: ["withered", "heat-fixed", "wrapped-yellowing", "slow-drying"],
        flavors: ["rich", "mellow", "sweet", "smooth"],
        description: "Historically expensive yellow tea that was said to cost a thousand taels of silver, suggesting its premium quality (ISO: 'historically-prized yellow tea')."
    },
    {
        teaName: "Five Lakes Yellow",
        originalName: "五湖黄茶",
        region: "Jiangsu, China",
        processingMethods: ["withered", "heat-fixed", "wrapped-yellowing", "slow-drying"],
        flavors: ["mild", "sweet", "clean", "gentle"],
        description: "Yellow tea from the lake regions of Jiangsu province with a mild, clean taste profile (ISO: 'lake-basin yellow tea')."
    },
    {
        teaName: "Wild Mountain Yellow",
        originalName: "野山黄茶",
        region: "Guangxi, China",
        processingMethods: ["withered", "heat-fixed", "wrapped-yellowing", "slow-drying"],
        flavors: ["vegetal", "floral", "complex", "fresh"],
        description: "Yellow tea made from semi-wild tea bushes growing on mountain slopes, creating a more distinctive flavor (ISO: 'wild-grown tea')."
    },
    {
        teaName: "Wufeng Yellow Tips",
        originalName: "五峰黄尖",
        region: "Hubei, China",
        processingMethods: ["withered", "heat-fixed", "wrapped-yellowing", "slow-drying"],
        flavors: ["fresh", "sweet", "delicate", "crisp"],
        description: "Yellow tea from Wufeng in Hubei province, made from tender leaf tips with a fresh character (ISO: 'fresh-tip yellow tea')."
    },
    {
        teaName: "Yellow Peony",
        originalName: "黄牡丹",
        region: "Hunan, China",
        processingMethods: ["withered", "heat-fixed", "wrapped-yellowing", "slow-drying"],
        flavors: ["floral", "sweet", "complex", "smooth"],
        description: "A style of yellow tea made with one bud and adjacent leaves, reminiscent of white peony in appearance (ISO: 'peony-style yellow tea')."
    },
    {
        teaName: "Yue Yang Tower Yellow",
        originalName: "岳阳楼黄茶",
        region: "Hunan, China",
        processingMethods: ["withered", "heat-fixed", "wrapped-yellowing", "slow-drying"],
        flavors: ["sweet", "mellow", "distinctive", "smooth"],
        description: "Named after the famous historic tower in Yueyang, this local specialty yellow tea has a distinctive character (ISO: 'landmark-named yellow tea')."
    },
    {
        teaName: "Three Yellows",
        originalName: "三黄",
        region: "Anhui, China",
        processingMethods: ["withered", "heat-fixed", "triple-wrapped-yellowing", "slow-drying"],
        flavors: ["complex", "sweet", "mellow", "rich"],
        description: "A special yellow tea that undergoes three separate yellowing phases for greater complexity and mellowness (ISO: 'extended-process yellow tea')."
    },
    {
        teaName: "Old Tree Yellow",
        originalName: "老树黄茶",
        region: "Zhejiang, China",
        processingMethods: ["withered", "heat-fixed", "wrapped-yellowing", "slow-drying"],
        flavors: ["deep", "complex", "sweet", "robust"],
        description: "Yellow tea made from the leaves of older tea trees (50+ years), providing greater depth of flavor."
    },
    {
        teaName: "Traditional Pan Yellow",
        originalName: "传统锅黄",
        region: "Sichuan, China",
        processingMethods: ["withered", "pan-fired", "wrapped-yellowing", "slow-drying"],
        flavors: ["roasted", "nutty", "sweet", "complex"],
        description: "Yellow tea processed using traditional pan-firing methods rather than steaming, imparting subtle toasty notes (ISO: 'pan-fired tea')."
    },
    {
        teaName: "Heaven Lake Yellow",
        originalName: "天池黄茶",
        region: "Jilin, China",
        processingMethods: ["withered", "heat-fixed", "wrapped-yellowing", "slow-drying"],
        flavors: ["clean", "fresh", "sweet", "subtle"],
        description: "Rare northern yellow tea from the Heaven Lake region between China and North Korea, with a uniquely clean character (ISO: 'northern-climate yellow tea')."
    },
    {
        teaName: "Aged Yellow Tea",
        originalName: "陈年黄茶",
        region: "Anhui, China",
        processingMethods: ["withered", "heat-fixed", "wrapped-yellowing", "slow-drying", "aged"],
        flavors: ["woody", "mellow", "complex", "earthy"],
        description: "Yellow tea that has been aged for several years, developing deeper, more complex flavors (ISO: 'aged tea')."
    }
];

// Export the data
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { asianYellowTeas };
} 