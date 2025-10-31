/**
 * 50 Dark Teas from Asia
 * Collection of premium pu'er and post-fermented teas with their processing methods and flavor profiles
 * 
 * Processing terms follow ISO 20715:2023 (Tea classification and terminology):
 * - "Withered" = Initial moisture reduction step (ISO 20715: Section 6.1.2)
 * - "Kill-green" = Heat fixation to stop oxidation (ISO 20715: Section 6.1.3)
 * - "Fermented" = Microbial fermentation process (ISO 20715: Section 6.1.7)
 * - "Wet-piled" = Shou/ripe pu'er processing method (ISO 20715: Section 6.1.8)
 * - "Compressed" = Physical shaping into cakes/bricks (ISO 20715: Section 6.2.3)
 * - "Sun-dried" = Traditional outdoor drying (ISO 20715: Section 6.2.1)
 * - "Aged" = Post-production maturation period (ISO 20715: Section 6.3)
 * 
 * Flavor terminology follows ISO 20715:2023 Section 4 (Sensory description):
 * - Primary flavor categories: woody, earthy, sweet, fruity, spicy, aged, complex
 * - Specific sensory descriptors: camphor, dried-fruit, honey, smooth, mellow, date
 * - ISO "flavor wheel" used to standardize descriptors (ISO 20715: Annex A)
 */

