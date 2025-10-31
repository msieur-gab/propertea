#!/bin/bash

# Tea Analysis API Test Script
# Tests multiple teas and saves JSON outputs to _output folder

# Configuration
API_URL="http://localhost:8888/.netlify/functions/analyze"
OUTPUT_DIR="_output"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Create output directory
mkdir -p "$OUTPUT_DIR"

echo "🫖 Tea Analysis API - Test Suite"
echo "================================"
echo "API URL: $API_URL"
echo "Output Directory: $OUTPUT_DIR"
echo ""

# Function to test a tea
test_tea() {
    local tea_json="$1"
    local tea_name=$(echo "$tea_json" | jq -r '.name' 2>/dev/null || echo "unknown")

    echo "Testing: $tea_name..."

    # Send to API
    response=$(curl -s -X POST "$API_URL" \
        -H "Content-Type: application/json" \
        -d "$tea_json")

    # Check if successful
    success=$(echo "$response" | jq -r '.success' 2>/dev/null)

    if [ "$success" = "true" ]; then
        # Sanitize filename
        filename=$(echo "$tea_name" | tr ' ' '_' | tr -cd '[:alnum:]_-')
        filepath="$OUTPUT_DIR/${filename}.json"

        # Save output
        echo "$response" | jq . > "$filepath"
        echo "✅ Saved to: $filepath"
    else
        echo "❌ Error: $(echo "$response" | jq -r '.error // "Unknown error"')"
    fi

    echo ""
}

# Test 1: Ali Shan Oolong
test_tea '{
  "name": "Ali Shan Oolong",
  "originalName": "阿里山烏龍 (Ālǐshān Wūlóng)",
  "type": "oolong",
  "origin": "Ali Mountain, Taiwan",
  "caffeineLevel": 3.5,
  "lTheanineLevel": 6.5,
  "flavorProfile": [
    "floral",
    "buttery",
    "sweet",
    "creamy",
    "honeysuckle"
  ],
  "processingMethods": [
    "withered",
    "partial-oxidation",
    "ball-rolled",
    "minimal-roast"
  ],
  "geography": {
    "country": "Taiwan",
    "province": "Chiayi County",
    "altitude": 1500,
    "humidity": 80,
    "latitude": 23.47,
    "longitude": 120.8,
    "temperature": 14.8,
    "solarRadiation": 180
  }
}'

# Test 2: Sencha Green Tea
test_tea '{
  "name": "Sencha",
  "originalName": "煎茶 (Sencha)",
  "type": "green",
  "origin": "Shizuoka, Japan",
  "caffeineLevel": 5,
  "lTheanineLevel": 7,
  "flavorProfile": [
    "grassy",
    "sweet",
    "vegetal",
    "umami",
    "marine"
  ],
  "processingMethods": [
    "steamed",
    "rolled",
    "dried"
  ],
  "geography": {
    "country": "Japan",
    "province": "Shizuoka",
    "altitude": 400,
    "humidity": 75,
    "latitude": 34.77,
    "longitude": 138.38,
    "temperature": 16,
    "harvestMonth": 4
  }
}'

# Test 3: Assam Black Tea
test_tea '{
  "name": "Assam Black Tea",
  "originalName": "আসামিজ চাহ (Assami Chai)",
  "type": "black",
  "origin": "Assam, India",
  "caffeineLevel": 8,
  "lTheanineLevel": 3,
  "flavorProfile": [
    "malty",
    "earthy",
    "bold",
    "chocolate",
    "spicy"
  ],
  "processingMethods": [
    "withered",
    "rolled",
    "oxidized",
    "dried"
  ],
  "geography": {
    "country": "India",
    "province": "Assam",
    "altitude": 150,
    "humidity": 85,
    "latitude": 26.2,
    "longitude": 93.6,
    "temperature": 25,
    "harvestMonth": 6
  }
}'

# Test 4: White Peony (Bai Mu Dan)
test_tea '{
  "name": "White Peony",
  "originalName": "白牡丹 (Báimǔdān)",
  "type": "white",
  "origin": "Fujian, China",
  "caffeineLevel": 2,
  "lTheanineLevel": 7,
  "flavorProfile": [
    "sweet",
    "honey",
    "delicate",
    "fruity",
    "floral"
  ],
  "processingMethods": [
    "withered",
    "dried"
  ],
  "geography": {
    "country": "China",
    "province": "Fujian",
    "location": "Zhenghe County",
    "altitude": 600,
    "humidity": 78,
    "latitude": 27.5,
    "longitude": 119.2,
    "temperature": 18,
    "solarRadiation": 140,
    "harvestMonth": 3
  }
}'

# Test 5: Tie Guan Yin (Iron Goddess)
test_tea '{
  "name": "Tie Guan Yin",
  "originalName": "鐵觀音 (Tiěguānyīn)",
  "type": "oolong",
  "origin": "Anxi, China",
  "caffeineLevel": 5,
  "lTheanineLevel": 6,
  "flavorProfile": [
    "floral",
    "orchid",
    "fruity",
    "roasted",
    "creamy"
  ],
  "processingMethods": [
    "withered",
    "bruised",
    "partially-oxidized",
    "rolled",
    "roasted"
  ],
  "geography": {
    "country": "China",
    "province": "Fujian",
    "location": "Anxi County",
    "altitude": 700,
    "humidity": 80,
    "latitude": 25.1,
    "longitude": 118.3,
    "temperature": 18,
    "solarRadiation": 170,
    "harvestMonth": 5
  }
}'

