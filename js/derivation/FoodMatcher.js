// js/derivation/FoodMatcher.js
// Rewritten version (April 10, 2025) to ensure correct input handling,
// implement clearer scoring logic, clustering, and detailed tracing.

// Import necessary descriptors if they live in separate files
// import { flavorCategoryToFoodGroups, flavorToSpecificFoods } from '../descriptors/FoodPairingDescriptors.js'; // Example

export class FoodMatcher {
    constructor(config = {}) {
        // --- Configuration ---
        this.config = {
            clusterThreshold: config.clusterThreshold || 75, // Score needed for a food to be part of a cluster
            maxRecommendations: config.maxRecommendations || 5, // Max individual foods to list as "Recommended"
            baseScore: 50,              // Starting score for potential pairings
            // Scoring Bonuses/Penalties (Adjust these values for tuning)
            hintBonus: 30,              // For direct hints from FlavorAnalysis
            categoryBonus: 15,          // For hints derived from flavor categories
            specificFlavorBonus: 20,    // For hints from specific dominant flavors
            mouthfeelBonus: 10,         // Adjustment (+/-) based on mouthfeel compatibility
            intensityBonus: 10,         // Adjustment (+/-) based on intensity matching
            roastBonus: 20,             // Boost for foods good with roasted teas
            heavyRoastExtra: 10         // Additional boost for specific heavy roast pairings
        };

        // --- Mappings & Definitions ---
        // (These can be moved to descriptor files and imported if preferred)
        
        // Define food clusters with related items
        this.foodClusters = [
             { occasion: "Breakfast", foods: ["Breakfast Foods", "Toast", "Oatmeal", "Yogurt", "Fruit Salad", "Pancakes", "Pastries", "Scones", "Eggs"] },
             { occasion: "Light Lunch", foods: ["Salads", "Sandwiches", "Light Soups", "Steamed Vegetables", "Sushi", "Rice Dishes", "Light Cheese", "Wraps", "Quiche"] },
             { occasion: "Afternoon Tea", foods: ["Pastries", "Light Desserts", "Scones", "Cookies", "Cakes", "Biscuits", "Fruit Tarts", "Madeleines"] },
             { occasion: "Dinner", foods: ["Grilled Meats", "Roasted Vegetables", "Stews", "Rich Soups", "Dark Meats", "Mushrooms", "Root Vegetables", "Fish Dishes", "Hearty Dishes", "Game Meats"] },
             { occasion: "Dessert", foods: ["Desserts", "Chocolate", "Light Desserts", "Fruit Desserts", "Ice Cream", "Sorbets", "Sweet Pastries", "Rich Desserts", "Custards", "Spiced Desserts", "Creamy Desserts"] },
             { occasion: "Asian Cuisine", foods: ["Sushi", "Steamed Rice", "Rice Dishes", "Stir-fried Vegetables", "Tofu", "Miso Soup", "Noodles", "Dumplings", "Thai Curry", "Dim Sum", "Seafood"] },
             { occasion: "Mediterranean Cuisine", foods: ["Olive Oil", "Fresh Herbs", "Cheese", "Grilled Fish", "Salads", "Hummus", "Falafel", "Lamb Dishes"] },
             { occasion: "Cheese Pairing", foods: ["Cheese", "Hard Cheese", "Soft Cheese", "Goat Cheese", "Brie", "Cheddar", "Blue Cheese", "Cheese Plates", "Light Cheese", "Strong Cheese"] },
             { occasion: "Spiced Foods Pairing", foods: ["Spiced Cakes", "Curries", "Spiced Dishes", "Thai Curry", "Middle Eastern Sweets"] }
        ];

        // Map flavor categories to relevant food items or groups
        this.flavorCategoryToFoods = {
             "floral": ["Light Desserts", "Pastries", "Fruit Salads", "White Fish"],
             "fruity": ["Fruits", "Salads", "Light Desserts", "Pastries", "Yogurt", "Chicken", "Pork Dishes"],
             "citrus": ["Seafood", "Salads", "Chicken", "Light Desserts", "Fish Dishes"],
             "vegetal": ["Steamed Vegetables", "Salads", "Rice Dishes", "Sushi", "Light Soups", "Tofu"],
             "grassy": ["Salads", "Steamed Vegetables", "Light Soups", "White Fish", "Sushi"],
             "nutty": ["Baked Goods", "Cheese", "Hard Cheese", "Roasted Vegetables", "Pastries", "Roasted Nuts"],
             "toasted": ["Baked Goods", "Roasted Vegetables", "Grilled Meats", "Breakfast Foods", "Roasted Nuts"],
             "roasted": ["Grilled Meats", "Roasted Vegetables", "Dark Chocolate", "Hard Cheese", "Comfort Foods", "Mushrooms", "Root Vegetables", "BBQ", "Smoked Foods"],
             "spicy": ["Spiced Cakes", "Curries", "Spiced Dishes", "Rich Stews", "Grilled Meats", "Thai Curry"],
             "sweet": ["Desserts", "Pastries", "Fruits", "Breakfast Foods", "Baked Goods", "Light Desserts", "Fruit Desserts", "Yogurt"],
             "chocolate": ["Chocolate", "Rich Desserts", "Pastries", "Berries", "Coffee"],
             "earthy": ["Mushrooms", "Root Vegetables", "Dark Meats", "Rich Stews", "Game Meats", "Stews"],
             "mineral": ["Seafood", "Shellfish", "Light Cheese", "Oysters", "Sushi", "Steamed Vegetables"],
             "woody": ["Smoked Foods", "Grilled Meats", "Hard Cheese", "Mushrooms", "Game Meats"],
             "umami": ["Seafood", "Mushrooms", "Savory Dishes", "Sushi", "Stews", "Rich Soups", "Miso Soup", "Aged Cheese"]
        };

        // Map specific flavors to specific foods (can overlap with category hints)
        this.flavorToSpecificFoods = {
            "jasmine": ["Light Desserts", "Steamed Vegetables"],
            "bergamot": ["Citrus Desserts", "Scones", "Dark Chocolate"],
            "cinnamon": ["Baked Goods", "Apples", "Spiced Desserts"],
            "vanilla": ["Ice Cream", "Custards", "Light Cakes", "Pastries"],
            "chocolate": ["Dark Chocolate", "Chocolate Desserts", "Berries"],
            "honey": ["Yogurt", "Nuts", "Fruits", "Toast", "Light Cheese"],
            "caramel": ["Apples", "Ice Cream", "Nuts", "Dark Chocolate", "Baked Goods", "Roasted Meats"],
            "peach": ["Cream Desserts", "Light Cakes", "Soft Cheese"],
            "dark fruits": ["Dark Chocolate", "Game Meats", "Strong Cheese", "Spiced Desserts"],
            "apple": ["Pork Dishes", "Caramel", "Cheddar"],
            "citrus": ["Seafood", "Salads", "Chicken"],
            "smoke": ["Smoked Meats", "BBQ", "Strong Cheese"],
            "malt": ["Baked Goods", "Biscuits", "Breakfast Foods"],
            "orchid": ["Creamy Desserts", "Tropical Fruit"],
            "mineral": ["Oysters", "Seafood"],
            "umami": ["Sushi", "Miso Soup", "Mushrooms"],
            "marine": ["Sushi", "Seafood", "Rice Dishes"],
            "roasted": ["Roasted Nuts", "Grilled Meats", "Coffee"], // Generic roasted
            "coffee": ["Chocolate", "Desserts", "Breakfast Pastries"], // For coffee-like notes
            "earthy": ["Mushrooms", "Root Vegetables"], // Generic earthy
            "woody": ["Hard Cheese", "Smoked Foods"] // Generic woody
        };

        // Collect all unique food items mentioned for initialization and validation
        this.allKnownFoods = this.collectAllKnownFoods();
    }