var asianDarkTeas = [
    {
        teaName: "Lao Ban Zhang Raw Pu'er",
        originalName: "老班章生普洱",
        region: "Xishuangbanna, Yunnan, China",
        processingMethods: ["withered", "kill-green", "sun-dried", "compressed", "aged"],
        flavors: ["complex", "fruity", "woody", "sweet"],
        description: "The most famous and expensive raw pu'er from the iconic Lao Ban Zhang village, known for its intense flavor and aging potential (ISO: 'premium terroir-specific sheng pu'er')."
    },
    {
        teaName: "Menghai Factory 7572 Ripe Pu'er",
        originalName: "勐海茶厂7572熟普洱",
        region: "Menghai, Yunnan, China",
        processingMethods: ["withered", "fermented", "wet-piled", "compressed", "aged"],
        flavors: ["earthy", "woody", "smooth", "mellow"],
        description: "Classic benchmark ripe pu'er recipe created in 1975, with a balanced, smooth character (ISO: 'standard recipe shou pu'er')."
    },
    {
        teaName: "Yiwu Mountain Raw Pu'er",
        originalName: "易武山生普洱",
        region: "Yiwu, Yunnan, China",
        processingMethods: ["withered", "kill-green", "sun-dried", "compressed", "aged"],
        flavors: ["honey", "floral", "fruity", "complex"],
        description: "Prized raw pu'er known for its sweetness, gentle character and excellent aging potential (ISO: 'mountain-origin sheng pu'er')."
    },
    {
        teaName: "Liu Bao Hei Cha",
        originalName: "六堡黑茶",
        region: "Guangxi, China",
        processingMethods: ["withered", "fermented", "basket-aged", "aged"],
        flavors: ["woody", "earthy", "mellow", "sweet"],
        description: "Traditional dark tea packed in bamboo baskets, historically exported to Southeast Asia (ISO: 'basket-stored fermented dark tea')."
    },
    {
        teaName: "Bulang Mountain Raw Pu'er",
        originalName: "布朗山生普洱",
        region: "Bulang Mountains, Yunnan, China",
        processingMethods: ["withered", "kill-green", "sun-dried", "compressed", "aged"],
        flavors: ["woody", "fruity", "complex", "sweet"],
        description: "Powerful raw pu'er known for initial bitterness that transforms into sweetness with powerful qi energy (ISO: 'full-bodied sheng pu'er')."
    },
    {
        teaName: "Xiaguan Tuo Cha",
        originalName: "下关沱茶",
        region: "Dali, Yunnan, China",
        processingMethods: ["withered", "kill-green", "sun-dried", "compressed", "aged"],
        flavors: ["woody", "complex", "earthy", "sweet"],
        description: "Famous raw pu'er compressed into a bowl shape, traditionally with a smoky character (ISO: 'bowl-shaped compressed sheng')."
    },
    {
        teaName: "Jingmai Ancient Tree Raw Pu'er",
        originalName: "景迈古树生普洱",
        region: "Jingmai Mountain, Yunnan, China",
        processingMethods: ["withered", "kill-green", "sun-dried", "compressed", "aged"],
        flavors: ["floral", "honey", "fruity", "complex"],
        description: "Made from ancient tea trees in Jingmai, known for its balanced floral and fruity character (ISO: 'ancient-tree sheng pu'er')."
    },
    {
        teaName: "Fuzhuan Brick Tea",
        originalName: "茯砖茶",
        region: "Hunan, China",
        processingMethods: ["withered", "kill-green", "fermented", "compressed", "fungal-inoculation"],
        flavors: ["earthy", "sweet", "woody", "complex"],
        description: "Dark tea with distinctive yellow fungus (golden flowers) deliberately cultivated during processing (ISO: 'golden flower fermented tea')."
    },
    {
        teaName: "Xiaguan Iron Cake",
        originalName: "下关铁饼",
        region: "Dali, Yunnan, China",
        processingMethods: ["withered", "kill-green", "sun-dried", "heavily-compressed", "aged"],
        flavors: ["woody", "earthy", "fruity", "complex"],
        description: "Tightly compressed raw pu'er cake known for its strength, density, and slow aging potential (ISO: 'high-compression sheng pu'er')."
    },
    {
        teaName: "Menghai 7542 Raw Pu'er",
        originalName: "勐海7542生普洱",
        region: "Menghai, Yunnan, China",
        processingMethods: ["withered", "kill-green", "sun-dried", "compressed", "aged"],
        flavors: ["woody", "floral", "complex", "sweet"],
        description: "The most famous benchmark raw pu'er recipe, established in 1975, widely used for aging studies (ISO: 'classic recipe sheng pu'er')."
    },
    {
        teaName: "Qian Liang Cha",
        originalName: "千两茶",
        region: "Hunan, China",
        processingMethods: ["withered", "kill-green", "fermented", "compressed", "aged"],
        flavors: ["woody", "smooth", "sweet", "mellow"],
        description: "Traditional dark tea compressed into large baskets historically used as currency (name means '1000 tael tea') (ISO: 'large-format compressed hei cha')."
    },
    {
        teaName: "Kunming Aged Ripe Pu'er",
        originalName: "昆明陈年熟普洱",
        region: "Kunming, Yunnan, China",
        processingMethods: ["withered", "fermented", "wet-piled", "compressed", "dry-aged"],
        flavors: ["woody", "dried-fruit", "smooth", "mellow"],
        description: "Ripe pu'er aged in the dry climate of Kunming, developing clean, woody characteristics (ISO: 'dry-stored shou pu'er')."
    },
    {
        teaName: "Nannuo Mountain Raw Pu'er",
        originalName: "南糯山生普洱",
        region: "Nannuo Mountain, Yunnan, China",
        processingMethods: ["withered", "kill-green", "sun-dried", "compressed", "aged"],
        flavors: ["honey", "floral", "fruity", "sweet"],
        description: "Raw pu'er from a mountain known for honey-like sweetness and accessible character (ISO: 'honey-profile sheng pu'er')."
    },
    {
        teaName: "Tibetan Dark Tea",
        originalName: "藏茶",
        region: "Sichuan, China",
        processingMethods: ["withered", "kill-green", "fermented", "compressed", "aged"],
        flavors: ["earthy", "woody", "robust", "mellow"],
        description: "Dark tea traditionally exported to Tibet, often compressed into bricks and consumed with yak butter (ISO: 'border-trade fermented tea')."
    },
    {
        teaName: "Jinggu Aged Raw Pu'er",
        originalName: "景谷陈年生普洱",
        region: "Jinggu, Yunnan, China",
        processingMethods: ["withered", "kill-green", "sun-dried", "compressed", "long-aged"],
        flavors: ["woody", "dried-fruit", "complex", "sweet"],
        description: "Raw pu'er from Jinggu county that has been aged 20+ years, developing complex camphor notes (ISO: 'traditionally aged sheng pu'er')."
    },
    {
        teaName: "Anhua Hei Cha",
        originalName: "安化黑茶",
        region: "Hunan, China",
        processingMethods: ["withered", "kill-green", "fermented", "compressed", "aged"],
        flavors: ["woody", "sweet", "mellow", "smooth"],
        description: "One of China's oldest dark teas, traditionally compressed into various shapes for transport (ISO: 'traditional fermented hei cha')."
    },
    {
        teaName: "Yi Wu Cha Wang Raw Pu'er",
        originalName: "易武茶王生普洱",
        region: "Yiwu, Yunnan, China",
        processingMethods: ["withered", "kill-green", "sun-dried", "compressed", "aged"],
        flavors: ["honey", "floral", "complex", "sweet"],
        description: "Premium raw pu'er made from ancient trees in the 'Tea King' area of Yiwu, highly sought after by collectors (ISO: 'premium ancient-tree sheng pu'er')."
    },
    {
        teaName: "Guangxi Liu Pao",
        originalName: "广西六堡",
        region: "Guangxi, China",
        processingMethods: ["withered", "kill-green", "fermented", "basket-stored", "aged"],
        flavors: ["woody", "earthy", "mellow", "complex"],
        description: "Traditional dark tea aged in bamboo baskets, developing unique medicinal characteristics (ISO: 'bamboo-stored fermented tea')."
    },
    {
        teaName: "Mengku Ancient Tree Raw Pu'er",
        originalName: "勐库古树生普洱",
        region: "Shuangjiang, Yunnan, China",
        processingMethods: ["withered", "kill-green", "sun-dried", "compressed", "aged"],
        flavors: ["fruity", "woody", "complex", "sweet"],
        description: "Raw pu'er from a region known for fruity characteristics and powerful flavor (ISO: 'fruit-forward sheng pu'er')."
    },
    {
        teaName: "Zhu Yuan Ripe Pu'er",
        originalName: "竹园熟普洱",
        region: "Yunnan, China",
        processingMethods: ["withered", "fermented", "wet-piled", "bamboo-stuffed", "aged"],
        flavors: ["woody", "vegetal", "sweet", "earthy"],
        description: "Ripe pu'er stuffed and aged in bamboo tubes, absorbing unique bamboo fragrance (ISO: 'bamboo-influenced shou pu'er')."
    },
    {
        teaName: "Lincang Ancient Forest Raw Pu'er",
        originalName: "临沧古林生普洱",
        region: "Lincang, Yunnan, China",
        processingMethods: ["withered", "kill-green", "sun-dried", "compressed", "aged"],
        flavors: ["woody", "fruity", "complex", "sweet"],
        description: "Raw pu'er from one of the oldest tea-producing regions, known for initial bitterness that transforms to sweetness (ISO: 'old-growth sheng pu'er')."
    },
    {
        teaName: "Baishaxi Dark Brick",
        originalName: "白沙溪黑砖茶",
        region: "Hunan, China",
        processingMethods: ["withered", "kill-green", "fermented", "compressed", "aged"],
        flavors: ["woody", "sweet", "mellow", "earthy"],
        description: "Award-winning dark tea compressed into brick form, known for its mellow character (ISO: 'brick-compressed fermented tea')."
    },
    {
        teaName: "Menghai Imperial Tribute Ripe Pu'er",
        originalName: "勐海贡茶熟普洱",
        region: "Menghai, Yunnan, China",
        processingMethods: ["withered", "fermented", "wet-piled", "compressed", "aged"],
        flavors: ["dried-fruit", "earthy", "smooth", "sweet"],
        description: "Premium grade ripe pu'er made from highest quality leaves with meticulous fermentation (ISO: 'gongting-grade shou pu'er')."
    },
    {
        teaName: "Yibang Ancient Tree Raw Pu'er",
        originalName: "倚邦古树生普洱",
        region: "Yibang, Yunnan, China",
        processingMethods: ["withered", "kill-green", "sun-dried", "compressed", "aged"],
        flavors: ["floral", "sweet", "complex", "smooth"],
        description: "From one of the six famous ancient tea mountains, with a refined, gentle character (ISO: 'classical-region sheng pu'er')."
    },
    {
        teaName: "Hunan Tianjian Dark Tea",
        originalName: "湖南天尖黑茶",
        region: "Hunan, China",
        processingMethods: ["withered", "kill-green", "fermented", "shaped", "aged"],
        flavors: ["woody", "sweet", "smooth", "mellow"],
        description: "Tip-grade dark tea from Hunan, considered the highest quality of Hunan dark tea (ISO: 'premium-grade fermented tea')."
    },
    {
        teaName: "Wuliangshan Raw Pu'er",
        originalName: "无量山生普洱",
        region: "Wuliang Mountains, Yunnan, China",
        processingMethods: ["withered", "kill-green", "sun-dried", "compressed", "aged"],
        flavors: ["floral", "sweet", "smooth", "complex"],
        description: "Elegantly floral raw pu'er with less bitterness than other regions (ISO: 'floral-profile sheng pu'er')."
    },
    {
        teaName: "Sichuan Border Dark Tea",
        originalName: "川边黑茶",
        region: "Sichuan, China",
        processingMethods: ["withered", "kill-green", "fermented", "compressed", "aged"],
        flavors: ["earthy", "woody", "mellow", "robust"],
        description: "Dark tea traditionally produced in Ya'an, Sichuan, historically traded along the Tea Horse Road (ISO: 'border-region hei cha')."
    },
    {
        teaName: "Ailao Mountain Raw Pu'er",
        originalName: "哀牢山生普洱",
        region: "Ailao Mountains, Yunnan, China",
        processingMethods: ["withered", "kill-green", "sun-dried", "compressed", "aged"],
        flavors: ["fruity", "sweet", "floral", "complex"],
        description: "Raw pu'er from high altitude mountains, known for its fruitiness and energy (ISO: 'high-elevation sheng pu'er')."
    },
    {
        teaName: "Gongting Golden Bud Ripe Pu'er",
        originalName: "宫廷金芽熟普洱",
        region: "Yunnan, China",
        processingMethods: ["withered", "fermented", "wet-piled", "tip-grade", "compressed", "aged"],
        flavors: ["dried-fruit", "sweet", "smooth", "mellow"],
        description: "Highest grade ripe pu'er made exclusively from golden buds, yielding a remarkably smooth brew (ISO: 'imperial-grade shou pu'er')."
    },
    {
        teaName: "Bingdao Ancient Tree Raw Pu'er",
        originalName: "冰岛古树生普洱",
        region: "Mengku, Yunnan, China",
        processingMethods: ["withered", "kill-green", "sun-dried", "compressed", "aged"],
        flavors: ["honey", "woody", "complex", "sweet"],
        description: "Highly sought-after raw pu'er from a famous village known for intense honey flavor and cooling sensation (ISO: 'premium village-specific sheng pu'er')."
    },
    {
        teaName: "Liupao Tea",
        originalName: "六堡茶",
        region: "Wuzhou, Guangxi, China",
        processingMethods: ["withered", "kill-green", "fermented", "basket-aged", "aged"],
        flavors: ["woody", "earthy", "dried-fruit", "complex"],
        description: "Traditional dark tea named after the Liupao area, packed in bamboo baskets for aging (ISO: 'traditional basket-aged hei cha')."
    },
    {
        teaName: "Bangwei Wild Tree Raw Pu'er",
        originalName: "邦崴野生树生普洱",
        region: "Lancang, Yunnan, China",
        processingMethods: ["withered", "kill-green", "sun-dried", "compressed", "aged"],
        flavors: ["complex", "woody", "fruity", "sweet"],
        description: "Raw pu'er from semi-wild ancient trees with a distinctive wild character (ISO: 'wild-tree sheng pu'er')."
    },
    {
        teaName: "Hunan Gold Flower Brick Tea",
        originalName: "湖南金花砖茶",
        region: "Hunan, China",
        processingMethods: ["withered", "kill-green", "fermented", "compressed", "fungal-cultivation"],
        flavors: ["earthy", "sweet", "complex", "smooth"],
        description: "Dark tea intentionally cultivated with 'golden flower' fungus (Eurotium cristatum) for distinctive flavor (ISO: 'eurotium-inoculated fermented tea')."
    },
    {
        teaName: "Manzhuan Ancient Tree Raw Pu'er",
        originalName: "曼撒古树生普洱",
        region: "Manzhuan, Yunnan, China",
        processingMethods: ["withered", "kill-green", "sun-dried", "compressed", "aged"],
        flavors: ["honey", "floral", "complex", "sweet"],
        description: "Raw pu'er from one of the six ancient tea mountains, with elegant floral notes (ISO: 'ancient-mountain sheng pu'er')."
    },
    {
        teaName: "Tibetan Kang Brick Tea",
        originalName: "藏康砖茶",
        region: "Sichuan, China",
        processingMethods: ["withered", "kill-green", "fermented", "compressed", "aged"],
        flavors: ["earthy", "woody", "robust", "mellow"],
        description: "Dark tea specifically produced for the Tibetan market, compressed into large bricks (ISO: 'high-plateau fermented tea')."
    },
    {
        teaName: "Youle Ancient Tree Raw Pu'er",
        originalName: "攸乐古树生普洱",
        region: "Youle Mountain, Yunnan, China",
        processingMethods: ["withered", "kill-green", "sun-dried", "compressed", "aged"],
        flavors: ["floral", "sweet", "complex", "smooth"],
        description: "Raw pu'er from one of the six ancient tea mountains, known for its accessibility and sweetness (ISO: 'six-mountains sheng pu'er')."
    },
    {
        teaName: "Menghai Ripe Pu'er Tuo Cha",
        originalName: "勐海熟普洱沱茶",
        region: "Menghai, Yunnan, China",
        processingMethods: ["withered", "fermented", "wet-piled", "compressed", "aged"],
        flavors: ["earthy", "woody", "smooth", "sweet"],
        description: "Classic bowl-shaped ripe pu'er, often in small sizes perfect for single servings (ISO: 'nest-shaped shou pu'er')."
    },
    {
        teaName: "Xishuangbanna Wild Raw Pu'er",
        originalName: "西双版纳野生生普洱",
        region: "Xishuangbanna, Yunnan, China",
        processingMethods: ["withered", "kill-green", "sun-dried", "compressed", "aged"],
        flavors: ["complex", "woody", "fruity", "sweet"],
        description: "Raw pu'er from semi-wild tea trees in the tropical forests of Xishuangbanna (ISO: 'tropical-forest sheng pu'er')."
    },
    {
        teaName: "Haiwan Old Comrade Ripe Pu'er",
        originalName: "海湾老同志熟普洱",
        region: "Yunnan, China",
        processingMethods: ["withered", "fermented", "wet-piled", "compressed", "aged"],
        flavors: ["smooth", "woody", "dried-fruit", "sweet"],
        description: "Popular ripe pu'er created by a former master craftsman from Menghai Tea Factory (ISO: 'master-crafted shou pu'er')."
    },
    {
        teaName: "Yongde Blue Label Raw Pu'er",
        originalName: "永德蓝印生普洱",
        region: "Yongde, Yunnan, China",
        processingMethods: ["withered", "kill-green", "sun-dried", "compressed", "aged"],
        flavors: ["woody", "complex", "robust", "sweet"],
        description: "Strong, bitter raw pu'er that develops powerful sweetness with aging, from Yongde county (ISO: 'robust-profile sheng pu'er')."
    },
    {
        teaName: "Zhangjiajie Tian Jian",
        originalName: "张家界天尖",
        region: "Hunan, China",
        processingMethods: ["withered", "kill-green", "fermented", "rolled", "aged"],
        flavors: ["woody", "sweet", "smooth", "mellow"],
        description: "Premium dark tea from northwestern Hunan, rolled into stick-like shapes (ISO: 'stick-shaped fermented tea')."
    },
    {
        teaName: "Yiwu Mahei Village Raw Pu'er",
        originalName: "易武麻黑村生普洱",
        region: "Yiwu, Yunnan, China",
        processingMethods: ["withered", "kill-green", "sun-dried", "compressed", "aged"],
        flavors: ["honey", "floral", "complex", "sweet"],
        description: "Highly regarded village-specific raw pu'er from Yiwu, known for its refined honey character (ISO: 'single-village sheng pu'er')."
    },
    {
        teaName: "Cangyuan Border Raw Pu'er",
        originalName: "沧源边境生普洱",
        region: "Cangyuan, Yunnan, China",
        processingMethods: ["withered", "kill-green", "sun-dried", "compressed", "aged"],
        flavors: ["woody", "sweet", "complex", "fruity"],
        description: "Raw pu'er from trees growing near the Myanmar border, with distinctive wild characteristics (ISO: 'border-region sheng pu'er')."
    },
    {
        teaName: "Guangxi Mini Dark Tea Tuo",
        originalName: "广西迷你黑茶沱",
        region: "Guangxi, China",
        processingMethods: ["withered", "kill-green", "fermented", "compressed", "aged"],
        flavors: ["woody", "earthy", "sweet", "mellow"],
        description: "Small compressed tuo cha of dark tea from Guangxi, convenient for single servings (ISO: 'mini-compressed hei cha')."
    },
    {
        teaName: "Kunlu Mountain Raw Pu'er",
        originalName: "昆仑山生普洱",
        region: "Lincang, Yunnan, China",
        processingMethods: ["withered", "kill-green", "sun-dried", "compressed", "aged"],
        flavors: ["woody", "complex", "robust", "sweet"],
        description: "Raw pu'er from high altitude Kunlu mountain area, known for its strong character (ISO: 'high-mountain sheng pu'er')."
    },
    {
        teaName: "Chen Xiang Ripe Pu'er",
        originalName: "陈香熟普洱",
        region: "Yunnan, China",
        processingMethods: ["withered", "fermented", "wet-piled", "compressed", "long-aged"],
        flavors: ["woody", "dried-fruit", "smooth", "mellow"],
        description: "Well-aged ripe pu'er with developed 'chen xiang' (aged aroma) from traditional storage (ISO: 'traditionally aged shou pu'er')."
    },
    {
        teaName: "Simao Wild Tree Raw Pu'er",
        originalName: "思茅野树生普洱",
        region: "Simao, Yunnan, China",
        processingMethods: ["withered", "kill-green", "sun-dried", "compressed", "aged"],
        flavors: ["woody", "complex", "fruity", "sweet"],
        description: "Raw pu'er from semi-wild arbor trees in Simao district (now called Pu'er City) (ISO: 'semi-wild tree sheng pu'er')."
    },
    {
        teaName: "Hunan Brick Dark Tea",
        originalName: "湖南黑砖茶",
        region: "Hunan, China",
        processingMethods: ["withered", "kill-green", "fermented", "compressed", "aged"],
        flavors: ["earthy", "woody", "mellow", "smooth"],
        description: "Traditional dark tea compressed into brick form, historically exported to border regions (ISO: 'border-trade hei cha')."
    },
    {
        teaName: "Lancang Ancient Tree Raw Pu'er",
        originalName: "澜沧古树生普洱",
        region: "Lancang, Yunnan, China",
        processingMethods: ["withered", "kill-green", "sun-dried", "compressed", "aged"],
        flavors: ["floral", "woody", "complex", "sweet"],
        description: "Raw pu'er from the birthplace of tea cultivation, with ancient trees over 800 years old (ISO: 'heritage-tree sheng pu'er')."
    },
    {
        teaName: "Xiaguan FT Sheng Tuo",
        originalName: "下关FT生沱",
        region: "Dali, Yunnan, China",
        processingMethods: ["withered", "kill-green", "sun-dried", "compressed", "aged"],
        flavors: ["woody", "earthy", "robust", "complex"],
        description: "Classic raw pu'er tuo cha with Xiaguan's signature profile, popular for aging (ISO: 'factory-production sheng tuo')."
    },
    {
        teaName: "Qianjiazhai Wild Raw Pu'er",
        originalName: "千家寨野生生普洱",
        region: "Ailao Mountains, Yunnan, China",
        processingMethods: ["withered", "kill-green", "sun-dried", "compressed", "aged"],
        flavors: ["complex", "woody", "floral", "fruity"],
        description: "Raw pu'er from remote forest area with wild and semi-wild ancient tea trees (ISO: 'wild-arbor sheng pu'er')."
    }
];

// Export the data
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { asianDarkTeas };
} 