# Test 6: Keemun Black
test_tea '{
  "name": "Keemun Black",
  "originalName": "祁門紅茶 (Qímén Hóngchá)",
  "type": "black",
  "origin": "Anhui, China",
  "caffeineLevel": 7,
  "lTheanineLevel": 4,
  "flavorProfile": [
    "fruity",
    "wine-like",
    "floral",
    "chocolate",
    "smooth"
  ],
  "processingMethods": [
    "withered",
    "rolled",
    "oxidized",
    "dried"
  ],
  "geography": {
    "country": "China",
    "province": "Anhui",
    "location": "Qimen County",
    "altitude": 500,
    "humidity": 75,
    "latitude": 29.8,
    "longitude": 117.4,
    "temperature": 16,
    "solarRadiation": 160,
    "harvestMonth": 8
  }
}'

# Test 7: Dragon Well (Longjing)
test_tea '{
  "name": "Dragon Well",
  "originalName": "龍井茶 (Lóngjǐng Chá)",
  "type": "green",
  "origin": "Hangzhou, China",
  "caffeineLevel": 4,
  "lTheanineLevel": 6,
  "flavorProfile": [
    "grassy",
    "sweet",
    "chestnut",
    "honey",
    "floral"
  ],
  "processingMethods": [
    "pan-fired",
    "dried",
    "hand-shaped"
  ],
  "geography": {
    "country": "China",
    "province": "Zhejiang",
    "location": "Hangzhou",
    "altitude": 300,
    "humidity": 75,
    "latitude": 30.2,
    "longitude": 120.1,
    "temperature": 17,
    "solarRadiation": 175,
    "harvestMonth": 4
  }
}'

# Test 8: Darjeeling Black Tea
test_tea '{
  "name": "Darjeeling First Flush",
  "originalName": "Darjeeling",
  "type": "black",
  "origin": "Darjeeling, India",
  "caffeineLevel": 6,
  "lTheanineLevel": 5,
  "flavorProfile": [
    "fruity",
    "floral",
    "muscatel",
    "sweet",
    "light"
  ],
  "processingMethods": [
    "withered",
    "rolled",
    "oxidized",
    "dried"
  ],
  "geography": {
    "country": "India",
    "province": "West Bengal",
    "location": "Darjeeling",
    "altitude": 1250,
    "humidity": 82,
    "latitude": 27.05,
    "longitude": 88.26,
    "temperature": 11,
    "solarRadiation": 165,
    "harvestMonth": 3
  }
}'

# Test 9: Gyokuro Green Tea
test_tea '{
  "name": "Gyokuro",
  "originalName": "玉露 (Gyokuro)",
  "type": "green",
  "origin": "Uji, Japan",
  "caffeineLevel": 6,
  "lTheanineLevel": 8,
  "flavorProfile": [
    "sweet",
    "umami",
    "creamy",
    "marine",
    "grass"
  ],
  "processingMethods": [
    "shaded-grown",
    "steamed",
    "rolled",
    "dried"
  ],
  "geography": {
    "country": "Japan",
    "province": "Kyoto",
    "location": "Uji",
    "altitude": 300,
    "humidity": 80,
    "latitude": 34.85,
    "longitude": 135.8,
    "temperature": 15,
    "solarRadiation": 120,
    "harvestMonth": 5
  }
}'

# Test 10: Pu-erh Sheng
test_tea '{
  "name": "Pu-erh Sheng",
  "originalName": "普洱生茶 (Pǔ\'ěr Shēng Chá)",
  "type": "puerh",
  "subType": "sheng",
  "origin": "Yunnan, China",
  "caffeineLevel": 5,
  "lTheanineLevel": 5,
  "flavorProfile": [
    "earthy",
    "woody",
    "aged",
    "sweet",
    "mineral"
  ],
  "processingMethods": [
    "withered",
    "sun-dried",
    "pressed",
    "aged"
  ],
  "geography": {
    "country": "China",
    "province": "Yunnan",
    "location": "Puer City",
    "altitude": 1200,
    "humidity": 75,
    "latitude": 22.8,
    "longitude": 100.9,
    "temperature": 18,
    "solarRadiation": 170,
    "harvestMonth": 3
  }
}'

# Summary
echo ""
echo "================================"
echo "✅ Test Suite Completed!"
echo "================================"
echo ""
echo "Output files saved to: $OUTPUT_DIR/"
ls -lh "$OUTPUT_DIR"/"*.json" 2>/dev/null | awk '{print "  ", $9, "(" $5 ")"}'
echo ""
echo "Total files: $(ls -1 "$OUTPUT_DIR"/"*.json" 2>/dev/null | wc -l)"
echo ""
echo "To view an analysis:"
echo "  cat _output/Ali_Shan_Oolong.json | jq ."
echo ""
echo "To extract specific data:"
echo "  jq '.data.compounds' _output/*.json"
echo ""