    /**
     * Collect all unique food names from hints and clusters. Normalizes names.
     */
    collectAllKnownFoods() {
        const foodSet = new Set();
        Object.values(this.flavorCategoryToFoods).flat().forEach(food => foodSet.add(this.normalizeFood(food)));
        Object.values(this.flavorToSpecificFoods).flat().forEach(food => foodSet.add(this.normalizeFood(food)));
        this.foodClusters.forEach(cluster => cluster.foods.forEach(food => foodSet.add(this.normalizeFood(food))));
        // Add any other base foods you want to ensure exist
        ['Seafood', 'Sushi', 'Rice Dishes', 'Light Vegetables', 'Light Desserts', 'Steamed Vegetables', 'White Fish', 'Salads'].forEach(f => foodSet.add(f));
        return Array.from(foodSet).sort(); // Sort for consistency
    }

    /**
     * Normalize a food or group name (Capitalize Words, Handle Simple Plurals).
     */
    normalizeFood(food) {
        if (!food || typeof food !== 'string') return '';
        // Capitalize first letter of each word
        let normalized = food.trim().toLowerCase()
                           .split(/[\s-]+/)
                           .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                           .join(' ');

        // Handle common variations explicitly BEFORE plural check
         const foodMap = {
             "Chocolates": "Chocolate", "Chocolate desserts": "Chocolate Desserts",
             "Fresh fruits": "Fruits", "Fresh fruit": "Fruits",
             "Savory dishes": "Savory Dishes", "Spicy foods": "Spiced Dishes",
             "Baked goods": "Baked Goods", "Roasted nuts": "Roasted Nuts",
             "Light vegetable": "Light Vegetables", "Steamed vegetable": "Steamed Vegetables",
             "Root vegetable": "Root Vegetables", "Grilled meat": "Grilled Meats",
             "Dark meat": "Dark Meats", "Light meat": "Light Meats", "Game meat": "Game Meats",
             "Roasted meat": "Roasted Meats", "Smoked meat": "Smoked Meats",
             "Oyster": "Oysters", "Mushroom": "Mushrooms", "Pastry": "Pastries",
             "Light soup": "Light Soups", "Rich soup": "Rich Soups",
             "Hard cheeses": "Hard Cheese", "Light cheeses": "Light Cheese", "Soft cheeses": "Soft Cheese",
             // Add other variations as needed
         };
         if (foodMap[normalized]) {
             normalized = foodMap[normalized];
         }

        // Basic pluralization check (attempt to singularize if plural exists and singular is known)
        if (normalized.endsWith('s')) {
            let singularForm = normalized.slice(0, -1);
            if (normalized.endsWith('es')) {
                singularForm = normalized.slice(0, -2);
            }
            // Only singularize if the singular form is actually in our known list
            if (this.allKnownFoods && this.allKnownFoods.includes(singularForm)) {
                 return singularForm;
            }
        }
        return normalized;
    }

