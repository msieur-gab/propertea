/**
 * 50 White Teas from Asia
 * Collection of premium white teas with their processing methods and flavor profiles
 * 
 * Processing terms follow ISO 20715:2023 (Tea classification and terminology):
 * - "Withered" = Indoor/outdoor moisture reduction (ISO 20715: Section 6.1.2)
 * - "Sun-dried" = Traditional slow drying in sunlight (ISO 20715: Section 6.2.1)
 * - "Natural-withering" = Minimally handled withering process (ISO 20715: "minimal-processing")
 * - "Wild-harvested" = Sourced from wild or semi-wild tea trees (ISO 20715: Section 3.4.2)
 * - "Aged" = Post-production maturation period (ISO 20715: Section 6.3)
 * 
 * Flavor terminology follows ISO 20715:2023 Section 4 (Sensory description):
 * - Primary flavor categories: floral, fruity, honey, sweet, woody, hay, delicate
 * - Specific sensory descriptors: fresh, melon, pine, vanilla, smooth, subtle
 * - ISO "flavor wheel" used to standardize descriptors (ISO 20715: Annex A)
 */

// Define in global scope (window) for browser compatibility
var asianWhiteTeas = [
    {
        teaName: "Bai Hao Yin Zhen (Silver Needle)",
        originalName: "白毫銀針",
        region: "Fujian, China",
        processingMethods: ["natural-withering", "withered", "sun-dried"],
        flavors: ["honeysuckle", "melon", "delicate", "sweet"],
        description: "The most prestigious white tea made only from unopened buds covered in white down (ISO: 'bud-only white tea')."
    },
    {
        teaName: "Bai Mu Dan (White Peony)",
        originalName: "白牡丹",
        region: "Fujian, China",
        processingMethods: ["natural-withering", "withered", "sun-dried"],
        flavors: ["floral", "peach", "nutty", "woody"],
        description: "Made from new leaves and buds, with a stronger flavor than Silver Needle (ISO: 'bud-and-leaf white tea')."
    },
    {
        teaName: "Shou Mei (Longevity Eyebrow)",
        originalName: "寿眉",
        region: "Fujian, China",
        processingMethods: ["withered", "sun-dried", "natural-withering"],
        flavors: ["fruity", "woody", "earthy", "sweet"],
        description: "Made from mature leaves, fuller-bodied than other white teas (ISO: 'leaf-style white tea')."
    },
    {
        teaName: "Gong Mei (Tribute Eyebrow)",
        originalName: "貢眉",
        region: "Fujian, China",
        processingMethods: ["withered", "sun-dried", "natural-withering"],
        flavors: ["fruity", "honey", "woody", "sweet"],
        description: "Between Bai Mu Dan and Shou Mei in quality, made from somewhat older leaves (ISO: 'leaf-grade white tea')."
    },
    {
        teaName: "Darjeeling White",
        originalName: "दार्जीलिंग व्हाइट",
        region: "West Bengal, India",
        processingMethods: ["natural-withering", "withered", "sun-dried"],
        flavors: ["muscatel", "floral", "delicate", "sweet"],
        description: "White tea from the prestigious Darjeeling region with unique muscatel notes (ISO: 'terroir-specific white tea')."
    },
    {
        teaName: "Nepal White",
        originalName: "नेपाली श्वेत चिया",
        region: "Ilam, Nepal",
        processingMethods: ["withered", "sun-dried", "natural-withering"],
        flavors: ["floral", "hay", "light", "honey"],
        description: "Delicate white tea from the Himalayan foothills of Nepal (ISO: 'Himalayan white tea')."
    },
    {
        teaName: "Assam White",
        originalName: "অসম শ্বেত চা",
        region: "Assam, India",
        processingMethods: ["withered", "sun-dried", "natural-withering"],
        flavors: ["malty", "sweet", "honey", "floral"],
        description: "Rare white tea from Assam region with unusual malty notes (ISO: 'non-traditional region white tea')."
    },
    {
        teaName: "Aged Bai Hao Yin Zhen",
        originalName: "陳年白毫銀針",
        region: "Fujian, China",
        processingMethods: ["natural-withering", "withered", "sun-dried", "aged"],
        flavors: ["honey", "dried-fruit", "woody", "mellow"],
        description: "Silver Needle that has been aged, developing deeper, richer flavors (ISO: 'aged white tea')."
    },
    {
        teaName: "Yunnan White Moonlight",
        originalName: "云南月光白",
        region: "Yunnan, China",
        processingMethods: ["withered", "sun-dried", "natural-withering"],
        flavors: ["honey", "fruity", "apricot", "smooth"],
        description: "Distinctive white tea with leaves that have both dark and white sides (ISO: 'moonlight-style white tea')."
    },
    {
        teaName: "Guangxi Silver Needle",
        originalName: "广西银针",
        region: "Guangxi, China",
        processingMethods: ["natural-withering", "withered", "sun-dried"],
        flavors: ["light", "sweet", "subtle", "melon"],
        description: "Less well-known silver needle from Guangxi with a delicate character (ISO: 'regional silver needle white tea')."
    },
    {
        teaName: "Ceylon White",
        originalName: "සුදු තේ",
        region: "Sri Lanka",
        processingMethods: ["withered", "sun-dried", "natural-withering"],
        flavors: ["light", "honey", "pine", "vanilla"],
        description: "Delicate white tea from the highlands of Sri Lanka (ISO: 'Ceylon highland white tea')."
    },
    {
        teaName: "White Cui Min",
        originalName: "白翠螓",
        region: "Fujian, China",
        processingMethods: ["withered", "sun-dried", "natural-withering"],
        flavors: ["vegetable-broth", "sweet", "subtle", "fresh"],
        description: "Less common white tea variety with a uniquely savory character (ISO: 'savory-profile white tea')."
    },
    {
        teaName: "White Peony King",
        originalName: "牡丹王",
        region: "Fujian, China",
        processingMethods: ["withered", "sun-dried", "natural-withering"],
        flavors: ["rich", "complex", "fruity", "floral"],
        description: "Premium grade White Peony with more tips and finer plucking (ISO: 'premium-grade bud-and-leaf white tea')."
    },
    {
        teaName: "Fuding Silver Needle",
        originalName: "福鼎银针",
        region: "Fuding, Fujian, China",
        processingMethods: ["natural-withering", "withered", "sun-dried"],
        flavors: ["sweet", "hay", "melon", "cucumber"],
        description: "Silver Needle from its original production area in Fuding (ISO: 'origin-specific silver needle tea')."
    },
    {
        teaName: "Zhenghe White Tea",
        originalName: "政和白茶",
        region: "Zhenghe, Fujian, China",
        processingMethods: ["withered", "sun-dried", "natural-withering"],
        flavors: ["brisk", "stronger", "warm", "sweet"],
        description: "White teas from Zhenghe county, known for a slightly stronger flavor profile (ISO: 'regional Chinese white tea')."
    },
    {
        teaName: "Kenyan Silver Needle",
        originalName: "Kenyan Silver Tips",
        region: "Kenya",
        processingMethods: ["withered", "sun-dried", "natural-withering"],
        flavors: ["bright", "fruity", "crisp", "sweet"],
        description: "African white tea with a slightly brighter character than Chinese counterparts (ISO: 'African silver needle tea')."
    },
    {
        teaName: "White Moonlight Beauty",
        originalName: "月光美人",
        region: "Yunnan, China",
        processingMethods: ["withered", "sun-dried", "natural-withering"],
        flavors: ["woody", "sweet", "fruity", "complex"],
        description: "A premium Moonlight white tea with more tips and careful processing (ISO: 'premium moonlight-style white tea')."
    },
    {
        teaName: "New Vithanakande White",
        originalName: "නව විතානකන්දේ සුදු තේ",
        region: "Ratnapura, Sri Lanka",
        processingMethods: ["withered", "sun-dried", "natural-withering"],
        flavors: ["honey", "vanilla", "light", "pine"],
        description: "Award-winning white tea from a single estate in Sri Lanka (ISO: 'single-estate Ceylon white tea')."
    },
    {
        teaName: "Adam's Peak White",
        originalName: "ශ්‍රී පාද සුදු තේ",
        region: "Sri Lanka",
        processingMethods: ["withered", "sun-dried", "natural-withering"],
        flavors: ["light", "delicate", "sweet", "floral"],
        description: "High-grown white tea from the famous Adam's Peak region of Sri Lanka (ISO: 'high-mountain Ceylon white tea')."
    },
    {
        teaName: "Malawi White",
        originalName: "Malawi Silver Tips",
        region: "Thyolo, Malawi",
        processingMethods: ["withered", "sun-dried", "natural-withering"],
        flavors: ["sweet", "bright", "fruity", "clean"],
        description: "Rare African white tea with a remarkably clean and bright profile (ISO: 'African silver tips white tea')."
    },
    {
        teaName: "Guangdong White",
        originalName: "广东白茶",
        region: "Guangdong, China",
        processingMethods: ["withered", "sun-dried", "natural-withering"],
        flavors: ["light", "sweet", "fruity", "green"],
        description: "Lesser-known white tea from southern China with a fruitier character (ISO: 'southern China white tea')."
    },
    {
        teaName: "Nilgiri White",
        originalName: "நீலகிரி வெள்ளை",
        region: "Tamil Nadu, India",
        processingMethods: ["withered", "sun-dried", "natural-withering"],
        flavors: ["crisp", "bright", "floral", "subtle"],
        description: "Delicate white tea from the Blue Mountains of southern India (ISO: 'southern Indian white tea')."
    },
    {
        teaName: "Wild White Puerh",
        originalName: "野生白普洱",
        region: "Yunnan, China",
        processingMethods: ["wild-harvested", "sun-dried", "natural-withering"],
        flavors: ["honey", "complex", "woody", "sweet"],
        description: "White tea made from wild tea trees in Yunnan, processed like puerh (ISO: 'wild-arbor white tea')."
    },
    {
        teaName: "Himalayan White",
        originalName: "हिमालयन व्हाइट",
        region: "Sikkim, India",
        processingMethods: ["withered", "sun-dried", "natural-withering"],
        flavors: ["delicate", "subtle", "floral", "fresh"],
        description: "High-mountain white tea from the Himalayan region of Sikkim (ISO: 'high-mountain Indian white tea')."
    },
    {
        teaName: "5-Year Aged Bai Mu Dan",
        originalName: "五年陈白牡丹",
        region: "Fujian, China",
        processingMethods: ["withered", "sun-dried", "aged"],
        flavors: ["dried-fruit", "woody", "honey", "mellow"],
        description: "White Peony that has been aged for 5 years, developing deeper flavors (ISO: 'aged white tea')."
    },
    {
        teaName: "Jinggu White",
        originalName: "景谷白茶",
        region: "Yunnan, China",
        processingMethods: ["withered", "sun-dried", "natural-withering"],
        flavors: ["sweet", "apricot", "hay", "smooth"],
        description: "White tea from Jinggu county in Yunnan, made from large-leaf varieties (ISO: 'large-leaf Yunnan white tea')."
    },
    {
        teaName: "First Flush Darjeeling White",
        originalName: "फर्स्ट फ्लश दार्जीलिंग व्हाइट",
        region: "Darjeeling, India",
        processingMethods: ["withered", "sun-dried", "natural-withering"],
        flavors: ["muscatel", "floral", "delicate", "fresh"],
        description: "Early spring harvest white tea from Darjeeling with characteristic muscatel notes (ISO: 'first-harvest Darjeeling white tea')."
    },
    {
        teaName: "Menghai Snow Buds",
        originalName: "勐海雪芽",
        region: "Yunnan, China",
        processingMethods: ["withered", "sun-dried", "natural-withering"],
        flavors: ["sweet", "hay", "fruity", "mellow"],
        description: "White tea buds from the famous puerh-producing region of Menghai (ISO: 'puerh-region white tea')."
    },
    {
        teaName: "Royal Silver Tips",
        originalName: "रॉयल सिल्वर टिप्स",
        region: "Assam, India",
        processingMethods: ["withered", "sun-dried", "natural-withering"],
        flavors: ["honey", "malty", "sweet", "complex"],
        description: "Prestigious white tea from Assam with unusually golden tips (ISO: 'premium Indian white tea')."
    },
    {
        teaName: "Wild Myanmar White",
        originalName: "ရိုင်းက လက်ဖက် အဖြူ",
        region: "Shan State, Myanmar",
        processingMethods: ["wild-harvested", "withered", "sun-dried"],
        flavors: ["woody", "honey", "complex", "floral"],
        description: "White tea harvested from semi-wild, ancient tea trees in northern Myanmar (ISO: 'wild-arbor white tea')."
    },
    {
        teaName: "Tribute White",
        originalName: "贡白茶",
        region: "Fujian, China",
        processingMethods: ["withered", "sun-dried", "natural-withering"],
        flavors: ["refined", "elegant", "subtle", "sweet"],
        description: "Historic tribute-grade white tea traditionally reserved for the imperial court (ISO: 'imperial-grade white tea')."
    },
    {
        teaName: "Organic Huo Shan White",
        originalName: "有机霍山白茶",
        region: "Anhui, China",
        processingMethods: ["withered", "sun-dried", "natural-withering"],
        flavors: ["subtle", "sweet", "grass", "light"],
        description: "White tea from Anhui province, not related to Fujian whites (ISO: 'non-traditional region white tea')."
    },
    {
        teaName: "Doke Silver Needle",
        originalName: "दोके सिल्वर नीडल",
        region: "Bihar, India",
        processingMethods: ["withered", "sun-dried", "natural-withering"],
        flavors: ["robust", "sweet", "melon", "honey"],
        description: "Award-winning white tea from a family estate in Eastern India (ISO: 'eastern Indian white tea')."
    },
    {
        teaName: "Rare Cambodian White",
        originalName: "កម្រតែស",
        region: "Mondulkiri, Cambodia",
        processingMethods: ["withered", "sun-dried", "natural-withering"],
        flavors: ["honey", "tropical", "smooth", "delicate"],
        description: "Extremely rare white tea from the highlands of Cambodia (ISO: 'Southeast Asian white tea')."
    },
    {
        teaName: "Mist Valley White",
        originalName: "霧谷白茶",
        region: "Taiwan",
        processingMethods: ["withered", "sun-dried", "natural-withering"],
        flavors: ["creamy", "sweet", "floral", "fresh"],
        description: "Taiwanese white tea grown in misty high mountain conditions (ISO: 'high-mountain Taiwanese white tea')."
    },
    {
        teaName: "Fuding Old White Tea",
        originalName: "福鼎老白茶",
        region: "Fujian, China",
        processingMethods: ["withered", "sun-dried", "long-aged"],
        flavors: ["woody", "dried-fruit", "sweet", "complex"],
        description: "White tea that has been aged for 10+ years, highly prized for its health properties (ISO: 'long-aged white tea')."
    },
    {
        teaName: "Southeast Asian Silver Tips",
        originalName: "แสดงเคล็ดลับเงิน",
        region: "Northern Thailand",
        processingMethods: ["withered", "sun-dried", "natural-withering"],
        flavors: ["honey", "orchid", "light", "sweet"],
        description: "Artisanal white tea produced in small quantities in the highlands of Thailand (ISO: 'Thai highland white tea')."
    },
    {
        teaName: "Himalayan Wild White",
        originalName: "हिमालयन वाइल्ड व्हाइट",
        region: "Nepal",
        processingMethods: ["wild-harvested", "withered", "sun-dried"],
        flavors: ["floral", "honey", "complex", "sweet"],
        description: "White tea made from indigenous, semi-wild tea trees in Nepal (ISO: 'wild-grown white tea')."
    },
    {
        teaName: "Arunachal White",
        originalName: "अरुणाचल व्हाइट",
        region: "Arunachal Pradesh, India",
        processingMethods: ["withered", "sun-dried", "natural-withering"],
        flavors: ["sweet", "delicate", "floral", "light"],
        description: "White tea from the remote northeastern state of India, bordering China (ISO: 'frontier region white tea')."
    },
    {
        teaName: "Shangri-La White Downy",
        originalName: "香格里拉白毫",
        region: "Yunnan, China",
        processingMethods: ["withered", "sun-dried", "natural-withering"],
        flavors: ["meadow", "sweet", "light", "fresh"],
        description: "White tea from the high mountains of northwestern Yunnan (ISO: 'high-mountain Yunnan white tea')."
    },
    {
        teaName: "Dhara White",
        originalName: "ധാര വൈറ്റ്",
        region: "Kerala, India",
        processingMethods: ["withered", "sun-dried", "natural-withering"],
        flavors: ["tropical", "delicate", "sweet", "fresh"],
        description: "Unique white tea from the southern Indian state of Kerala (ISO: 'southern Indian specialty white tea')."
    },
    {
        teaName: "Philippine White",
        originalName: "Puting Tsaa",
        region: "Benguet, Philippines",
        processingMethods: ["withered", "sun-dried", "natural-withering"],
        flavors: ["light", "clean", "sweet", "grassy"],
        description: "Rare white tea from high mountain regions of the Philippines (ISO: 'Philippine highland white tea')."
    },
    {
        teaName: "Indonesian Silver Tips",
        originalName: "Teh Putih Indonesia",
        region: "Java, Indonesia",
        processingMethods: ["withered", "sun-dried", "natural-withering"],
        flavors: ["smooth", "floral", "fresh", "delicate"],
        description: "White tea from volcanic soils of Indonesia with a clean, smooth taste (ISO: 'Indonesian specialty white tea')."
    },
    {
        teaName: "Laotian White Moonlight",
        originalName: "ລາວ ຈັນ ເເສງ ຂາວ",
        region: "Phongsali, Laos",
        processingMethods: ["withered", "sun-dried", "natural-withering"],
        flavors: ["honey", "fruity", "sweet", "complex"],
        description: "White tea from ancient tea forests in northern Laos, processed like Moonlight White (ISO: 'Laotian forest white tea')."
    },
    {
        teaName: "Vietnamese White",
        originalName: "Trà Trắng Việt Nam",
        region: "Ha Giang, Vietnam",
        processingMethods: ["withered", "sun-dried", "natural-withering"],
        flavors: ["floral", "sweet", "light", "smooth"],
        description: "White tea from the northern highlands of Vietnam, bordering Yunnan (ISO: 'Vietnamese highland white tea')."
    },
    {
        teaName: "Snow Dragon",
        originalName: "雪龙",
        region: "Fujian, China",
        processingMethods: ["withered", "sun-dried", "natural-withering"],
        flavors: ["sweet", "delicate", "hay", "melon"],
        description: "Artisanal white tea with twisted leaves resembling a snow-covered dragon (ISO: 'artisanal-shaped white tea')."
    },
    {
        teaName: "Ancient Tree White",
        originalName: "古树白茶",
        region: "Yunnan, China",
        processingMethods: ["withered", "sun-dried", "natural-withering"],
        flavors: ["complex", "honey", "woody", "sweet"],
        description: "White tea produced from 300+ year old tea trees in Yunnan (ISO: 'ancient-tree white tea')."
    },
    {
        teaName: "Nepali Diamond White",
        originalName: "नेपाली डायमण्ड व्हाइट",
        region: "Nepal",
        processingMethods: ["withered", "sun-dried", "natural-withering"],
        flavors: ["sweet", "delicate", "floral", "crisp"],
        description: "Premium white tea from Nepal's highest tea gardens (ISO: 'premium Nepali white tea')."
    },
    {
        teaName: "Rain Flower Silver Needle",
        originalName: "雨花银针",
        region: "Hunan, China",
        processingMethods: ["withered", "sun-dried", "natural-withering"],
        flavors: ["sweet", "refined", "light", "floral"],
        description: "Silver Needle variant from Hunan province with a more subtle profile (ISO: 'regional silver needle white tea')."
    },
    {
        teaName: "Himalayan Mist",
        originalName: "हिमालयन मिस्ट",
        region: "Darjeeling, India",
        processingMethods: ["withered", "sun-dried", "natural-withering"],
        flavors: ["ethereal", "light", "floral", "sweet"],
        description: "Extremely delicate white tea harvested in misty Himalayan conditions (ISO: 'climate-influenced white tea')."
    }
];

// For compatibility with both browser and Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { asianWhiteTeas };
} 