    /**
     * Get the numerical intensity level from a string description.
     */
    getIntensityLevel(intensityString) {
        const levelMap = { "subtle": 1, "very low": 1, "moderate": 3, "medium": 3, "pronounced": 4, "high": 4, "intense": 4, "very high": 5, "very intense": 5, "bold": 5 };
        return levelMap[intensityString?.toLowerCase()] || 3; // Default to medium
    }

    /**
     * Get foods belonging to a specific food cluster by occasion name.
     */
    foodsInGroup(groupName) {
        const normalizedGroup = this.normalizeFood(groupName); // Normalize group name for lookup
        const cluster = this.foodClusters.find(c => this.normalizeFood(c.occasion) === normalizedGroup);
        return cluster ? cluster.foods.map(f => this.normalizeFood(f)) : []; // Return normalized food names
    }

    /**
     * Helper to add score to a food with tracing. Ensures food exists in known list.
     */
    addFoodWithTrace(trace, scoreMap, food, score, reasonStep, reasonDetail) {
        const normalizedFood = this.normalizeFood(food);
        // Only add score if the food is in our known list
        if (this.allKnownFoods.includes(normalizedFood)) {
            const currentScore = scoreMap.get(normalizedFood) || 0; // Should have been initialized
        const newScore = currentScore + score;
            scoreMap.set(normalizedFood, newScore);
        
        trace.push({
            step: reasonStep,
            reason: reasonDetail,
                adjustment: `${score >= 0 ? '+' : ''}${score} -> ${normalizedFood}`,
                value: newScore.toFixed(0)
            });
        } else {
             trace.push({ step: "Hint Skipped", reason: `Food/Group '${food}' not in known list`, adjustment: "No score added"});
        }
    }

    /**
     * Main function to match tea to foods.
     */
    matchFood(flavorAnalysis = {}, processingAnalysis = {}, teaTypeAnalysis = {}) {
        let trace = [];
        const foodPairingScores = new Map();

        // --- 1. Initialize Scores ---
        this.allKnownFoods.forEach(food => foodPairingScores.set(food, this.config.baseScore));
        trace.push({ step: "Score Initialization", reason: "Baseline setup", adjustment: `Initialized ${this.allKnownFoods.length} foods with score ${this.config.baseScore}` });

        // --- 2. Extract Inputs ---
        const flavorHints = flavorAnalysis?.analysis?.foodPairingHints ?? [];
        const dominantCategories = flavorAnalysis?.profile?.categories ?? [];
        const dominantFlavors = flavorAnalysis?.profile?.dominant ?? [];
        // const allIdentifiedFlavors = flavorAnalysis?.profile?.identified ?? []; // Use if needed
        const intensityString = flavorAnalysis?.profile?.intensity ?? "Moderate";
        const intensityLevel = this.getIntensityLevel(intensityString);
        const mouthfeelDescriptor = processingAnalysis?.analysis?.bodyImpact ?? "";
        const roastLevel = processingAnalysis?.roastLevel ?? "None";
        
        trace.push({
            step: "Input Extraction", reason: "Processing analysis objects",
            adjustment: `Hints:${flavorHints.length}, Categories:${dominantCategories.length}, Dominant:${dominantFlavors.length}, Intensity:${intensityString}(${intensityLevel}), Mouthfeel:${mouthfeelDescriptor}, Roast:${roastLevel}`,
            value: `Dominant Flavors: ${dominantFlavors.join(', ')}`
        });

        if (dominantFlavors.length === 0 && dominantCategories.length === 0 && flavorHints.length === 0) {
            trace.push({ step: "Warning", reason: "Missing core flavor inputs", adjustment: "Food matching accuracy reduced." });
        }

        // --- 3. Apply Scores from Direct Flavor Hints (from FlavorInfluences) ---
        if (flavorHints.length > 0) {
            trace.push({ step: "Applying Direct Hints", reason: "Direct hints from FlavorAnalysis", adjustment: `Processing ${flavorHints.length} hints` });
            flavorHints.forEach(hint => {
                 this.addFoodWithTrace(trace, foodPairingScores, hint, this.config.hintBonus, "Flavor Pairing Hint", `Hint: '${hint}'`);
            });
        }

        // --- 4. Apply Scores from Dominant Flavor Categories ---
        if (dominantCategories.length > 0) {
            trace.push({ step: "Applying Category Hints", reason: "Dominant categories identified", adjustment: `Processing ${dominantCategories.length} categories` });
            dominantCategories.forEach(category => {
                const categoryLower = category.toLowerCase();
                const foodsToBoost = this.flavorCategoryToFoods[categoryLower] || [];
                if (foodsToBoost.length > 0) {
                    trace.push({ step: "Category Mapping", reason: `For category '${category}'`, adjustment: `Boosting ${foodsToBoost.length} foods/groups` });
                    foodsToBoost.forEach(foodOrGroup => {
                        this.addFoodWithTrace(trace, foodPairingScores, foodOrGroup, this.config.categoryBonus, "Category-Based Pairing", `From category '${category}' -> '${foodOrGroup}'`);
                    });
                }
            });
        }
        
        // --- 5. Apply Scores from Specific Dominant Flavors ---
        if (dominantFlavors.length > 0) {
            trace.push({ step: "Applying Specific Flavor Hints", reason: "Dominant flavors identified", adjustment: `Processing ${dominantFlavors.length} dominant flavors` });
            dominantFlavors.forEach(flavor => {
                const specificFoods = this.flavorToSpecificFoods[flavor.toLowerCase()] || [];
                if (specificFoods.length > 0) {
                    trace.push({ step: "Flavor-Specific Pairings", reason: `For dominant flavor '${flavor}'`, adjustment: `Boosting ${specificFoods.length} specific foods` });
                    specificFoods.forEach(food => {
                        this.addFoodWithTrace(trace, foodPairingScores, food, this.config.specificFlavorBonus, "Flavor-Specific Pairing", `Paired with dominant '${flavor}'`);
                    });
                }
            });
        }
        
        // --- 6. Apply Adjustments (Mouthfeel, Intensity, Roast) ---
        // Mouthfeel
        if (mouthfeelDescriptor) {
            const mouthfeelLower = mouthfeelDescriptor.toLowerCase();
            trace.push({ step: "Mouthfeel Adjustment", reason: `Mouthfeel: '${mouthfeelDescriptor}'`, adjustment: "Applying score adjustments" });
            if (mouthfeelLower.includes('thick') || mouthfeelLower.includes('full') || mouthfeelLower.includes('robust')) {
                ["Cheese", "Hard Cheese", "Dark Meats", "Rich Stews", "Game Meats", "Grilled Meats", "Roasted Vegetables"].forEach(f => this.addFoodWithTrace(trace, foodPairingScores, f, this.config.mouthfeelBonus, "Mouthfeel Boost", `For '${mouthfeelDescriptor}'`));
            } else if (mouthfeelLower.includes('light') || mouthfeelLower.includes('thin') || mouthfeelLower.includes('delicate')) {
                 ["Fruits", "Salads", "Light Desserts", "Steamed Vegetables", "White Fish", "Light Soups"].forEach(f => this.addFoodWithTrace(trace, foodPairingScores, f, this.config.mouthfeelBonus, "Mouthfeel Boost", `For '${mouthfeelDescriptor}'`));
                 ["Rich Stews", "Dark Meats", "Strong Cheese", "BBQ"].forEach(f => this.addFoodWithTrace(trace, foodPairingScores, f, -this.config.mouthfeelBonus, "Mouthfeel Penalty", `For '${mouthfeelDescriptor}'`));
            }
            if (mouthfeelLower.includes('creamy') || mouthfeelLower.includes('smooth') || mouthfeelLower.includes('silky') || mouthfeelLower.includes('buttery')) {
                ["Pastries", "Light Desserts", "Creamy Desserts", "Custards", "Soft Cheese", "Fruits"].forEach(f => this.addFoodWithTrace(trace, foodPairingScores, f, this.config.mouthfeelBonus, "Mouthfeel Boost", `For '${mouthfeelDescriptor}'`));
            }
            if (mouthfeelLower.includes('astringent') || mouthfeelLower.includes('tannic') || mouthfeelLower.includes('brisk') || mouthfeelLower.includes('dry')) {
                 ["Rich Desserts", "Cheese", "Hard Cheese", "Creamy Desserts", "Fatty Foods", "Smoked Meats"].forEach(f => this.addFoodWithTrace(trace, foodPairingScores, f, this.config.mouthfeelBonus, "Mouthfeel Boost", `For '${mouthfeelDescriptor}'`)); // Add Fatty Foods if needed
                 ["Delicate Desserts", "Light Salads", "Steamed Vegetables"].forEach(f => this.addFoodWithTrace(trace, foodPairingScores, f, -this.config.mouthfeelBonus, "Mouthfeel Penalty", `For '${mouthfeelDescriptor}'`));
            }
        }

        // Intensity
        trace.push({ step: "Intensity Adjustment", reason: `Intensity: ${intensityString} (Level ${intensityLevel})`, adjustment: "Applying score adjustments" });
        if (intensityLevel >= 4) { // Pronounced/Intense/Bold
            ["Strong Cheese", "Spiced Dishes", "Curries", "Grilled Meats", "Dark Chocolate", "Game Meats", "BBQ", "Smoked Foods", "Rich Stews"].forEach(f => this.addFoodWithTrace(trace, foodPairingScores, f, this.config.intensityBonus, "Intensity Boost", `For high intensity (${intensityLevel})`));
            ["Light Desserts", "Steamed Vegetables", "White Fish", "Light Soups", "Salads", "Delicate Flavors"].forEach(f => this.addFoodWithTrace(trace, foodPairingScores, f, -this.config.intensityBonus, "Intensity Penalty", `For high intensity (${intensityLevel})`));
        } else if (intensityLevel <= 2) { // Subtle/Low
             ["Light Desserts", "Steamed Vegetables", "White Fish", "Fresh Fruits", "Salads", "Delicate Flavors", "Light Soups", "Rice Dishes"].forEach(f => this.addFoodWithTrace(trace, foodPairingScores, f, this.config.intensityBonus, "Intensity Boost", `For low intensity (${intensityLevel})`));
             ["Strong Cheese", "Spiced Dishes", "Curries", "Rich Stews", "Smoked Foods", "BBQ", "Dark Meats"].forEach(f => this.addFoodWithTrace(trace, foodPairingScores, f, -this.config.intensityBonus, "Intensity Penalty", `For low intensity (${intensityLevel})`));
        }

        // Roast Level
        if (roastLevel === "Heavy" || roastLevel === "Medium" || roastLevel === "Charcoal") {
            const roastedFoods = ["Roasted Nuts", "Dark Chocolate", "Grilled Meats", "Spiced Foods", "Hard Cheese", "Root Vegetables", "Baked Goods", "Rich Stews", "Mushrooms", "Coffee", "BBQ", "Smoked Foods", "Game Meats"];
            trace.push({ step: "Roast Level Adjustment", reason: `Roast: ${roastLevel}`, adjustment: `Boosting ${roastedFoods.length} roast-compatible foods` });
            roastedFoods.forEach(food => {
                this.addFoodWithTrace(trace, foodPairingScores, food, this.config.roastBonus, "Roast Level Pairing", `Roast: ${roastLevel}`);
            });
            if (roastLevel === "Heavy" || roastLevel === "Charcoal") {
                 ["Dark Chocolate", "Spiced Desserts", "Game Meats", "Rich Stews", "BBQ"].forEach(f => this.addFoodWithTrace(trace, foodPairingScores, f, this.config.heavyRoastExtra, "Heavy Roast Pairing", `Extra boost for ${roastLevel}`));
            }
        }

        // --- 7. Final Processing ---
        const rawScoresArray = Array.from(foodPairingScores.entries()).map(([food, score]) => `${food}: ${score.toFixed(0)}`);
        trace.push({ step: "Raw Scores Calculation", reason: "Aggregated scores before normalization", adjustment: `Total scores calculated: ${foodPairingScores.size}`, value: rawScoresArray.length > 5 ? rawScoresArray.slice(0, 5).join('; ') + '...' : rawScoresArray.join('; ') });

        const normalizedScores = this.normalizeFoodScores(foodPairingScores);
        trace.push({ step: "Score Normalization", reason: "Scaling scores to 0-100", adjustment: `Normalized ${Object.keys(normalizedScores).length} scores`});
        
        const recommendedPairings = this.getRecommendedPairings(normalizedScores);
        trace.push({ step: "Recommendation Generation", reason: "Selecting top pairings", adjustment: `Selected ${recommendedPairings.length} pairings`, value: recommendedPairings.map(p => `${p.name}(${p.score})`).join(', ') });

        const mealClusters = this.groupFoodPairings(normalizedScores); // Use renamed function
        trace.push({ step: "Cluster Identification", reason: "Grouping recommendations", adjustment: `Identified ${mealClusters.length} clusters`, value: mealClusters.map(c => `${c.occasion}(${c.score}%)`).join(', ') });

        const description = this.generateFoodDescription({ recommendedFoods: recommendedPairings, mealClusters: mealClusters }); // Adjusted parameter names
        trace.push({ step: "Description Generation", reason: "Creating summary", adjustment: "Generated final description" });

        // Return the final results including the trace
        return {
            recommendations: normalizedScores, // Full map of normalized scores
            recommendedFoods: recommendedPairings, // Top N list [{name, score}]
            mealClusters: mealClusters, // Clustered list [{occasion, foods: [{name, score}], score}]
            description: description, // Human-readable summary
            trace: trace // Detailed log of steps
        };
    }

    // --- Helper Functions --- (Keep/Adapt normalizeFoodScores, getRecommendedPairings, groupFoodPairings, generateFoodDescription from previous version)
    
    /**
     * Normalize the food scores to a 0-100 scale
     */
    normalizeFoodScores(foodScores) {
        const result = {};
        if (foodScores.size === 0) return { "Versatile": 50 };

        const scores = [...foodScores.values()];
        const maxScore = Math.max(...scores, 1); // Ensure maxScore is at least 1
        const minScore = Math.min(...scores, this.config.baseScore); // Min observed, but not less than base
        
        for (const [food, score] of foodScores.entries()) {
            let normalizedScore = 0;
            // Avoid division by zero if max/min are same (or very close)
            if (maxScore > minScore) {
                // Scale score between 0 and 100 based on observed min/max range
                normalizedScore = Math.round(((score - minScore) / (maxScore - minScore)) * 100);
            } else if (maxScore > 0) {
                // If all scores are the same (and > 0), set normalized to 100
                normalizedScore = 100;
            }
            // Ensure score is within 0-100 bounds
            result[food] = Math.max(0, Math.min(normalizedScore, 100));
        }
        return result;
    }
    
    /**
     * Get recommended food pairings based on normalized scores
     */
    getRecommendedPairings(normalizedScores) {
        const sortedFoods = Object.entries(normalizedScores)
            .sort(([, scoreA], [, scoreB]) => scoreB - scoreA);
        
        if (sortedFoods.length === 0) return [{ name: "Versatile", score: 50 }];
        
        const maxScore = sortedFoods[0][1];
        // Use absolute threshold and relative threshold for better recommendations
        const absoluteThreshold = 65;
        const relativeThreshold = 20; // Within X points of top score
        
        const topFoods = sortedFoods
            .filter(([food, score]) => score >= absoluteThreshold && score >= maxScore - relativeThreshold)
            .map(([food, score]) => ({ name: food, score }));
        
        // Fallback if filtering leaves nothing
        if (topFoods.length === 0 && sortedFoods.length > 0) {
            return [{ name: sortedFoods[0][0], score: sortedFoods[0][1] }];
        }
        
        return topFoods.slice(0, this.config.maxRecommendations);
    }
    
    /**
     * Group food pairings into thematic clusters
     */
    groupFoodPairings(normalizedScores) {
        const result = [];
        const threshold = this.config.clusterThreshold;
        
        this.foodClusters.forEach(cluster => {
            const matchingFoods = [];
            let totalScore = 0;
            let count = 0;

            cluster.foods.forEach(foodName => {
                const normalizedFoodName = this.normalizeFood(foodName);
                const score = normalizedScores[normalizedFoodName];
                if (score !== undefined && score >= threshold) {
                    matchingFoods.push({ name: normalizedFoodName, score: score });
                    totalScore += score;
                    count++;
                }
            });

            if (count >= 1) { // Require at least one food above threshold to form cluster
                matchingFoods.sort((a, b) => b.score - a.score); // Sort foods within cluster
                const avgScore = Math.round(totalScore / count);
                result.push({
                    occasion: cluster.occasion, // Use 'occasion' from cluster definition
                    foods: matchingFoods,
                    score: avgScore
                });
            }
        });
        
        result.sort((a, b) => b.score - a.score); // Sort clusters by average score
        return result;
    }
    
    /**
     * Generate a description of recommended foods and clusters
     */
    generateFoodDescription(results) {
        const { recommendedFoods, mealClusters } = results;
        
        if (!recommendedFoods || recommendedFoods.length === 0 || (recommendedFoods.length === 1 && recommendedFoods[0].name === "Versatile")) {
            return "This tea is versatile and pairs well with a wide variety of foods.";
        }
        
        let description = "This tea pairs especially well with ";
        if (recommendedFoods.length === 1) {
            description += `${recommendedFoods[0].name.toLowerCase()} (${recommendedFoods[0].score}% match).`;
        } else {
            const foodNames = recommendedFoods.map(f => `${f.name.toLowerCase()} (${f.score}%)`);
            description += `${foodNames.slice(0, -1).join(', ')}, and ${foodNames.slice(-1)[0]}.`;
        }

        if (mealClusters && mealClusters.length > 0) {
            const topCluster = mealClusters[0];
            description += ` It's particularly suited for "${topCluster.occasion}" occasions (${topCluster.score}% match).`;
        }
        
        return description;
    }
}

// Export the class
export default FoodMatcher;